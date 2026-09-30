const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
function bridge() {
  const emitted = [], sent = [];
  let worker, node, disconnected = 0;
  class Worker {
    constructor() { worker = this; }
    postMessage(message) { sent.push(message); }
    terminate() { this.terminated = true; }
    emit(data) { this.onmessage({ data }); }
  }
  class AudioWorkletNode {
    constructor() { node = this; this.port = {}; }
    connect() { return { connect() {} }; }
    disconnect() {}
  }
  const context = { audioWorklet: { addModule: async () => {} }, createGain: () => ({ gain: {}, disconnect() {} }), destination: {} };
  const source = { connect: n => n, disconnect() { disconnected++; } };
  const scope = { Worker, AudioWorkletNode, performance: { now: () => 1000 }, setTimeout: () => 1, clearTimeout() {} };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../asr-session.js'), 'utf8'), scope);
  const session = new scope.ICourseASR.ASRSession(context, source, e => emitted.push(e));
  const pcm = () => node.port.onmessage({ data: { samples: new Float32Array(4800), sampleRate: 48000 } });
  return { session, emitted, sent, pcm, worker: () => worker, disconnected: () => disconnected };
}
test('ASR only consumes ready, playing 1x audio; inference is separate from playback', async () => {
  const app = bridge(); await app.session.start();
  app.pcm(); assert.equal(app.sent.length, 1);
  app.worker().emit({ type: 'ready' }); app.pcm(); assert.equal(app.sent.length, 1);
  app.session.setClock({ epoch: 1, time: 10, paused: false, rate: 2 }); app.pcm();
  assert.equal(app.sent.filter(m => m.type === 'samples').length, 0);
  app.session.setClock({ epoch: 2, time: 20, paused: false, rate: 1 }); app.pcm();
  const data = app.sent.at(-1);
  assert.equal(data.epoch, 2); assert.equal(data.time, 19.9); assert.equal(data.sampleRate, 48000);
});
test('seek invalidates queued audio and late recognition text', async () => {
  const app = bridge(); await app.session.start(); app.worker().emit({ type: 'ready' });
  app.session.setClock({ epoch: 1, time: 0, paused: false, rate: 1 }); app.pcm(); app.pcm();
  assert.equal(app.session.pending.length, 1);
  app.session.setClock({ epoch: 2, time: 60, paused: false, rate: 1 });
  assert.equal(app.session.pending.length, 0);
  app.worker().emit({ type: 'text', epoch: 1, text: 'old' });
  app.worker().emit({ type: 'text', epoch: 2, text: 'new' });
  assert.equal(app.emitted.filter(e => e.type === 'text').length, 1);
  assert.equal(app.emitted.at(-1).text, 'new');
});
test('acknowledgements bound in-flight work; excessive backlog fails only recognition', async () => {
  const app = bridge(); await app.session.start(); app.worker().emit({ type: 'ready' });
  app.session.setClock({ epoch: 1, time: 0, paused: false, rate: 1 });
  app.pcm(); app.pcm(); assert.equal(app.sent.filter(m => m.type === 'samples').length, 1);
  app.worker().emit({ type: 'ack', epoch: 1 }); assert.equal(app.sent.filter(m => m.type === 'samples').length, 2);
  for (let i = 0; i < 7 && !app.session.closed; i++) app.pcm();
  assert.equal(app.session.closed, true); assert.equal(app.worker().terminated, true);
  assert.equal(app.session.pending.length, 0); assert.equal(app.disconnected(), 1);
  assert.equal(app.emitted.at(-1).type, 'error');
});
test('closing recognition drops later worker events', async () => {
  const app = bridge(); await app.session.start(); app.session.close();
  app.worker().emit({ type: 'ready' }); assert.equal(app.emitted.length, 0);
});
test('PCM worklet downmixes channels and transfers complete 100ms blocks', () => {
  let Processor;
  const outputs = [];
  class AudioWorkletProcessor { port = { postMessage: message => outputs.push(message) }; }
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../pcm-worklet.js'), 'utf8'), {
    AudioWorkletProcessor, sampleRate: 48000, registerProcessor: (_name, cls) => { Processor = cls; }
  });
  const node = new Processor();
  for (let i = 0; i < 38; i++) node.process([[new Float32Array(128).fill(0.6), new Float32Array(128).fill(0.2)]]);
  assert.equal(outputs.length, 1); assert.equal(outputs[0].samples.length, 4800);
  assert.ok(Math.abs(outputs[0].samples[100] - 0.4) < 1e-6);
  assert.equal(outputs[0].sampleRate, 48000);
});
