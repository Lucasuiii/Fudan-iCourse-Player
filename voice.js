/* Shared by the offscreen page and browser audio checks. */
(function (root) {
  'use strict';
  function createVoiceGraph(context, source, onFallback = () => {}) {
    const highpass = context.createBiquadFilter();
    highpass.type = 'highpass'; highpass.frequency.value = 85; highpass.Q.value = 0.707;
    const hum = context.createBiquadFilter();
    hum.type = 'notch'; hum.frequency.value = 50; hum.Q.value = 12;
    const mud = context.createBiquadFilter();
    mud.type = 'peaking'; mud.frequency.value = 250; mud.Q.value = 0.7; mud.gain.value = -2;
    const presence = context.createBiquadFilter();
    presence.type = 'peaking'; presence.frequency.value = 2200; presence.Q.value = 0.8; presence.gain.value = 2.5;
    const lowpass = context.createBiquadFilter();
    lowpass.type = 'lowpass'; lowpass.frequency.value = 7500; lowpass.Q.value = 0.707;
    const compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -18; compressor.knee.value = 12; compressor.ratio.value = 1.5;
    compressor.attack.value = 0.01; compressor.release.value = 0.18;
    // Cancel the fixed Web Audio makeup gain, so compression does not lift quiet noise.
    const makeupCompensation = Math.pow(10, 0.6 * compressor.threshold.value * (1 - 1 / compressor.ratio.value) / 20);
    const dry = context.createGain();
    const wet = context.createGain();
    dry.gain.value = 1; wet.gain.value = 0;
    source.connect(dry).connect(context.destination);
    source.connect(highpass).connect(hum).connect(mud).connect(presence).connect(lowpass).connect(compressor).connect(wet).connect(context.destination);
    let denoiser = null, disposed = false;
    let mode = 'eq';
    const fallback = () => {
      if (!denoiser || disposed) return;
      source.disconnect(denoiser);
      denoiser.disconnect();
      denoiser.port.postMessage('dispose');
      denoiser = null;
      source.connect(highpass);
      mode = 'eq';
      onFallback();
    };
    return {
      get mode() { return mode; },
      async loadDenoiser(url) {
        if (!context.audioWorklet || context.sampleRate !== 48000) return false;
        let candidate, timeout, cancelled = false;
        try {
          await Promise.race([
            (async () => {
              await context.audioWorklet.addModule(url);
              if (disposed || cancelled) throw new Error('Audio graph closed');
              candidate = new root.AudioWorkletNode(context, 'lyue-rnnoise', {
                numberOfInputs: 1, numberOfOutputs: 1, outputChannelCount: [2], channelCount: 2, channelCountMode: 'explicit'
              });
              await new Promise((resolve, reject) => {
                candidate.port.onmessage = ({ data }) => { if (data === 'ready') resolve(); };
                candidate.onprocessorerror = () => reject(new Error('RNNoise initialization failed'));
              });
            })(),
            new Promise((_, reject) => { timeout = setTimeout(() => reject(new Error('RNNoise timeout')), 5000); })
          ]);
          if (disposed) throw new Error('Audio graph closed');
          candidate.connect(highpass);
          source.connect(candidate);
          source.disconnect(highpass);
          denoiser = candidate;
          denoiser.onprocessorerror = fallback;
          mode = 'rnnoise';
          return true;
        } catch (_) {
          cancelled = true;
          candidate?.disconnect();
          candidate?.port.postMessage('dispose');
          return false;
        } finally { clearTimeout(timeout); }
      },
      setEnabled(enabled) {
        const now = context.currentTime;
        for (const [node, target] of [[dry, enabled ? 0 : 1], [wet, enabled ? makeupCompensation : 0]]) {
          node.gain.cancelScheduledValues(now);
          node.gain.setTargetAtTime(target, now, 0.02);
        }
      },
      disconnect() { disposed = true; denoiser?.port.postMessage('dispose'); denoiser?.disconnect(); for (const node of [source, highpass, hum, mud, presence, lowpass, compressor, dry, wet]) node.disconnect(); }
    };
  }
  root.ICourseVoice = { createVoiceGraph };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.ICourseVoice;
})(globalThis);
