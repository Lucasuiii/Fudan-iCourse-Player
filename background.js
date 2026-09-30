'use strict';
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
      if (!ready?.ready) throw new Error('请先在随行播放器中打开并播放一节课程');
      if (state.tabId !== null) throw new Error('另一个标签页正在使用增强，请先在那里停止音频');
      if (!await hasOffscreen()) await chrome.offscreen.createDocument({
        url: 'offscreen.html', reasons: ['USER_MEDIA'], justification: '本地处理用户启动的课程标签页音频并回放，不录制或上传'
      });
      const streamId = await chrome.tabCapture.getMediaStreamId({ targetTabId: tab.id });
      const result = await audio('start', { tabId: tab.id, streamId, asr: ready.asr, clock: ready.clock, engine: ready.engine, courseId: ready.courseId });
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
  if (!sender.tab && !(fromOffscreen && ['ended', 'asr-event'].includes(message.type))) return;
  if (message.type === 'asr-event' && fromOffscreen) {
    void chrome.tabs.sendMessage(message.tabId, { target: 'voice-content', event: message.event }).catch(() => {});
    return;
  }
  const tabId = sender.tab?.id ?? message.tabId;
  if (!['state', 'toggle', 'stop', 'ended', 'asr', 'clock'].includes(message.type)) return;
  const job = serialized(async () => {
    if (message.type === 'stop' || message.type === 'ended') return stopTab(tabId);
    if (message.type === 'clock' || message.type === 'asr') return audio(message.type, { tabId, clock: message.clock, enabled: Boolean(message.enabled), engine: message.engine, courseId: message.courseId });
    let state = await audio('state');
    if (message.type === 'toggle') {
      if (state.tabId !== tabId) throw new Error('首次启用：请点击浏览器工具栏的随行播放器图标');
      try { state = await audio('toggle', { tabId }); }
      catch (error) { await stopTab(tabId); throw error; }
      await notify(tabId, state);
    }
    return { ...state, active: state.tabId === tabId };
  });
  job.then((state) => respond({ ok: true, asrProtocol: 1, state }), (error) => respond({ ok: false, error: error.message }));
  return true;
});
chrome.tabs.onRemoved.addListener((tabId) => { void serialized(() => stopTab(tabId)).catch(() => {}); });
chrome.tabs.onUpdated.addListener((tabId, change) => {
  if (change.status === 'loading') void serialized(() => stopTab(tabId)).catch(() => {});
});

// Separate queue: model inference must never block voice cleanup or tab capture.
chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (message?.target !== 'whisper-background' || sender.id !== chrome.runtime.id) return;
  const streaming = sender.url === chrome.runtime.getURL('offscreen.html') && !sender.tab;
  const options = sender.url === chrome.runtime.getURL('options.html') && !sender.tab;
  if (!sender.tab && !options && !streaming) return;
  if (!['chunk', 'stream', 'health', 'settings'].includes(message.type) || (options && !['health','settings'].includes(message.type)) || (streaming && !['health','stream'].includes(message.type)) || (message.type === 'stream' && !streaming)) return;
  const job = (async () => {
    if (streaming && message.type === 'stream' && (await audio('state')).tabId === null) throw Error('音频捕获已停止');
    if (message.type === 'settings') { if (/^\d{1,10}$/.test(message.courseId || '')) await chrome.storage.local.set({ whisperCourseId: message.courseId }); await chrome.runtime.openOptionsPage(); return {}; }
    const { whisperKey, whisperPrompts } = await chrome.storage.local.get(['whisperKey', 'whisperPrompts']);
    const whisperPrompt = /^\d{1,10}$/.test(message.courseId || '') ? whisperPrompts?.[message.courseId] : '';
    if (!whisperKey) throw Error('请先点“Whisper 设置”，填写本地服务连接密钥');
    const response = await fetch('http://127.0.0.1:8766/' + (message.type === 'chunk' ? 'chunk' : message.type === 'stream' ? 'stream' : 'health'), {
      method: message.type === 'health' ? 'GET' : 'POST',
      headers: { Authorization: 'Bearer ' + whisperKey, 'Content-Type': 'application/json' },
      ...(message.type === 'stream' ? {body: JSON.stringify({samples:message.samples, ...(whisperPrompt ? {prompt:whisperPrompt} : {})})} : message.type === 'chunk' ? { body: JSON.stringify({ source: message.chunk?.source, start: message.chunk?.start, duration: message.chunk?.duration, ...(whisperPrompt ? { prompt: whisperPrompt } : {}) }) } : {}),
      signal: AbortSignal.timeout(180000)
    }).catch(() => { throw Error('无法连接本地 Whisper 服务，请确认服务正在运行'); });
    const result = await response.json();
    if (!response.ok) throw Error(result.error || '本地识别失败');
    return result;
  })();
  job.then(result => respond({ ok: true, result }), error => respond({ ok: false, error: error.message }));
  return true;
});

// Apply saved course terms to already-open players; no secret is sent to pages.
chrome.storage?.onChanged?.addListener((changes, area) => {
  if (area !== 'local' || (!changes.whisperPrompts && !changes.whisperKey)) return;
  const old = changes.whisperPrompts?.oldValue || {}, next = changes.whisperPrompts?.newValue || {};
  const courseIds = [...new Set([...Object.keys(old), ...Object.keys(next)])].filter(id => old[id] !== next[id]);
  void chrome.tabs.query({}).then(tabs => Promise.all(tabs.map(tab => chrome.tabs.sendMessage(tab.id, {
    target: 'voice-content', type: 'keywords-updated', courseIds, all: Boolean(changes.whisperKey)
  }).catch(() => {})))).catch(() => {});
});
