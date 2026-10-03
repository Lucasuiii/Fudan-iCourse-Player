const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createVoiceGraph } = require('../voice.js');
function fixture({ fail = false, pending = false } = {}) {
  const nodes = [];
  function node() {
    const value = { value: 0, cancelScheduledValues() {}, setTargetAtTime(v) { this.value = v; } };
    const n = { connections: [], connect(other) { this.connections.push(other); return other; }, disconnect(other) { this.connections = other ? this.connections.filter(x => x !== other) : []; } };
    for (const key of ['frequency', 'Q', 'gain', 'threshold', 'knee', 'ratio', 'attack', 'release']) n[key] = { ...value };
    nodes.push(n); return n;
  }
  const context = { sampleRate: 48000, currentTime: 0, destination: node(), createGain: node, createBiquadFilter: node, createDynamicsCompressor: node, createWaveShaper: node, audioWorklet: { addModule: async () => { if (fail) throw Error('CSP'); } } };
  const source = node(), recognizer = node(); source.connect(recognizer);
  let worklet;
  globalThis.AudioWorkletNode = class {
    constructor() { worklet = node(); worklet.port = { postMessage(v) { worklet.disposed = v === 'dispose'; } }; if (!pending) queueMicrotask(() => worklet.port.onmessage({ data: 'ready' })); return worklet; }
  };
  const graph = createVoiceGraph(context, source);
  return { context, source, recognizer, graph, worklet: () => worklet };
}
test('loading and processor failure preserve raw recognition branch and audible fallback', async () => {
  const f = fixture(); f.graph.setEnabled(true);
  assert.equal(await f.graph.loadDenoiser('local'), true);
  assert.equal(f.graph.mode, 'rnnoise');
  assert.ok(f.source.connections.includes(f.recognizer));
  f.worklet().onprocessorerror();
  assert.equal(f.graph.mode, 'eq');
  assert.ok(f.source.connections.includes(f.recognizer));
  assert.equal(f.source.connections.length, 3); // raw recognizer, dry, EQ
  assert.equal(f.worklet().disposed, true);
  f.graph.setEnabled(false);
  f.graph.disconnect(); assert.equal(f.source.connections.length, 0);
});
test('CSP failure and unsupported sample rate keep basic enhancement connected', async () => {
  const f = fixture({ fail: true });
  assert.equal(await f.graph.loadDenoiser('local'), false);
  assert.equal(f.graph.mode, 'eq'); assert.equal(f.source.connections.length, 3);
  f.context.sampleRate = 44100;
  assert.equal(await f.graph.loadDenoiser('local'), false);
  f.graph.disconnect();
});
test('closing graph during initialization disposes worklet and cannot reconnect a stopped capture', async () => {
  const f = fixture({ pending: true });
  const loading = f.graph.loadDenoiser('local');
  await new Promise(resolve => setImmediate(resolve));
  f.graph.disconnect(); f.worklet().port.onmessage({ data: 'ready' });
  assert.equal(await loading, false); assert.equal(f.worklet().disposed, true);
  assert.equal(f.source.connections.length, 0);
});
test('initialization deadline keeps playback and prevents a late module from reconnecting', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const f = fixture(); let complete;
  f.context.audioWorklet.addModule = () => new Promise(resolve => { complete = resolve; });
  const loading = f.graph.loadDenoiser('slow');
  t.mock.timers.tick(5000);
  assert.equal(await loading, false);
  complete(); await new Promise(resolve => setImmediate(resolve));
  assert.equal(f.worklet(), undefined);
  assert.equal(f.source.connections.length, 3);
  f.graph.disconnect();
});
test('natural/clear tone updates smoothly and processor receives validated controls',async()=>{
 const f=fixture();await f.graph.loadDenoiser('local');const messages=[];f.worklet().port.postMessage=m=>messages.push(m);
 const config=f.graph.configure({strength:'light',level:false,tone:'clear',tail:true});
 assert.deepEqual(config,{strength:'light',level:false,tone:'clear',tail:true});assert.deepEqual(messages.at(-1),{type:'configure',settings:config});
 assert.ok(f.source.connections.includes(f.recognizer));
 f.graph.configure({strength:'unsafe',tone:'unsafe',tail:'yes'});assert.deepEqual(f.graph.settings,{strength:'standard',level:true,tone:'natural',tail:false});f.graph.disconnect();
});
