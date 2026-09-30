/* global ICourseVoice, ICourseWhisperStream */
'use strict';
let session = null;
let queue = Promise.resolve();
function snapshot() {
  return session ? { tabId: session.tabId, enabled: session.enabled } : { tabId: null, enabled: false };
}
async function stop() {
  const old = session;
  session = null;
  if (!old) return;
  old.asr?.close();
  old.stream.getTracks().forEach((track) => track.stop());
  old.graph.disconnect();
  await old.context.close();
}
async function configureASR(enabled, clock, engine, courseId, config) {
  session.asr?.close(); session.asr = null;
  if (!enabled) return;
  const owner = session;
  const asr = new ICourseWhisperStream.WhisperStream(owner.context, owner.source, (event) => {
    if (session !== owner || owner.asr !== asr) return;
    void chrome.runtime.sendMessage({ target: 'voice-background', type: 'asr-event', tabId: owner.tabId, event }).catch(() => {});
  }, courseId, config);
  owner.asr = asr;
  owner.clock = clock || owner.clock;
  if (owner.clock) asr.setClock(owner.clock);
  void asr.start().then(() => { if (session === owner && owner.asr === asr && owner.clock) asr.setClock(owner.clock); }).catch(error => { if (session === owner && owner.asr === asr) asr.fail(error.message); });
}
async function handle(message) {
  if (message.type === 'clock') { if (session?.tabId === message.tabId) { session.clock = message.clock; session.asr?.setClock(message.clock); } return snapshot(); }
  if (message.type === 'asr') { if (session?.tabId === message.tabId) await configureASR(message.enabled, message.clock, message.engine, message.courseId, message.config); return snapshot(); }
  if (message.type === 'state') return snapshot();
  if (message.type === 'stop') {
    if (session?.tabId === message.tabId) await stop();
    return snapshot();
  }
  if (message.type === 'toggle') {
    if (session?.tabId !== message.tabId) throw new Error('请先点击工具栏的随行播放器图标启用音频');
    await session.context.resume();
    if (session.context.state !== 'running') throw new Error('音频处理无法启动，请停止后重新启用');
    session.enabled = !session.enabled;
    session.graph.setEnabled(session.enabled);
    return snapshot();
  }
  if (message.type !== 'start') throw new Error('未知音频操作');
  if (session) throw new Error('已有标签页在使用音频增强，请先关闭它');
  let stream, context, graph;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: { mandatory: {
      chromeMediaSource: 'tab', chromeMediaSourceId: message.streamId
    } }, video: false });
    if (!stream.getAudioTracks().length) throw new Error('标签页没有可用音轨');
    context = new AudioContext({ latencyHint: 'interactive' });
    const source = context.createMediaStreamSource(stream);
    graph = ICourseVoice.createVoiceGraph(context, source);
    await context.resume();
    if (context.state !== 'running') throw new Error('浏览器未能启动音频输出');
    session = { stream, context, graph, source, clock: message.clock, asr: null, tabId: message.tabId, enabled: true };
    graph.setEnabled(true);
    if (message.asr) await configureASR(true, message.clock, message.engine, message.courseId, message.config);
    stream.getAudioTracks().forEach((track) => track.addEventListener('ended', () => {
      if (session?.stream !== stream) return;
      queue = queue.then(async () => {
        if (session?.stream !== stream) return;
        const tabId = session.tabId;
        await stop();
        // Background cleanup sends another message here; do not await it inside this queue.
        void chrome.runtime.sendMessage({ target: 'voice-background', type: 'ended', tabId }).catch(() => {});
      }).catch(() => {});
    }));
    return snapshot();
  } catch (error) {
    stream?.getTracks().forEach((track) => track.stop());
    graph?.disconnect();
    if (context) await context.close().catch(() => {});
    throw error;
  }
}
chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (message?.target !== 'voice-offscreen' || sender.id !== chrome.runtime.id || sender.tab) return;
  const job = queue.then(() => handle(message));
  queue = job.catch(() => {});
  job.then((state) => respond({ ok: true, state }), (error) => respond({ ok: false, error: error.message }));
  return true;
});
