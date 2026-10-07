const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const tick = () => new Promise(resolve => setImmediate(resolve));
function event() { const listeners = []; return { addListener(fn) { listeners.push(fn); }, fn(...args) { let pending = false; for (const fn of listeners) pending = fn(...args) === true || pending; return pending; } }; }
function background() {
  let open = false, current = { tabId: null, enabled: false };
  const notices = [], calls = [], messages = [], saved = {};
  const ready = { ready: true, generation: 1 };
  const chrome = {
    runtime: {
      id: 'test', getURL: p => 'chrome-extension://test/' + p, onMessage: event(),
      getContexts: async () => open ? [{}] : [],
      sendMessage: async message => {
        calls.push(message.type); messages.push(message);
        if (message.type === 'start') current = { tabId: message.tabId, enabled: true };
        if (message.type === 'stop' && current.tabId === message.tabId) current = { tabId: null, enabled: false };
        if (message.type === 'toggle') current.enabled = !current.enabled;
        return { ok: true, state: { ...current } };
      }
    },
    storage: { local: { set: async value => { calls.push('save-settings'); Object.assign(saved,value); }, get: async () => ({ whisperKey: 'private-key', whisperPrompts: { '11': 'QR 分解' }, ...saved }) } },
    offscreen: { createDocument: async () => { open = true; }, closeDocument: async () => { open = false; } },
    tabCapture: { getMediaStreamId: async () => 'stream' },
    action: { onClicked: event(), setBadgeText: async () => {}, setBadgeBackgroundColor: async () => {} },
    tabs: {
      onRemoved: event(), onUpdated: event(),
      sendMessage: async (tabId, message) => {
        if (message.type === 'ready') return { ...ready };
        notices.push({ tabId, ...message });
      }
    }
  };
  vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../course-terms.js'),'utf8')+'\n'+fs.readFileSync(path.join(__dirname, '../background.js'), 'utf8'), { chrome });
  async function click(tabId = 1) { chrome.action.onClicked.fn({ id: tabId }); await tick(); await tick(); }
  const message = (type, tabId = 1, sender = { id: 'test', tab: { id: tabId } }, fields = {}) => new Promise(resolve => {
    if (!chrome.runtime.onMessage.fn({ target: 'voice-background', type, tabId, ...fields }, sender, resolve)) resolve(null);
  });
  return { chrome, click, message, ready, notices, calls, messages, state: () => current, open: () => open };
}
test('toolbar capture toggles enhancement and stops without leaving an offscreen document', async () => {
  const app = background();
  await app.click();
  assert.equal(app.state().tabId, 1);
  assert.equal((await app.message('toggle')).state.enabled, false);
  assert.equal((await app.message('toggle')).state.enabled, true);
  await app.click();
  assert.equal(app.state().tabId, null);
  assert.equal(app.open(), false);
});
test('content cannot start capture; other tabs cannot toggle or stop the owner', async () => {
  const app = background();
  assert.equal((await app.message('toggle')).ok, false);
  await app.click();
  assert.equal((await app.message('toggle', 2)).ok, false);
  await app.message('stop', 2);
  assert.equal(app.state().tabId, 1);
  assert.equal(app.notices.at(-1).state.tabId, null);
  await app.click(2);
  assert.equal(app.state().tabId, 1);
  assert.match(app.notices.at(-1).error, /另一个标签页/);
});
test('capture errors clean the offscreen document and report an actionable error', async () => {
  const app = background();
  app.chrome.tabCapture.getMediaStreamId = async () => { throw new Error('denied'); };
  await app.click();
  assert.equal(app.open(), false);
  assert.equal(app.state().tabId, null);
  assert.equal(app.notices.at(-1).error, 'denied');
});
test('late capture is discarded if the lecture generation changed', async () => {
  const app = background();
  app.chrome.tabCapture.getMediaStreamId = async () => { app.ready.generation++; return 'stream'; };
  await app.click();
  assert.equal(app.state().tabId, null);
  assert.equal(app.open(), false);
});
test('navigation and tab removal release the owning capture', async () => {
  const app = background();
  await app.click();
  app.chrome.tabs.onUpdated.fn(1, { status: 'loading' }); await tick();
  assert.equal(app.open(), false);
  await app.click();
  app.chrome.tabs.onRemoved.fn(1); await tick();
  assert.equal(app.open(), false);
});
test('untrusted runtime messages are ignored', async () => {
  const app = background();
  assert.equal(await app.message('stop', 1, { id: 'foreign', tab: { id: 1 } }), null);
  assert.equal(await app.message('stop', 1, { id: 'test', url: 'chrome-extension://test/offscreen.html' }), null);
});
function offscreen({ failResume = false } = {}) {
  let handler, stopped = 0, closed = 0, enabled, ended, configured;
  const track = { stop() { stopped++; }, addEventListener(_type, fn) { ended = fn; } };
  const stream = { getTracks: () => [track], getAudioTracks: () => [track] };
  class AudioContext {
    state = failResume ? 'suspended' : 'running';
    createMediaStreamSource() { return {}; }
    async resume() {}
    async close() { closed++; }
  }
  const chrome = { runtime: { id: 'test', onMessage: { addListener(fn) { handler = fn; } }, sendMessage: async () => {} } };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../offscreen.js'), 'utf8'), {
    chrome, AudioContext, navigator: { mediaDevices: { getUserMedia: async () => stream } },
    ICourseVoice: { createVoiceGraph: () => ({ configure(value) { configured = value; }, setEnabled(v) { enabled = v; }, disconnect() {} }) }
  });
  const message = (type, fields = {}) => new Promise(resolve => handler({ target: 'voice-offscreen', type, ...fields }, { id: 'test' }, resolve));
  return { message, end: () => ended(), stopped: () => stopped, closed: () => closed, enabled: () => enabled, configured: () => configured };
}
test('offscreen preserves dry playback when bypassed and releases capture on stop', async () => {
  const app = offscreen();
  assert.equal((await app.message('start', { tabId: 1, streamId: 's' })).ok, true);
  assert.equal((await app.message('toggle', { tabId: 1 })).state.enabled, false);
  assert.equal(app.enabled(), false);
  await app.message('stop', { tabId: 2 }); assert.equal(app.stopped(), 0);
  await app.message('stop', { tabId: 1 });
  assert.equal(app.stopped(), 1); assert.equal(app.closed(), 1);
});
test('suspended output fails safely without retaining capture tracks', async () => {
  const app = offscreen({ failResume: true });
  assert.equal((await app.message('start', { tabId: 1 })).ok, false);
  assert.equal(app.stopped(), 1); assert.equal(app.closed(), 1);
  assert.equal((await app.message('state')).state.tabId, null);
});
test('track ending releases the graph', async () => {
  const app = offscreen();
  await app.message('start', { tabId: 1 });
  app.end(); await tick();
  assert.equal((await app.message('state')).state.tabId, null);
  assert.equal(app.closed(), 1);
});

