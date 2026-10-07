'use strict';
if(typeof importScripts==='function')importScripts('course-terms.js');
let queue = Promise.resolve();
function serialized(task) {
  const job = queue.then(task);
  queue = job.catch(() => {});
  return job;
}
async function hasOffscreen() {
  return (await chrome.runtime.getContexts({ contextTypes: ['OFFSCREEN_DOCUMENT'], documentUrls: [chrome.runtime.getURL('offscreen.html')] })).length > 0;
}
async function audio(type, fields = {}) {
  if (!await hasOffscreen()) return { tabId: null, enabled: false };
  const reply = await chrome.runtime.sendMessage({ target: 'voice-offscreen', type, ...fields });
  if (!reply?.ok) throw new Error(reply?.error || '音频页面没有响应');
  return reply.state;
}
async function notify(tabId, state, error) {
  await chrome.action.setBadgeText({ tabId, text: state.tabId === tabId ? (state.enabled ? 'ON' : '原声') : '' }).catch(() => {});
  await chrome.action.setBadgeBackgroundColor({ tabId, color: '#007aff' }).catch(() => {});
  await chrome.tabs.sendMessage(tabId, { target: 'voice-content', state: state.tabId === tabId ? state : { tabId: null, enabled: false }, error }).catch(() => {});
}
async function stopTab(tabId) {
  const state = await audio('stop', { tabId });
  await notify(tabId, state);
  if (state.tabId === null && await hasOffscreen()) await chrome.offscreen.closeDocument();
  return state;
}
chrome.action.onClicked.addListener((tab) => {
  void serialized(async () => {
    if (!Number.isInteger(tab.id)) return;
    const state = await audio('state');
    if (state.tabId === tab.id) { await stopTab(tab.id); return; }
    try {
      const ready = await chrome.tabs.sendMessage(tab.id, { target: 'voice-content', type: 'ready' });
      if (!ready?.ready) throw new Error('请先在Lyue中打开并播放一节课程');
      if (state.tabId !== null) throw new Error('另一个标签页正在使用增强，请先在那里停止音频');
      if (!await hasOffscreen()) await chrome.offscreen.createDocument({
        url: 'offscreen.html', reasons: ['USER_MEDIA'], justification: '本地处理用户启动的课程标签页音频并回放，不录制或上传'
      });
      const streamId = await chrome.tabCapture.getMediaStreamId({ targetTabId: tab.id });
      const { voiceSettings } = await chrome.storage.local.get('voiceSettings');
      const result = await audio('start', { tabId: tab.id, streamId, settings: voiceSettings });
      // The panel may have closed or changed lectures while capture was starting.
      const stillReady = await chrome.tabs.sendMessage(tab.id, { target: 'voice-content', type: 'ready' });
      if (!stillReady?.ready || stillReady.generation !== ready.generation) { await stopTab(tab.id); return; }
      await notify(tab.id, result);
    } catch (error) {
      const active = await audio('state').catch(() => ({ tabId: null, enabled: false }));
      if (active.tabId === tab.id) await stopTab(tab.id);
      else if (active.tabId === null && await hasOffscreen()) await chrome.offscreen.closeDocument();
      await notify(tab.id, { tabId: null, enabled: false }, error.message);
    }
  }).catch(() => {});
});
chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (message?.target !== 'voice-background' || sender.id !== chrome.runtime.id) return;
  const fromOffscreen = sender.url === chrome.runtime.getURL('offscreen.html') && !sender.tab;
  if (!sender.tab && !(fromOffscreen && ['ended', 'enhancement-changed'].includes(message.type))) return;
  if (message.type === 'enhancement-changed' && !fromOffscreen) return;
  const tabId = sender.tab?.id ?? message.tabId;
  if (!['state', 'toggle', 'stop', 'ended', 'enhancement-changed', 'configure'].includes(message.type)) return;
  const job = serialized(async () => {
    if (message.type === 'stop' || message.type === 'ended') return stopTab(tabId);
    let state = await audio('state');
    if (message.type === 'state' && state.tabId === null) {
      const { voiceSettings } = await chrome.storage.local.get('voiceSettings');
      if (voiceSettings) state = { ...state, settings: voiceSettings };
    }
    if (message.type === 'enhancement-changed' && state.tabId === tabId) await notify(tabId, state);
    if (message.type === 'configure') {
      const settings = { strength: message.settings?.strength === 'light' ? 'light' : 'standard', level: message.settings?.level !== false, tone: message.settings?.tone === 'clear' ? 'clear' : 'natural', tail: message.settings?.tail === true };
      if (state.tabId !== null && state.tabId !== tabId) throw Error('另一个标签页正在使用增强，请在那里调整设置');
      if (state.tabId === tabId) state = await audio('configure', { tabId, settings });
      await chrome.storage.local.set({ voiceSettings: settings });
      if (state.tabId === tabId) await notify(tabId, state);
      return { ...state, settings, active: state.tabId === tabId };
    }
    if (message.type === 'toggle') {
      if (state.tabId !== tabId) throw new Error('首次启用：请点击浏览器工具栏的Lyue图标');
      try { state = await audio('toggle', { tabId }); }
      catch (error) { await stopTab(tabId); throw error; }
      await notify(tabId, state);
    }
    return { ...state, active: state.tabId === tabId };
  });
  job.then((state) => respond({ ok: true, state }), (error) => respond({ ok: false, error: error.message }));
  return true;
});
chrome.tabs.onRemoved.addListener((tabId) => { void serialized(() => stopTab(tabId)).catch(() => {}); });
chrome.tabs.onUpdated.addListener((tabId, change) => {
  if (change.status === 'loading') void serialized(() => stopTab(tabId)).catch(() => {});
});

