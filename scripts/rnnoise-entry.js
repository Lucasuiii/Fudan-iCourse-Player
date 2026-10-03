// Lyue adapter for @jitsi/rnnoise-wasm; upstream licenses are in vendor/licenses.
import createModule from '@jitsi/rnnoise-wasm/dist/rnnoise-sync.js';
const wasm = createModule();
class Denoiser extends AudioWorkletProcessor {
  constructor() {
    super();
    if (sampleRate !== 48000) throw new Error('RNNoise requires 48 kHz');
    this.channels = Array.from({ length: 2 }, () => {
      const pointer = wasm._malloc(480 * 4);
      const state = wasm._rnnoise_create(0);
      if (!pointer || !state) throw new Error('RNNoise allocation failed');
      return { pointer, state, output: new Float32Array(480) };
    });
    this.position = 0;
    this.disposed = false;
    this.port.onmessage = ({ data }) => {
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
        wasm.HEAPF32[(channel.pointer >> 2) + this.position] = (input[c]?.[i] ?? input[0]?.[i] ?? 0) * 32768;
        if (output[c]) output[c][i] = channel.output[this.position];
      }
      if (++this.position === 480) {
        for (const channel of this.channels) {
          wasm._rnnoise_process_frame(channel.state, channel.pointer, channel.pointer);
          for (let j = 0; j < 480; j++) channel.output[j] = wasm.HEAPF32[(channel.pointer >> 2) + j] / 32768;
        }
        this.position = 0;
      }
    }
    return true;
  }
}
registerProcessor('lyue-rnnoise', Denoiser);
