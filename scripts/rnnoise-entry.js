// Lyue adapter for @jitsi/rnnoise-wasm; upstream licenses are in vendor/licenses.
import createModule from '@jitsi/rnnoise-wasm/dist/rnnoise-sync.js';
import { FrameEnhancer } from './voice-processing.mjs';
const wasm = createModule();
class Denoiser extends AudioWorkletProcessor {
  constructor(options = {}) {
    super();
    if (sampleRate !== 48000) throw new Error('RNNoise requires 48 kHz');
    this.enhancer = new FrameEnhancer();
    this.enhancer.configure(options.processorOptions?.settings);
    this.previousProbability = 0;
    this.olderProbability = 0;
    this.channels = Array.from({ length: 2 }, () => {
      const pointer = wasm._malloc(480 * 4);
      const state = wasm._rnnoise_create(0);
      if (!pointer || !state) throw new Error('RNNoise allocation failed');
      return { pointer, state, output: new Float32Array(480), raw: new Float32Array(480), previousRaw: new Float32Array(480), olderRaw: new Float32Array(480) };
    });
    this.wetFrames = this.channels.map(c => c.output);
    this.rawFrames = this.channels.map(c => c.olderRaw);
    this.position = 0;
    this.disposed = false;
    this.port.onmessage = ({ data }) => {
      if (data?.type === 'configure') this.enhancer.configure(data.settings);
      if (data === 'dispose' && !this.disposed) {
        this.disposed = true;
        for (const channel of this.channels) {
          wasm._rnnoise_destroy(channel.state);
          wasm._free(channel.pointer);
        }
      }
    };
    this.port.postMessage('ready');
  }
  process(inputs, outputs) {
    if (this.disposed) return false;
    const input = inputs[0];
    const output = outputs[0];
    for (let i = 0; i < output[0].length; i++) {
      for (let c = 0; c < 2; c++) {
        const channel = this.channels[c];
        // RNNoise uses float samples in signed 16-bit amplitude units.
        const value = input[c]?.[i] ?? input[0]?.[i] ?? 0;
        wasm.HEAPF32[(channel.pointer >> 2) + this.position] = value * 32768;
        channel.raw[this.position] = value;
        if (output[c]) output[c][i] = channel.output[this.position];
      }
      if (++this.position === 480) {
        let probability = 0;
        for (const channel of this.channels) {
          probability = Math.max(probability, wasm._rnnoise_process_frame(channel.state, channel.pointer, channel.pointer));
          for (let j = 0; j < 480; j++) channel.output[j] = wasm.HEAPF32[(channel.pointer >> 2) + j] / 32768;
        }
        // This RNNoise 0.2 build delays output by two frames; adapter adds one frame.
        // Match the measured 1440-sample (30 ms) wet latency before mixing raw.
        this.enhancer.process(this.wetFrames, this.rawFrames, this.olderProbability);
        this.olderProbability = this.previousProbability;
        this.previousProbability = probability;
        for (const channel of this.channels) { channel.olderRaw.set(channel.previousRaw); channel.previousRaw.set(channel.raw); }
        this.position = 0;
      }
    }
    return true;
  }
}
registerProcessor('lyue-rnnoise', Denoiser);