// Retain legacy storage names so existing Qwen keys and terms remain usable.
// Apply saved course terms to already-open players; no secret is sent to pages.
chrome.storage?.onChanged?.addListener((changes, area) => {
  if (area !== 'local' || (!changes.whisperPrompts && !changes.whisperKey)) return;
  const old = changes.whisperPrompts?.oldValue || {}, next = changes.whisperPrompts?.newValue || {};
  const courseIds = [...new Set([...Object.keys(old), ...Object.keys(next)])].filter(id => old[id] !== next[id]);
  void chrome.tabs.query({}).then(tabs => Promise.all(tabs.map(tab => chrome.tabs.sendMessage(tab.id, {
    target: 'voice-content', type: 'keywords-updated', courseIds, all: Boolean(changes.whisperKey)
  }).catch(() => {})))).catch(() => {});
});

// Qwen has its own loopback endpoint; credentials never go to course pages.
const qwenRequests = new Map();
chrome.runtime.onMessage.addListener((message,sender,respond)=>{
  if(message?.target!=='qwen-background'||sender.id!==chrome.runtime.id)return;
  const options=sender.url===chrome.runtime.getURL('options.html')&&!sender.tab;
  if(!sender.tab&&!options)return;
  if(!['chunk','cached-chunk','export-captions','relay-chunk','health','settings','cancel','media'].includes(message.type)||(options&&!['health','settings'].includes(message.type)))return;
  const owner=String(sender.tab?.id ?? 'options'),id=owner+':'+message.requestId;
  if(message.type==='cancel'){qwenRequests.get(id)?.abort();respond({ok:true});return;}
  if(message.type==='settings'){void (async()=>{if(/^\d{1,10}$/.test(message.courseId||''))await chrome.storage.local.set({whisperCourseId:message.courseId});await chrome.runtime.openOptionsPage();})().then(()=>respond({ok:true,result:{}}),error=>respond({ok:false,error:error.message}));return true;}
  const controller=new AbortController();qwenRequests.set(id,controller);
  const timeout=setTimeout(()=>controller.abort(),150000);
  (async()=>{
    const {whisperKey,whisperPrompts}=await chrome.storage.local.get(['whisperKey','whisperPrompts']);
    if(!whisperKey)throw Error('请在关键词与连接中保存本地服务密钥');
    const prompt=ICourseTerms.resolve(message.courseId,whisperPrompts);
    const response=await fetch('http://127.0.0.1:8768/'+(message.type==='media'?'media':message.type==='relay-chunk'?'relay-chunk':message.type==='export-captions'?'export-captions':message.type==='cached-chunk'?'cached-chunk':message.type==='chunk'?'chunk':'health'),{
      method:message.type==='health'?'GET':'POST',signal:controller.signal,
      headers:{Authorization:'Bearer '+whisperKey,'Content-Type':'application/json'},
      ...(message.type==='media'?{body:JSON.stringify({...message.media,owner})}:['chunk','cached-chunk','export-captions','relay-chunk'].includes(message.type)?{body:JSON.stringify({source:message.chunk?.source,start:message.chunk?.start,duration:message.chunk?.duration,prompt,...(message.type==='relay-chunk'?{relayId:message.relayId,owner}:['cached-chunk','export-captions'].includes(message.type)?{owner}:{})})}:{})
    }).catch(error=>{if(controller.signal.aborted)throw error;throw Error('无法连接 Qwen 本地服务（127.0.0.1:8768）；具体原因未确认');});
    const result=await response.json();if(!response.ok)throw Error(result.error||'Qwen 服务返回 HTTP '+response.status);return result;
  })().then(result=>respond({ok:true,result}),error=>respond({ok:false,error:controller.signal.aborted?'Qwen 请求已取消或超时':error.message}))
    .finally(()=>{clearTimeout(timeout);if(qwenRequests.get(id)===controller)qwenRequests.delete(id);});
  return true;
});
chrome.tabs.onRemoved.addListener(tabId=>{for(const [id,c] of qwenRequests)if(id.startsWith(tabId+':'))c.abort();});
chrome.tabs.onUpdated.addListener((tabId,change)=>{if(change.status==='loading')for(const [id,c] of qwenRequests)if(id.startsWith(tabId+':'))c.abort();});

async function releaseQwenMedia(tabId){
 try{const {whisperKey}=await chrome.storage.local.get('whisperKey');if(whisperKey)await fetch('http://127.0.0.1:8768/media',{method:'POST',headers:{Authorization:'Bearer '+whisperKey,'Content-Type':'application/json'},body:JSON.stringify({action:'release',owner:String(tabId)}),signal:AbortSignal.timeout(5000)});}catch{}
}
chrome.tabs.onRemoved.addListener(releaseQwenMedia);
chrome.tabs.onUpdated.addListener((id,change)=>{if(change.status==='loading')void releaseQwenMedia(id);});