test('a failed output resume stops capture so original tab audio can recover', async () => {
  const app = background();
  await app.click();
  const send = app.chrome.runtime.sendMessage;
  app.chrome.runtime.sendMessage = async m => m.type === 'toggle' ? { ok: false, error: 'resume failed' } : send(m);
  assert.equal((await app.message('toggle')).ok, false);
  assert.equal(app.state().tabId, null);
  assert.equal(app.open(), false);
});

test('audio state remains available without any recognizer', async () => {
  const app = background();
  const reply = await app.message('state');
  assert.equal(reply.asrProtocol, undefined);
  assert.equal(reply.state.active, false);
  assert.equal(app.open(), false);
});

test('only the owning extension offscreen page can report enhancement fallback', async () => {
 const app=background();await app.click();
 assert.equal(await app.message('enhancement-changed'),null);
 const before=app.notices.length;
 const sender={id:'test',url:'chrome-extension://test/offscreen.html'};
 await app.message('enhancement-changed',1,sender);
 // The handler obtains ownership from the offscreen state, never trusts message state.
 assert.equal(app.notices.length,before+1);
 assert.equal(app.notices.at(-1).state.tabId,1);
 await app.message('enhancement-changed',2,sender);
 assert.equal(app.notices.length,before+1);
 await app.click();
});
test('voice preferences persist before capture, start restores them and another tab cannot overwrite',async()=>{
 const a=background(),settings={strength:'light',level:false,tone:'clear',tail:true};
 const result=await a.message('configure',1,undefined,{settings});assert.equal(result.ok,true);assert.deepEqual(JSON.parse(JSON.stringify(result.state.settings)),settings);
 assert.deepEqual(JSON.parse(JSON.stringify((await a.message('state')).state.settings)),settings);
 await a.click();assert.deepEqual(JSON.parse(JSON.stringify(a.messages.find(m=>m.type==='start').settings)),settings);
 const saves=a.calls.filter(x=>x==='save-settings').length;
 assert.equal((await a.message('configure',2,undefined,{settings:{}})).ok,false);
 assert.equal(a.calls.filter(x=>x==='save-settings').length,saves);await a.click();
});
test('live preference changes stay scoped to the capturing tab',async()=>{
 const a=background();await a.click();const settings={strength:'standard',level:true,tone:'natural',tail:false};
 assert.equal((await a.message('configure',1,undefined,{settings})).state.active,true);
 const operation=a.messages.find(m=>m.type==='configure');assert.equal(operation.tabId,1);assert.deepEqual(JSON.parse(JSON.stringify(operation.settings)),settings);await a.click();
});
test('offscreen restores and changes controls without changing enhancement bypass state',async()=>{
 const a=offscreen(),initial={strength:'light',level:false,tone:'clear',tail:false};
 await a.message('start',{tabId:1,settings:initial});assert.deepEqual(a.configured(),initial);
 await a.message('toggle',{tabId:1});assert.equal(a.enabled(),false);
 const next={strength:'standard',level:true,tone:'natural',tail:true};
 assert.equal((await a.message('configure',{tabId:2,settings:next})).ok,false);assert.deepEqual(a.configured(),initial);
 assert.equal((await a.message('configure',{tabId:1,settings:next})).ok,true);assert.deepEqual(a.configured(),next);assert.equal(a.enabled(),false);await a.message('stop',{tabId:1});
});

test('audio capture ignores obsolete ASR configuration and never forwards a key',async()=>{
 const a=background();Object.assign(a.ready,{asr:true,engine:'whisper',courseId:'11'});await a.click();
 const start=a.messages.find(m=>m.type==='start');assert.equal(start.asr,undefined);assert.equal(start.config,undefined);
 assert.equal(JSON.stringify(a.notices).includes('private-key'),false);await a.click();
});
