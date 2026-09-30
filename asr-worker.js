/* global createOnlineRecognizer, Module */
'use strict';
let recognizer, stream, epoch = 0, segment = 0, start = null;
function reset(nextEpoch) {
  stream?.free();
  stream = recognizer?.createStream();
  epoch = nextEpoch; segment = 0; start = null;
}
function fail(error) { postMessage({ type: 'error', error: String(error?.message || error) }); }
self.onmessage = ({ data }) => {
  try {
    if (data.type === 'init') {
      self.Module = {
        locateFile: name => new URL('vendor/sherpa/' + name, self.location.href).href,
        print: () => {}, printErr: () => {},
        setStatus: text => postMessage({ type: 'loading', text }),
        onAbort: fail,
        onRuntimeInitialized() {
          try {
            recognizer = createOnlineRecognizer(self.Module);
            if (!recognizer.handle) throw new Error('无法加载中文流式模型');
            reset(epoch);
            postMessage({ type: 'ready' });
          } catch (error) { fail(error); }
        }
      };
      importScripts('vendor/sherpa/sherpa-onnx-asr.js', 'vendor/sherpa/sherpa-onnx-wasm-main-asr.js');
    } else if (data.type === 'reset') reset(data.epoch);
    else if (data.type === 'samples') {
      if (!stream || data.epoch !== epoch) { postMessage({ type: 'ack', epoch: data.epoch }); return; }
      if (start === null) start = data.time;
      // sherpa-onnx accepts the incoming sample rate and resamples internally to model features.
      stream.acceptWaveform(data.sampleRate, data.samples);
      while (recognizer.isReady(stream)) recognizer.decode(stream);
      const result = recognizer.getResult(stream);
      const final = recognizer.isEndpoint(stream);
      if (result.text) postMessage({ type: 'text', epoch, segment, text: result.text, final, start, end: data.time + data.samples.length / data.sampleRate });
      if (final) { recognizer.reset(stream); segment++; start = null; }
      postMessage({ type: 'ack', epoch });
    }
  } catch (error) { fail(error); }
};
