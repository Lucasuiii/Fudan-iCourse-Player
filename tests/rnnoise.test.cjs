const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
function processor() {
  let Processor;
  const code = fs.readFileSync(path.join(__dirname, '../vendor/rnnoise-worklet.js'), 'utf8').replaceAll('import.meta.url', '""');
  vm.runInNewContext(code, {
    WebAssembly, atob, performance, console, sampleRate: 48000,
    AudioWorkletProcessor: class { constructor() { this.port = { postMessage() {} }; } },
    registerProcessor(_name, value) { Processor = value; }
  });
  return new Processor();
}
function render(node, input, second = input) {
  const output = [new Float32Array(input.length), new Float32Array(input.length)];
  for (let i = 0; i < input.length; i += 128) {
    const block = [new Float32Array(Math.min(128, input.length - i)), new Float32Array(Math.min(128, input.length - i))];
    node.process([[input.subarray(i, i + 128), second.subarray(i, i + 128)]], [block]);
    output[0].set(block[0], i); output[1].set(block[1], i);
  }
  return output;
}
function rms(array, start = 0) { let sum = 0; for (let i = start; i < array.length; i++) { assert.ok(Number.isFinite(array[i])); sum += array[i] ** 2; } return Math.sqrt(sum / (array.length - start)); }
test('real RNNoise WASM suppresses steady fan-like noise, with independent stereo and bounded samples', () => {
  const node = processor();
  let seed = 123, low = 0;
  const input = Float32Array.from({ length: 48000 * 3 }, (_, i) => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    low = .8 * low + .2 * (seed / 4294967296 * 2 - 1);
    return .07 * low + .015 * Math.sin(2 * Math.PI * 120 * i / 48000);
  });
  const [output, silent] = render(node, input, new Float32Array(input.length));
  const attenuation = 20 * Math.log10(rms(input, 48000) / rms(output, 48000));
  assert.ok(attenuation > 6, `noise attenuation ${attenuation.toFixed(1)} dB`);
  assert.equal(rms(silent), 0);
  assert.ok(output.every(x => Math.abs(x) <= 1));
  node.port.onmessage({ data: 'dispose' });
  assert.equal(node.process([], []), false);
});
test('480-sample frames span 128-sample render blocks without dropping audio; mono duplicates to stereo', () => {
  const node = processor();
  const input = Float32Array.from({ length: 48000 }, (_, i) => .15 * Math.sin(i * .05));
  const [left, right] = render(node, input);
  assert.deepEqual(left, right);
  assert.equal(rms(left.subarray(0, 480)), 0);
  assert.ok(rms(left, 4800) > 0);
  node.port.onmessage({ data: 'dispose' });
});
