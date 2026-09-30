/* global ICourseCore, Hls */
(function () {
  'use strict';
  const core = ICourseCore;
  const ctx = core.context(location);
  if (!ctx || document.getElementById('icp-launcher')) return;

  const state = { courseId: '', course: null, current: null, subtitleUrl: null, cues: [], captionOn: true, activeCue: -1, restoreAt: 0, lastSaved: 0, hls: null, live: false, audio: null, audioBusy: false, captionSource: 'platform', platformCues: [], localCues: [], asrEpoch: 0, loadToken: 0, courseToken: 0, currentCourseId: '', playController: null, courseController: null, previousFocus: null, bodyOverflow: '', captionsLoading: false, courseLoading: false, backgroundNodes: [], probeController: null, probeToken: 0, probing: false };
  const launcher = document.createElement('button');
  launcher.id = 'icp-launcher';
  launcher.type = 'button';
  launcher.innerHTML = '<span class="icp-launch-icon">▶</span><span>随行播放器</span>';
  launcher.setAttribute('aria-label', '打开 iCourse 随行播放器');
  document.body.append(launcher);

  const panel = document.createElement('div');
  panel.id = 'icp-panel';
  panel.hidden = true;
  panel.innerHTML = `
    <div class="icp-shell" role="dialog" aria-modal="true" aria-label="iCourse 随行播放器" tabindex="-1">
      <header class="icp-header"><div class="icp-brand"><span class="icp-mark">▶</span><div><small>ICOURSE · COMPANION</small><h2>随行播放器</h2></div></div><button class="icp-close" type="button" title="关闭" aria-label="关闭播放器">×</button></header>
      <div class="icp-topbar"><label>课程 ID <input class="icp-course-id" inputmode="numeric" placeholder="从课程网址获取" aria-label="课程 ID"></label><button class="icp-load" type="button">打开课程 <span aria-hidden="true">→</span></button><details class="icp-livebox"><summary>连接直播流</summary><div class="icp-livebar"><label>HLS 直播地址 <input class="icp-live-url" type="url" placeholder="粘贴有权限的 .m3u8 地址" aria-label="HLS 直播地址"></label><button class="icp-live-open" type="button">播放直播</button></div></details></div>
      <div class="icp-statusbar"><p class="icp-status" role="status">在 iCourse 登录后输入课程 ID，或从课程页面自动识别。</p><span class="icp-subtitle-status" role="status">字幕未加载</span></div>
      <div class="icp-layout">
        <aside class="icp-sidebar"><div class="icp-course"><small>当前课程</small><strong class="icp-course-title">尚未选择课程</strong><span class="icp-teacher"></span><span class="icp-resource-status" role="status"></span><button class="icp-probe-retry" type="button" hidden>重新检查资源</button></div><div class="icp-tabs" role="tablist" aria-label="侧栏"><button class="icp-tab icp-tab-active" type="button" id="icp-tab-lectures" data-tab="lectures" role="tab" aria-controls="icp-pane-lectures" aria-selected="true">课次</button><button class="icp-tab" type="button" id="icp-tab-transcript" data-tab="transcript" role="tab" aria-controls="icp-pane-transcript" tabindex="-1" aria-selected="false">逐句字幕</button></div><div class="icp-lectures-pane" id="icp-pane-lectures" role="tabpanel" aria-labelledby="icp-tab-lectures"><input class="icp-filter" type="search" placeholder="搜索课次" aria-label="搜索课次"><div class="icp-list" aria-label="课次列表"></div></div><div class="icp-transcript-pane" id="icp-pane-transcript" role="tabpanel" aria-labelledby="icp-tab-transcript" hidden><div class="icp-transcript-controls"><input class="icp-transcript-filter" type="search" placeholder="搜索字幕关键词" aria-label="搜索字幕"><label class="icp-follow-label"><input class="icp-follow" type="checkbox" checked> 跟随播放</label></div><p class="icp-transcript-empty">选择课次后读取官方字幕</p><div class="icp-transcript-list"></div></div></aside>
        <main class="icp-main"><div class="icp-stage"><video class="icp-video" controls playsinline preload="metadata"></video><div class="icp-local-caption" hidden></div><div class="icp-placeholder"><span>▶</span><strong>选择一节课次，开始观看</strong><small>你的课程 · 更舒服的播放体验</small></div><div class="icp-tap-target" role="button" tabindex="0" aria-label="点击暂停或继续播放"></div></div>
          <div class="icp-now"><div><small>当前课次</small><strong class="icp-now-title">等待选择课次</strong></div><span class="icp-date"></span></div>
          <div class="icp-tools"><div class="icp-toolgroup"><button class="icp-back" type="button" title="后退 10 秒">↶ <span>10 秒</span></button><button class="icp-forward" type="button" title="前进 10 秒"><span>10 秒</span> ↷</button><button class="icp-go-live" type="button" hidden>● 回到直播</button></div><div class="icp-toolgroup"><label>速度 <select class="icp-speed"><option value="0.75">0.75×</option><option value="1" selected>1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option><option value="1.75">1.75×</option><option value="2">2×</option><option value="2.5">2.5×</option><option value="3">3×</option></select></label><label>来源 <select class="icp-caption-source" aria-label="字幕来源"><option value="platform">平台字幕</option><option value="local">本地识别（实验）</option></select></label><button class="icp-captions" type="button" aria-pressed="false" disabled>字幕：暂无</button><button class="icp-denoise" type="button" aria-pressed="false">人声增强：关</button><button class="icp-pip" type="button">画中画</button><button class="icp-full" type="button">全屏</button></div></div>
          <div class="icp-hint">空格播放/暂停 · ←/→ 快退/快进 · F 全屏 · P 画中画 · C 字幕 · 人声增强默认关闭</div>
        </main>
      </div>
    </div>`;
  document.body.append(panel);

  const $ = (selector) => panel.querySelector(selector);
  let video = $('.icp-video');
  const input = $('.icp-course-id');
  const list = $('.icp-list');
  const filter = $('.icp-filter');
  panel.querySelectorAll('.icp-tab').forEach((button) => button.addEventListener('click', () => showTab(button.dataset.tab)));
  input.value = core.courseIdFromUrl(location.href);
  launcher.addEventListener('click', () => {
    state.previousFocus = document.activeElement;
    state.bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    state.backgroundNodes = Array.from(document.body.children).filter((node) => node !== panel && node !== launcher).map((node) => ({ node, inert: node.inert }));
    state.backgroundNodes.forEach(({ node }) => { node.inert = true; });
    panel.hidden = false;
    launcher.hidden = true;
    (state.course ? $('.icp-close') : input).focus();
    if (input.value && !state.course) void loadCourse();
    else if (state.course?.lectures.some((lecture) => lecture.resource === 'unknown')) void scanResources(true);
  });
  $('.icp-close').addEventListener('click', close);
  panel.addEventListener('click', (event) => { if (event.target === panel) close(); });
  $('.icp-load').addEventListener('click', loadCourse);
  $('.icp-probe-retry').addEventListener('click', () => { if (state.course && !state.courseLoading) void scanResources(true); });
  $('.icp-live-open').addEventListener('click', playLive);
  input.addEventListener('keydown', (event) => { if (event.key === 'Enter') loadCourse(); });
  filter.addEventListener('input', renderList);
  $('.icp-transcript-filter').addEventListener('input', renderTranscript);
  $('.icp-follow').addEventListener('change', () => { state.activeCue = -1; updateActiveCue(); });
  $('.icp-tabs').addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
    const name = event.key === 'Home' ? 'lectures' : event.key === 'End' ? 'transcript' : $('.icp-transcript-pane').hidden ? 'transcript' : 'lectures';
    showTab(name);
    $('.icp-tab[data-tab="' + name + '"]').focus();
  });
  const rememberedSpeed = storageGet('icp:settings:speed');
  if (Array.from($('.icp-speed').options).some((option) => option.value === rememberedSpeed)) $('.icp-speed').value = rememberedSpeed;
  $('.icp-back').addEventListener('click', () => seek(-10));
  $('.icp-forward').addEventListener('click', () => seek(10));
  $('.icp-go-live').addEventListener('click', goLive);
  $('.icp-speed').addEventListener('change', (event) => { video.playbackRate = Number(event.target.value); storageSet('icp:settings:speed', event.target.value); });
  $('.icp-pip').addEventListener('click', togglePip);
  $('.icp-full').addEventListener('click', toggleFullscreen);
  $('.icp-captions').addEventListener('click', toggleCaptions);
  $('.icp-denoise').addEventListener('click', toggleDenoise);
  $('.icp-caption-source').addEventListener('change', changeCaptionSource);
  $('.icp-tap-target').addEventListener('click', togglePlayback);
  $('.icp-tap-target').addEventListener('keydown', (event) => { if (event.key === 'Enter') togglePlayback(); });

  function togglePlayback() {
    if (!video.src && !state.hls) return;
    const token = state.loadToken;
    if (video.paused) void video.play().catch(() => { if (state.loadToken === token && !panel.hidden) status('无法开始播放，请重新选择课次或检查权限。', true); });
    else video.pause();
  }

  function status(message, error = false) {
    const el = $('.icp-status');
    el.textContent = message;
    el.classList.toggle('icp-error', error);
  }

  function showTab(name) {
    panel.querySelectorAll('.icp-tab').forEach((button) => {
      const active = button.dataset.tab === name;
      button.classList.toggle('icp-tab-active', active);
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    $('.icp-lectures-pane').hidden = name !== 'lectures';
    $('.icp-transcript-pane').hidden = name !== 'transcript';
    if (name === 'transcript') { state.activeCue = -1; updateActiveCue(); }
  }

  function updateCaptionButton() {
    const button = $('.icp-captions');
    button.disabled = state.captionSource !== 'local' && !state.cues.length;
    if (state.captionSource === 'local') { button.textContent = '字幕：' + (state.captionOn ? '开' : '关'); button.setAttribute('aria-pressed', String(state.captionOn)); return; }
    button.textContent = state.captionsLoading ? '字幕：读取中' : state.cues.length ? '字幕：' + (state.captionOn ? '开' : '关') : '字幕：暂无';
    button.setAttribute('aria-pressed', String(state.cues.length > 0 && state.captionOn));
  }

  function toggleCaptions() {
    if (!state.cues.length && state.captionSource !== 'local') return;
    state.captionOn = !state.captionOn;
    if (video.textTracks[0]) video.textTracks[0].mode = state.captionOn && state.captionSource === 'platform' ? 'showing' : 'disabled';
    $('.icp-local-caption').hidden = state.captionSource !== 'local' || !state.captionOn || !$('.icp-local-caption').textContent;
    updateCaptionButton();
  }

  function updateActiveCue() {
    if (!state.cues.length || $('.icp-transcript-pane').hidden) return;
    const time = video.currentTime;
    const index = state.cues.findIndex((cue) => time >= cue.start && time < cue.end);
    if (index === state.activeCue) return;
    const previous = $('.icp-transcript-list .icp-cue-active');
    if (previous) previous.classList.remove('icp-cue-active');
    state.activeCue = index;
    if (index < 0) return;
    const active = $('.icp-transcript-list').querySelector('[data-cue-index="' + index + '"]');
    if (active) {
      active.classList.add('icp-cue-active');
      if ($('.icp-follow').checked) {
        const container = $('.icp-transcript-list');
        const row = active.getBoundingClientRect();
        const bounds = container.getBoundingClientRect();
        if (row.top < bounds.top || row.bottom > bounds.bottom) {
          const delta = row.top < bounds.top ? row.top - bounds.top : row.bottom - bounds.bottom;
          container.scrollBy({ top: delta, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        }
      }
    }
  }

  function renderTranscript() {
    const list = $('.icp-transcript-list');
    const empty = $('.icp-transcript-empty');
    const fragment = document.createDocumentFragment();
    list.replaceChildren();
    empty.hidden = state.cues.length > 0;
    if (!state.cues.length) empty.textContent = state.captionSource === 'local' ? '本地字幕将从启用后开始积累' : state.live ? '直播暂无官方字幕' : '这节课暂无官方字幕';
    const query = $('.icp-transcript-filter').value.trim().toLowerCase();
    for (const [index, cue] of state.cues.entries()) {
      if (query && !cue.text.toLowerCase().includes(query)) continue;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'icp-cue';
      button.dataset.cueIndex = index;
      const minute = Math.floor(cue.start / 60);
      const second = Math.floor(cue.start % 60);
      const time = document.createElement('time');
      time.textContent = String(minute).padStart(2, '0') + ':' + String(second).padStart(2, '0');
      const text = document.createElement('span');
      text.textContent = cue.text;
      button.append(time, text);
      button.addEventListener('click', () => {
        const resumeAfterSeek = video.ended;
        if (resumeAfterSeek) video.pause();
        video.currentTime = cue.start;
        if (resumeAfterSeek) {
          const token = state.loadToken;
          video.addEventListener('seeked', () => { if (state.loadToken === token && !panel.hidden) togglePlayback(); }, { once: true });
        } else if (video.paused) togglePlayback();
      });
      fragment.append(button);
    }
    list.append(fragment);
    empty.hidden = list.children.length > 0;
    if (state.cues.length && !list.children.length) empty.textContent = '没有匹配的字幕，试试其他关键词';
    state.activeCue = -1;
    updateActiveCue();
  }

  async function voiceRequest(type, fields = {}) {
    if (!globalThis.chrome?.runtime?.id) throw new Error('请重新加载扩展并刷新课程页面');
    const reply = await chrome.runtime.sendMessage({ target: 'voice-background', type, ...fields });
    if (!reply?.ok) throw new Error(reply?.error || '音频扩展没有响应');
    return reply.state;
  }

  function mediaClock() {
    return { epoch: state.asrEpoch, time: video.currentTime, paused: video.paused || video.seeking || panel.hidden, rate: video.playbackRate };
  }
  function syncASRClock(reset = false) {
    if (state.captionSource !== 'local') return;
    if (reset) { state.asrEpoch++; $('.icp-local-caption').textContent = ''; $('.icp-local-caption').hidden = true; }
    void voiceRequest('clock', { clock: mediaClock() }).catch(() => {});
    if (video.playbackRate !== 1) $('.icp-subtitle-status').textContent = '本地识别仅支持 1×，请切回原速';
  }
  async function changeCaptionSource() {
    state.captionSource = $('.icp-caption-source').value;
    state.asrEpoch++;
    const local = state.captionSource === 'local';
    state.cues = local ? state.localCues : state.platformCues;
    $('.icp-local-caption').hidden = true;
    $('.icp-local-caption').textContent = '';
    if (video.textTracks[0]) video.textTracks[0].mode = !local && state.captionOn ? 'showing' : 'disabled';
    if (local) state.captionOn = true;
    updateCaptionButton(); renderTranscript();
    $('.icp-subtitle-status').textContent = local ? '本地识别待启动 · 请播放课程并点击工具栏图标' : state.platformCues.length + ' 条平台字幕';
    try { await voiceRequest('asr', { enabled: local, clock: mediaClock() }); }
    catch (error) { if (local) $('.icp-subtitle-status').textContent = error.message; }
  }
  function receiveASR(event) {
    if (state.captionSource !== 'local' || panel.hidden) return;
    const label = $('.icp-subtitle-status');
    if (event.type === 'error') { $('.icp-local-caption').hidden = true; label.textContent = '本地识别停止：' + event.error; return; }
    if (event.type === 'loading') { label.textContent = '正在加载本地中文模型…'; return; }
    if (event.type === 'ready') { label.textContent = video.playbackRate === 1 ? '本地识别已就绪' : '本地识别仅支持 1×，请切回原速'; return; }
    if (event.type !== 'text' || event.epoch !== state.asrEpoch) return;
    const overlay = $('.icp-local-caption');
    overlay.textContent = event.text;
    overlay.hidden = !state.captionOn;
    label.textContent = event.final ? '本地识别 · 已断句' : '本地识别 · 实时草稿';
    if (event.final) {
      state.localCues.push({ start: event.start, end: Math.max(event.start + 0.1, event.end), text: event.text });
      if (state.localCues.length > 500) state.localCues.shift();
      state.cues = state.localCues;
      updateCaptionButton(); renderTranscript();
      if ($('.icp-follow').checked && !$('.icp-transcript-pane').hidden) $('.icp-transcript-list').scrollTop = $('.icp-transcript-list').scrollHeight;
    }
  }

  function updateDenoiseButton() {
    const button = $('.icp-denoise');
    const enabled = Boolean(state.audio?.enabled);
    button.textContent = '人声增强：' + (enabled ? '开' : '关');
    button.setAttribute('aria-pressed', String(enabled));
    button.disabled = state.audioBusy;
    button.title = state.audio ? '切换增强与原声；工具栏图标可停止捕获' : '首次启用请点击浏览器工具栏的随行播放器图标';
  }

  function stopVoice() {
    state.audio = null;
    updateDenoiseButton();
    void voiceRequest('stop').catch(() => {});
  }

  async function toggleDenoise() {
    if (state.audioBusy) return;
    if (panel.hidden || (!video.src && !state.hls)) return status('请先选择并播放一节课程。');
    state.audioBusy = true;
    updateDenoiseButton();
    const token = state.loadToken;
    try {
      const result = await voiceRequest('toggle');
      if (token !== state.loadToken || panel.hidden) return;
      state.audio = result.active ? result : null;
      status(result.enabled ? '人声增强已开启：温和均衡与动态压缩。' : '已切回原声；点击工具栏图标可停止音频捕获。');
    } catch (error) {
      if (token === state.loadToken && !panel.hidden) status(error.message + '（右上角 🧩 → iCourse 随行播放器；视频需正在播放）', false);
    } finally {
      state.audioBusy = false;
      updateDenoiseButton();
    }
  }

  if (globalThis.chrome?.runtime?.id) chrome.runtime.onMessage.addListener((message, _sender, respond) => {
    if (message?.target !== 'voice-content') return;
    if (message.event) { receiveASR(message.event); return; }
    if (message.type === 'ready') {
      respond({ asr: state.captionSource === 'local', clock: mediaClock(), ready: !panel.hidden && !video.paused && Boolean(video.src || state.hls), generation: state.loadToken });
      return;
    }
    if (panel.hidden) { if (message.state?.tabId !== null) stopVoice(); return; }
    state.audio = message.state?.tabId != null ? message.state : null;
    if (!state.audio && state.captionSource === 'local') { $('.icp-local-caption').hidden = true; $('.icp-subtitle-status').textContent = '本地识别已停止 · 工具栏图标可重新启动'; }
    updateDenoiseButton();
    if (message.error) status('无法启用人声增强：' + message.error, true);
    else if (state.audio) status(state.audio.enabled ? '人声增强已开启；请避免页面中的其他播放器同时发声。' : '已切回原声，音频捕获仍在运行。');
  });

  function close() {
    state.loadToken += 1;
    state.courseToken += 1;
    cancelProbe();
    state.playController?.abort();
    state.courseController?.abort();
    $('.icp-load').disabled = false;
    state.courseLoading = false;
    renderList();
    if (state.captionsLoading) {
      state.captionsLoading = false;
      updateCaptionButton();
      $('.icp-subtitle-status').textContent = '字幕读取已取消，可重新选择课次';
    }
    video.pause();
    stopVoice();
    saveProgress();
    if (state.live) {
      resetVideo();
      state.live = false;
      $('.icp-go-live').hidden = true;
      $('.icp-placeholder').hidden = false;
    }
    status(video.src ? '已暂停，可继续播放。' : '已停止。选择课次开始观看。');
    panel.hidden = true;
    launcher.hidden = false;
    document.body.style.overflow = state.bodyOverflow;
    state.backgroundNodes.forEach(({ node, inert }) => { node.inert = inert; });
    state.backgroundNodes = [];
    const target = state.previousFocus;
    if (target?.isConnected && target.getClientRects().length) target.focus();
    else launcher.focus();
  }

  async function loadCourse() {
    const id = input.value.trim();
    if (!/^\d{2,12}$/.test(id)) return status('请输入课程页面网址中的数字课程 ID。', true);
    cancelProbe();
    resetVideo();
    state.current = null;
    state.currentCourseId = '';
    state.live = false;
    $('.icp-go-live').hidden = true;
    $('.icp-placeholder').hidden = false;
    $('.icp-now-title').textContent = '等待选择课次';
    $('.icp-date').textContent = '';
    state.courseController?.abort();
    const controller = new AbortController();
    state.courseController = controller;
    const token = ++state.courseToken;
    // Keep the previous list until the new course has loaded successfully.
    $('.icp-load').disabled = true;
    state.courseLoading = true;
    renderList();
    status('正在读取课程和课次…');
    try {
      const data = await core.api(ctx, '/courseapi/v3/multi-search/get-course-detail', { course_id: id }, { signal: controller.signal });
      if (state.courseToken !== token || panel.hidden) return;
      state.courseId = id;
      state.course = core.parseCourse(data);
      state.course.lectures.forEach((lecture) => { lecture.resource = core.hasLectureStarted(lecture) ? 'pending' : 'upcoming'; });
      filter.value = '';
      $('.icp-course-title').textContent = state.course.title;
      $('.icp-teacher').textContent = state.course.teacher;
      renderList();
      status('课程已加载，正在检查课次资源。');
      void scanResources();
    } catch (error) {
      if (state.courseToken === token && !controller.signal.aborted) status('无法读取课程：' + error.message + '。请检查登录状态和课程权限。', true);
    } finally {
      if (state.courseToken === token) {
        $('.icp-load').disabled = false;
        state.courseLoading = false;
        renderList();
      }
    }
  }

  function cancelProbe() {
    state.probeToken += 1;
    state.probeController?.abort();
    state.probing = false;
    if (state.course) {
      state.course.lectures.forEach((lecture) => { if (lecture.resource === 'pending') lecture.resource = 'unknown'; });
      updateResourceStatus();
    }
  }

  function updateResourceStatus() {
    const lectures = state.course?.lectures || [];
    const ready = lectures.filter((lecture) => ['video', 'live'].includes(lecture.resource)).length;
    const missing = lectures.filter((lecture) => lecture.resource === 'missing').length;
    const unknown = lectures.filter((lecture) => lecture.resource === 'unknown').length;
    const upcoming = lectures.filter((lecture) => lecture.resource === 'upcoming').length;
    const checked = lectures.filter((lecture) => !['pending', 'upcoming'].includes(lecture.resource)).length;
    $('.icp-resource-status').textContent = state.probing
      ? '正在检查 ' + checked + '/' + (lectures.length - upcoming) + ' · 找到 ' + ready + ' 节'
      : '显示 ' + ready + ' 节' + (missing ? ' · 隐藏 ' + missing + ' 节无资源课次' : '') + (unknown ? ' · ' + unknown + ' 节未能确认' : '') + (upcoming ? ' · ' + upcoming + ' 节尚未开课' : '');
    $('.icp-probe-retry').hidden = state.probing || !unknown;
  }

  async function scanResources(retryUnknown = false) {
    cancelProbe();
    const course = state.course;
    const courseId = state.courseId;
    const controller = new AbortController();
    state.probeController = controller;
    const token = ++state.probeToken;
    course.lectures.forEach((lecture) => {
      if (!core.hasLectureStarted(lecture)) lecture.resource = 'upcoming';
      else if (lecture.resource === 'upcoming') lecture.resource = 'pending';
    });
    const lectures = course.lectures.filter((lecture) => lecture.resource !== 'upcoming' && (!retryUnknown || ['unknown', 'pending'].includes(lecture.resource)));
    lectures.forEach((lecture) => { lecture.resource = 'pending'; });
    state.probing = true;
    updateResourceStatus();
    renderList();
    let next = 0;
    async function worker() {
      while (next < lectures.length && !controller.signal.aborted) {
        const lecture = lectures[next++];
        try {
          const result = await core.probeLecture(ctx, courseId, lecture, { signal: controller.signal });
          if (state.probeToken !== token || controller.signal.aborted) return;
          lecture.resource = result;
        } catch {
          if (state.probeToken !== token || controller.signal.aborted) return;
          lecture.resource = 'unknown';
        }
        updateResourceStatus();
        renderList();
      }
    }
    await Promise.all(Array.from({ length: Math.min(3, lectures.length) }, worker));
    if (state.probeToken !== token || controller.signal.aborted) return;
    state.probing = false;
    updateResourceStatus();
    renderList();
    if ($('.icp-status').textContent === '课程已加载，正在检查课次资源。') {
      const count = course.lectures.filter((lecture) => ['video', 'live'].includes(lecture.resource)).length;
      status(count ? '已找到 ' + count + ' 节有资源的课次，选择后开始观看。' : '资源检查已完成，请查看左侧检查结果。');
    }
  }

  function renderList() {
    const focusedId = document.activeElement?.closest('.icp-lecture')?.dataset.lectureId;
    const query = filter.value.trim().toLowerCase();
    list.replaceChildren();
    for (const lecture of state.course?.lectures || []) {
      if (!['video', 'live'].includes(lecture.resource)) continue;
      if (query && !(lecture.title + lecture.date).toLowerCase().includes(query)) continue;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'icp-lecture';
      button.dataset.lectureId = lecture.id;
      button.disabled = state.courseLoading;
      button.classList.toggle('icp-active', state.current?.id === lecture.id);
      if (state.current?.id === lecture.id) button.setAttribute('aria-current', 'true');
      const name = document.createElement('strong');
      name.textContent = lecture.title;
      const meta = document.createElement('span');
      meta.textContent = lecture.date + (lecture.resource === 'live' ? ' · 直播资源' : ' · 录播资源');
      const progress = document.createElement('span');
      progress.className = 'icp-progress';
      describeProgress(progress, readProgress(lecture, state.courseId));
      button.append(name, meta, progress);
      button.addEventListener('click', () => playLecture(lecture));
      list.append(button);
    }
    if (!list.children.length) {
      const empty = document.createElement('p');
      empty.className = 'icp-empty';
      empty.textContent = !state.course ? '打开课程后显示课次' : query ? '没有匹配的课次' : state.probing ? '正在检查资源，找到后会自动显示' : state.course.lectures.some((lecture) => lecture.resource === 'unknown') ? '尚未确认可用资源，请重新检查' : state.course.lectures.length && state.course.lectures.every((lecture) => lecture.resource === 'upcoming') ? '课次尚未开始，开课后重新打开课程检查资源' : '这门课程暂时没有可用的直播或录播资源';
      list.append(empty);
    }
    if (focusedId && !panel.hidden) {
      for (const row of list.querySelectorAll('.icp-lecture')) {
        if (row.dataset.lectureId === focusedId && !row.disabled) row.focus({ preventScroll: true });
      }
    }
  }

  function storageGet(key) { try { return localStorage.getItem(key); } catch { return null; } }
  function storageSet(key, value) { try { localStorage.setItem(key, value); } catch { /* Playback works even when storage is unavailable. */ } }
  function progressKey(lecture, courseId) { return 'icp:progress:' + courseId + ':' + lecture.id; }
  function readProgress(lecture, courseId) {
    try {
      const value = JSON.parse(storageGet(progressKey(lecture, courseId)) || '0');
      const time = typeof value === 'number' ? value : Number(value?.time);
      return { time: Number.isFinite(time) && time >= 0 ? time : 0, duration: Number(value?.duration) || 0, completed: value?.completed === true };
    } catch { return { time: 0, duration: 0, completed: false }; }
  }
  function describeProgress(el, progress) {
    el.hidden = !progress.time && !progress.completed;
    const percent = progress.duration > 0 ? Math.min(100, Math.floor(progress.time / progress.duration * 100)) : 0;
    el.textContent = progress.completed ? '已看完' : '看到 ' + Math.floor(progress.time / 60) + ':' + String(Math.floor(progress.time % 60)).padStart(2, '0') + (progress.duration > 0 ? ' · ' + percent + '%' : '');
    el.style.setProperty('--icp-progress', (progress.completed ? 100 : percent) + '%');
  }
  function saveProgress(completed = false) {
    if (!state.current || state.live || !state.currentCourseId || video.readyState < 1 || state.restoreAt > 0 || (!completed && video.ended)) return;
    const time = Math.floor(video.currentTime);
    if (!Number.isFinite(time) || time < 0) return;
    state.lastSaved = time;
    const progress = { time, duration: Number.isFinite(video.duration) ? Math.floor(video.duration) : 0, completed };
    storageSet(progressKey(state.current, state.currentCourseId), JSON.stringify(progress));
    if (state.courseId === state.currentCourseId) {
      for (const row of list.querySelectorAll('.icp-lecture')) {
        if (row.dataset.lectureId === state.current.id) describeProgress(row.querySelector('.icp-progress'), progress);
      }
    }
  }
  function clearSubtitle() {
    video.querySelectorAll('track').forEach((track) => track.remove());
    if (state.subtitleUrl) URL.revokeObjectURL(state.subtitleUrl);
    state.subtitleUrl = null;
    state.cues = [];
    state.platformCues = []; state.localCues = []; state.captionSource = 'platform'; state.asrEpoch++;
    $('.icp-caption-source').value = 'platform';
    $('.icp-local-caption').hidden = true; $('.icp-local-caption').textContent = '';
    state.activeCue = -1;
    state.captionsLoading = false;
    $('.icp-transcript-filter').value = '';
    $('.icp-subtitle-status').textContent = '字幕未加载';
    updateCaptionButton();
    renderTranscript();
  }

  function resetVideo() {
    saveProgress();
    state.loadToken += 1;
    state.playController?.abort();
    video.pause();
    if (state.hls) { state.hls.destroy(); state.hls = null; }
    stopVoice();
    video.removeAttribute('src');
    video.load();
    state.restoreAt = 0;
    clearSubtitle();
  }

  async function playLecture(lecture) {
    if (state.courseLoading || panel.hidden) return;
    resetVideo();
    const token = state.loadToken;
    const controller = new AbortController();
    state.playController = controller;
    const courseId = state.courseId;
    state.currentCourseId = courseId;
    state.live = false;
    $('.icp-go-live').hidden = true;
    state.current = lecture;
    const progress = readProgress(lecture, courseId);
    state.restoreAt = progress.completed ? 0 : progress.time;
    state.lastSaved = state.restoreAt;
    renderList();
    $('.icp-now-title').textContent = lecture.title;
    $('.icp-date').textContent = lecture.date;
    status('正在获取视频地址…');
    try {
      let sub = null;
      try {
        sub = await core.api(ctx, '/courseapi/v3/portal-home-setting/get-sub-info',
          { course_id: courseId, sub_id: lecture.id }, { allowPartial: true, signal: controller.signal });
      } catch { /* Match the reference client's get-sub-detail fallback. */ }
      if (state.loadToken !== token) return;
      const activeLive = sub?.data ? (String(sub.data.sub_type || '').includes('live') && ['1', '2'].includes(String(sub.data.sub_status))) : lecture.live;
      if (lecture.live !== activeLive) { lecture.live = activeLive; renderList(); }
      if (sub?.data?.can_watch === false && (activeLive || sub.data.live_url?.output)) {
        throw new Error('平台当前未开放或未授权观看这场直播，请在官方页面检查。');
      }
      const liveSource = activeLive ? core.selectLive(sub || { data: {} }) : null;
      if (liveSource) {
        await startLive(liveSource, lecture);
        return;
      }
      if (activeLive) throw new Error('直播尚未提供可播放的 HLS 地址，请稍后重试。');
      let source = core.selectVideo(sub || { data: {} });
      const infoNow = Number(sub?.data?.now || sub?.data?.content?.now) || null;
      if (!source) {
        const detail = await core.api(ctx, '/courseapi/v3/multi-search/get-sub-detail',
          { course_id: courseId, sub_id: lecture.id }, { signal: controller.signal });
        if (state.loadToken !== token) return;
        source = core.selectVideo(detail, { allowAnyNested: true });
      }
      if (!source) throw new Error('这节课没有可用的 MP4 地址');
      const userResult = await core.api(ctx, '/userapi/v1/infosimple', {}, { signal: controller.signal });
      if (state.loadToken !== token) return;
      const signed = core.signVideo(source.url, userResult.params || userResult.data || {}, source.now || infoNow || undefined);
      video.src = ctx.vpn ? core.vpnUrl(signed) : signed;
      video.playbackRate = Number($('.icp-speed').value);
      $('.icp-placeholder').hidden = true;
      status('视频已就绪。');
      void loadSubtitles(lecture, token, controller.signal);
      try { await video.play(); if (state.loadToken === token && !panel.hidden) status('正在播放。'); }
      catch (error) {
        if (state.loadToken !== token || panel.hidden) return;
        if (error.name === 'NotAllowedError') status('视频已就绪，请点击视频中的播放按钮。');
        else throw error;
      }
    } catch (error) {
      if (state.loadToken === token) status('无法播放：' + error.message, true);
    }
  }

  async function playLive() {
    const raw = $('.icp-live-url').value.trim();
    let url;
    try {
      url = new URL(raw);
      if (!['https:', 'http:'].includes(url.protocol) || !/\.m3u8$/i.test(url.pathname)) throw new Error();
    } catch { return status('请输入有效的 HTTP(S) .m3u8 直播地址。', true); }
    await startLive(raw);
  }

  async function startLive(raw, lecture = null) {
    resetVideo();
    const token = state.loadToken;
    const liveVideo = video;
    state.current = lecture;
    state.currentCourseId = state.courseId;
    state.live = true;
    state.restoreAt = 0;
    $('.icp-now-title').textContent = lecture?.title || 'HLS 直播';
    $('.icp-date').textContent = lecture?.date || '';
    $('.icp-placeholder').hidden = true;
    $('.icp-go-live').hidden = false;
    renderList();
    updateCaptionButton();
    $('.icp-subtitle-status').textContent = '直播暂无字幕';
    renderTranscript();
    video.playbackRate = Number($('.icp-speed').value);
    const url = new URL(raw);
    const source = ctx.vpn && url.hostname !== location.hostname ? core.vpnUrl(raw) : raw;
    status('正在连接直播流…');
    try {
      if (typeof Hls !== 'undefined' && Hls.isSupported()) {
        state.hls = new Hls({ enableWorker: false, lowLatencyMode: true, backBufferLength: 30 });
        state.hls.on(Hls.Events.ERROR, (_event, data) => {
          if (state.loadToken !== token || panel.hidden) return;
          if (data.fatal) status('直播流加载失败：' + (data.details || '请检查地址、权限和跨域设置'), true);
        });
        state.hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (state.loadToken !== token || panel.hidden) return;
          void liveVideo.play().catch(() => { if (state.loadToken === token && !panel.hidden) status('直播已就绪，请点击播放按钮。'); });
        });
        state.hls.loadSource(source);
        state.hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        await liveVideo.play().catch(() => { if (state.loadToken === token && !panel.hidden) status('直播已就绪，请点击播放按钮。'); });
      } else {
        throw new Error('当前浏览器不支持 HLS');
      }
    } catch (error) { status('无法连接直播：' + error.message, true); }
  }

  function goLive() {
    if (video.seekable.length) video.currentTime = video.seekable.end(video.seekable.length - 1);
  }

  async function loadSubtitles(lecture, token, signal) {
    state.captionsLoading = true;
    updateCaptionButton();
    $('.icp-subtitle-status').textContent = '正在读取字幕…';
    try {
      const data = await core.api(ctx, '/courseapi/v3/web-socket/search-trans-result', { sub_id: lecture.id, format: 'json' }, { signal });
      if (state.loadToken !== token) return;
      state.captionsLoading = false;
      state.platformCues = core.subtitleCues(data);
      state.cues = state.captionSource === 'local' ? state.localCues : state.platformCues;
      updateCaptionButton();
      renderTranscript();
      if (!state.platformCues.length) { if (state.captionSource === 'platform') $('.icp-subtitle-status').textContent = '暂无平台字幕'; return; }
      const blob = new Blob([core.subtitleVtt(state.platformCues)], { type: 'text/vtt' });
      state.subtitleUrl = URL.createObjectURL(blob);
      const track = document.createElement('track');
      track.kind = 'subtitles'; track.label = '平台转写'; track.srclang = 'zh'; track.src = state.subtitleUrl;
      track.default = state.captionOn;
      video.append(track);
      if (video.textTracks[0]) video.textTracks[0].mode = state.captionOn && state.captionSource === 'platform' ? 'showing' : 'disabled';
      track.addEventListener('load', () => { if (state.loadToken === token && video.textTracks[0]) video.textTracks[0].mode = state.captionOn && state.captionSource === 'platform' ? 'showing' : 'disabled'; });
      if (state.captionSource === 'platform') $('.icp-subtitle-status').textContent = state.platformCues.length + ' 条平台字幕';
    } catch {
      if (state.loadToken === token) {
        state.captionsLoading = false;
        updateCaptionButton();
        if (state.captionSource === 'platform') $('.icp-subtitle-status').textContent = '字幕暂时不可用';
      }
    }
  }

  function seek(delta) {
    if (!video.src && !state.hls) return;
    const start = video.seekable.length ? video.seekable.start(0) : 0;
    const end = video.seekable.length ? video.seekable.end(video.seekable.length - 1) : (Number.isFinite(video.duration) ? video.duration : Infinity);
    video.currentTime = Math.max(start, Math.min(end, video.currentTime + delta));
  }
  async function togglePip() {
    try {
      if (document.pictureInPictureElement) await document.exitPictureInPicture();
      else if (document.pictureInPictureEnabled) await video.requestPictureInPicture();
      else status('当前浏览器不支持画中画。', true);
    } catch { status('无法开启画中画。', true); }
  }
  async function toggleFullscreen() {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await $('.icp-stage').requestFullscreen(); }
    catch { status('无法进入全屏。', true); }
  }

  function bindVideoHandlers() {
    for (const name of ['playing', 'pause', 'seeking', 'seeked', 'ratechange', 'waiting', 'ended']) video.addEventListener(name, () => syncASRClock(true));
    video.addEventListener('loadedmetadata', () => {
      if (!state.live && state.restoreAt > 10 && state.restoreAt < video.duration - 10) video.currentTime = state.restoreAt;
      state.restoreAt = 0;
    });
    video.addEventListener('timeupdate', () => {
      updateActiveCue();
      if (state.captionSource === 'local' && state.audio && Math.abs(video.currentTime - (state.asrLastClock || 0)) > 1) { state.asrLastClock = video.currentTime; syncASRClock(); }
      if (Math.abs(video.currentTime - state.lastSaved) >= 5) saveProgress();
    });
    video.addEventListener('pause', () => {
      saveProgress();
      if (!panel.hidden && video.src && !video.error && !video.ended) status('已暂停，可继续播放。');
    });
    video.addEventListener('playing', () => {
      if (panel.hidden) { video.pause(); return; }
      status(state.live ? '正在直播。' : '正在播放。');
    });
    video.addEventListener('waiting', () => { if (!panel.hidden && !video.error) status('正在缓冲…'); });
    video.addEventListener('ended', () => { saveProgress(true); if (!panel.hidden) status('本节课已播放完毕。'); });
    video.addEventListener('error', () => { if (video.src && !panel.hidden) status('视频加载失败。请检查播放权限或重新选择课次。', true); });
  }
  bindVideoHandlers();
  window.addEventListener('pagehide', () => { stopVoice(); cancelProbe(); saveProgress(); state.playController?.abort(); state.courseController?.abort(); });
  document.addEventListener('focusin', (event) => {
    if (!panel.hidden && !panel.contains(event.target)) $('.icp-close').focus();
  });
  document.addEventListener('keydown', (event) => {
    if (panel.hidden || event.altKey || event.ctrlKey || event.metaKey) return;
    const key = event.key.toLowerCase();
    if (key === 'escape' && !document.fullscreenElement) { event.preventDefault(); event.stopImmediatePropagation(); close(); return; }
    if (key === 'tab') {
      const focusable = Array.from(panel.querySelectorAll('button:not(:disabled), input, select, summary, video[controls], [tabindex="0"]')).filter((el) => el.tabIndex >= 0 && el.getClientRects().length);
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      return;
    }
    if (/INPUT|TEXTAREA|SELECT|BUTTON|A|SUMMARY|VIDEO/.test(document.activeElement?.tagName || '') || document.activeElement?.isContentEditable || document.activeElement?.closest('.icp-tabs')) return;
    if (!video.src && !state.hls) return;
    if (key === ' ' || key === 'spacebar' || key === 'k') {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (event.repeat) return;
      togglePlayback();
    }
    if (key === 'arrowleft') { event.preventDefault(); seek(-10); }
    if (key === 'arrowright') { event.preventDefault(); seek(10); }
    if (key === 'f') { event.preventDefault(); void toggleFullscreen(); }
    if (key === 'p') { event.preventDefault(); void togglePip(); }
    if (key === 'c') toggleCaptions();
  }, true);
})();
