/* global ICourseCore, Hls */
(function () {
  'use strict';
  const core = ICourseCore;
  const ctx = core.context(location);
  if (!ctx || document.getElementById('icp-launcher')) return;

  const state = { courseId: '', course: null, current: null, subtitleUrl: null, cues: [], captionOn: true, activeCue: -1, restoreAt: 0, lastSaved: 0, hls: null, live: false, audio: null, loadToken: 0 };
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
    <div class="icp-shell" role="dialog" aria-modal="true" aria-label="iCourse 随行播放器">
      <header class="icp-header"><div class="icp-brand"><span class="icp-mark">▶</span><div><small>ICOURSE · COMPANION</small><h2>随行播放器</h2></div></div><button class="icp-close" type="button" title="关闭" aria-label="关闭播放器">×</button></header>
      <div class="icp-topbar"><label>课程 ID <input class="icp-course-id" inputmode="numeric" placeholder="从课程网址获取" aria-label="课程 ID"></label><button class="icp-load" type="button">打开课程 <span aria-hidden="true">→</span></button><details class="icp-livebox"><summary>连接直播流</summary><div class="icp-livebar"><label>HLS 直播地址 <input class="icp-live-url" type="url" placeholder="粘贴有权限的 .m3u8 地址" aria-label="HLS 直播地址"></label><button class="icp-live-open" type="button">播放直播</button></div></details></div>
      <p class="icp-status" role="status">在 iCourse 登录后输入课程 ID，或从课程页面自动识别。</p>
      <div class="icp-layout">
        <aside class="icp-sidebar"><div class="icp-course"><small>当前课程</small><strong class="icp-course-title">尚未选择课程</strong><span class="icp-teacher"></span></div><div class="icp-tabs" role="tablist" aria-label="侧栏"><button class="icp-tab icp-tab-active" type="button" data-tab="lectures" role="tab" aria-selected="true">课次</button><button class="icp-tab" type="button" data-tab="transcript" role="tab" aria-selected="false">逐句字幕</button></div><div class="icp-lectures-pane"><input class="icp-filter" placeholder="搜索课次" aria-label="搜索课次"><div class="icp-list" aria-label="课次列表"></div></div><div class="icp-transcript-pane" hidden><p class="icp-transcript-empty">选择课次后读取官方字幕</p><div class="icp-transcript-list"></div></div></aside>
        <main class="icp-main"><div class="icp-stage"><video class="icp-video" controls playsinline preload="metadata"></video><div class="icp-placeholder"><span>▶</span><strong>选择一节课次，开始观看</strong><small>你的课程 · 更舒服的播放体验</small></div><div class="icp-tap-target" role="button" tabindex="0" aria-label="点击暂停或继续播放"></div></div>
          <div class="icp-now"><div><small>当前课次</small><strong class="icp-now-title">等待选择课次</strong></div><span class="icp-date"></span></div>
          <div class="icp-tools"><div class="icp-toolgroup"><button class="icp-back" type="button" title="后退 10 秒">↶ <span>10 秒</span></button><button class="icp-forward" type="button" title="前进 10 秒"><span>10 秒</span> ↷</button><button class="icp-go-live" type="button" hidden>● 回到直播</button></div><div class="icp-toolgroup"><label>速度 <select class="icp-speed"><option value="0.75">0.75×</option><option value="1" selected>1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option><option value="1.75">1.75×</option><option value="2">2×</option><option value="2.5">2.5×</option><option value="3">3×</option></select></label><button class="icp-captions" type="button" aria-pressed="true" disabled>字幕：读取中</button><button class="icp-denoise" type="button" aria-pressed="false">轻度降噪：关</button><button class="icp-pip" type="button">画中画</button><button class="icp-full" type="button">全屏</button></div></div>
          <div class="icp-hint">空格播放/暂停 · ←/→ 快退/快进 · F 全屏 · P 画中画 · C 字幕 · 降噪默认关闭</div>
        </main>
      </div>
    </div>`;
  document.body.append(panel);

  const $ = (selector) => panel.querySelector(selector);
  let video = $('.icp-video');
  const input = $('.icp-course-id');
  const list = $('.icp-list');
  const filter = $('.icp-filter');
  const stage = $('.icp-stage');
  function fitStage() {
    if (panel.hidden || document.fullscreenElement) return;
    const main = $('.icp-main');
    const style = getComputedStyle(main);
    const availableWidth = main.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    const controlsHeight = $('.icp-now').offsetHeight + $('.icp-tools').offsetHeight + $('.icp-hint').offsetHeight + 9;
    const availableHeight = main.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom) - controlsHeight;
    if (availableWidth > 0 && availableHeight > 0) stage.style.width = Math.floor(Math.min(availableWidth, Math.max(190, availableHeight) * 16 / 9)) + 'px';
  }
  const stageObserver = new ResizeObserver(fitStage);
  for (const element of [$('.icp-main'), $('.icp-now'), $('.icp-tools')]) stageObserver.observe(element);
  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) stage.style.width = '';
    else fitStage();
  });
  panel.querySelectorAll('.icp-tab').forEach((button) => button.addEventListener('click', () => showTab(button.dataset.tab)));
  input.value = core.courseIdFromUrl(location.href);
  launcher.addEventListener('click', () => { panel.hidden = false; launcher.hidden = true; fitStage(); if (input.value && !state.course) loadCourse(); });
  $('.icp-close').addEventListener('click', close);
  panel.addEventListener('click', (event) => { if (event.target === panel) close(); });
  $('.icp-load').addEventListener('click', loadCourse);
  $('.icp-live-open').addEventListener('click', playLive);
  input.addEventListener('keydown', (event) => { if (event.key === 'Enter') loadCourse(); });
  filter.addEventListener('input', renderList);
  $('.icp-back').addEventListener('click', () => seek(-10));
  $('.icp-forward').addEventListener('click', () => seek(10));
  $('.icp-go-live').addEventListener('click', goLive);
  $('.icp-speed').addEventListener('change', (event) => { video.playbackRate = Number(event.target.value); });
  $('.icp-pip').addEventListener('click', togglePip);
  $('.icp-full').addEventListener('click', toggleFullscreen);
  $('.icp-captions').addEventListener('click', toggleCaptions);
  $('.icp-denoise').addEventListener('click', toggleDenoise);
  $('.icp-tap-target').addEventListener('click', togglePlayback);
  $('.icp-tap-target').addEventListener('keydown', (event) => { if (event.key === 'Enter') togglePlayback(); });

  function togglePlayback() {
    if (!video.src && !state.hls) return;
    if (video.paused) void video.play();
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
    });
    $('.icp-lectures-pane').hidden = name !== 'lectures';
    $('.icp-transcript-pane').hidden = name !== 'transcript';
    if (name === 'transcript') { state.activeCue = -1; updateActiveCue(); }
  }

  function updateCaptionButton() {
    const button = $('.icp-captions');
    button.disabled = !state.cues.length;
    button.textContent = state.cues.length ? '字幕：' + (state.captionOn ? '开' : '关') : '字幕：暂无';
    button.setAttribute('aria-pressed', String(state.cues.length > 0 && state.captionOn));
  }

  function toggleCaptions() {
    if (!state.cues.length) return;
    state.captionOn = !state.captionOn;
    if (video.textTracks[0]) video.textTracks[0].mode = state.captionOn ? 'showing' : 'disabled';
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
    const active = $('.icp-transcript-list').children[index];
    if (active) {
      active.classList.add('icp-cue-active');
      active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  function renderTranscript() {
    const list = $('.icp-transcript-list');
    const empty = $('.icp-transcript-empty');
    const fragment = document.createDocumentFragment();
    list.replaceChildren();
    empty.hidden = state.cues.length > 0;
    if (!state.cues.length) empty.textContent = state.live ? '直播暂无官方字幕' : '这节课暂无官方字幕';
    for (const cue of state.cues) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'icp-cue';
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
        if (resumeAfterSeek) video.addEventListener('seeked', () => { void video.play(); }, { once: true });
        else if (video.paused) void video.play();
      });
      fragment.append(button);
    }
    list.append(fragment);
    state.activeCue = -1;
    updateActiveCue();
  }

  function supportedAudioSource() {
    const source = video.currentSrc || video.src;
    if (!source) return false;
    try {
      const url = new URL(source);
      return url.protocol === 'blob:' || url.origin === location.origin;
    } catch { return false; }
  }

  function updateDenoiseButton() {
    const button = $('.icp-denoise');
    const enabled = Boolean(state.audio?.enabled);
    button.textContent = '轻度降噪：' + (enabled ? '开' : '关');
    button.setAttribute('aria-pressed', String(enabled));
  }

  async function toggleDenoise() {
    if (!state.audio && !supportedAudioSource()) {
      status('此视频来源不支持安全的浏览器音频处理，原声播放不受影响。', true);
      return;
    }
    try {
      if (!state.audio) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) throw new Error('当前浏览器不支持音频处理');
        const context = new AudioContextClass();
        const source = context.createMediaElementSource(video);
        const lowCut = context.createBiquadFilter();
        lowCut.type = 'highpass'; lowCut.frequency.value = 90;
        const highCut = context.createBiquadFilter();
        highCut.type = 'lowpass'; highCut.frequency.value = 8000;
        const dry = context.createGain();
        const wet = context.createGain();
        dry.gain.value = 1;
        wet.gain.value = 0;
        source.connect(dry).connect(context.destination);
        source.connect(lowCut).connect(highCut).connect(wet).connect(context.destination);
        state.audio = { context, dry, wet, enabled: false };
      }
      await state.audio.context.resume();
      state.audio.enabled = !state.audio.enabled;
      const when = state.audio.context.currentTime;
      state.audio.dry.gain.setTargetAtTime(state.audio.enabled ? 0 : 1, when, 0.02);
      state.audio.wet.gain.setTargetAtTime(state.audio.enabled ? 1 : 0, when, 0.02);
      updateDenoiseButton();
      status(state.audio.enabled ? '轻度降噪已开启：过滤低频轰鸣与高频底噪。' : '轻度降噪已关闭，恢复原声。');
    } catch (error) {
      status('无法开启降噪：' + error.message, true);
    }
  }

  function close() {
    panel.hidden = true;
    launcher.hidden = false;
    video.pause();
    if (state.hls) {
      resetVideo();
      state.live = false;
      $('.icp-go-live').hidden = true;
      $('.icp-placeholder').hidden = false;
    }
  }

  async function loadCourse() {
    const id = input.value.trim();
    if (!/^\d{2,12}$/.test(id)) return status('请输入课程页面网址中的数字课程 ID。', true);
    state.courseId = id;
    state.course = null;
    list.replaceChildren();
    $('.icp-load').disabled = true;
    status('正在读取课程和课次…');
    try {
      const data = await core.api(ctx, '/courseapi/v3/multi-search/get-course-detail', { course_id: id });
      state.course = core.parseCourse(data);
      $('.icp-course-title').textContent = state.course.title;
      $('.icp-teacher').textContent = state.course.teacher;
      renderList();
      status('已找到 ' + state.course.lectures.length + ' 节课。选择课次后自动尝试直播或录播。');
    } catch (error) {
      status('无法读取课程：' + error.message + '。请检查登录状态和课程权限。', true);
    } finally {
      $('.icp-load').disabled = false;
    }
  }

  function renderList() {
    const query = filter.value.trim().toLowerCase();
    list.replaceChildren();
    for (const lecture of state.course?.lectures || []) {
      if (query && !(lecture.title + lecture.date).toLowerCase().includes(query)) continue;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'icp-lecture';
      button.classList.toggle('icp-active', state.current?.id === lecture.id);
      const name = document.createElement('strong');
      name.textContent = lecture.title;
      const meta = document.createElement('span');
      meta.textContent = lecture.date + (lecture.live ? ' · 直播课次' : lecture.available ? ' · 已标记录播' : ' · 可尝试获取视频');
      button.append(name, meta);
      button.addEventListener('click', () => playLecture(lecture));
      list.append(button);
    }
    if (!list.children.length) {
      const empty = document.createElement('p');
      empty.className = 'icp-empty';
      empty.textContent = state.course ? '没有匹配的课次' : '打开课程后显示课次';
      list.append(empty);
    }
  }

  function progressKey(lecture) { return 'icp:progress:' + state.courseId + ':' + lecture.id; }
  function clearSubtitle() {
    video.querySelectorAll('track').forEach((track) => track.remove());
    if (state.subtitleUrl) URL.revokeObjectURL(state.subtitleUrl);
    state.subtitleUrl = null;
    state.cues = [];
    state.activeCue = -1;
    updateCaptionButton();
    renderTranscript();
  }

  function resetVideo() {
    state.loadToken += 1;
    video.pause();
    if (state.hls) { state.hls.destroy(); state.hls = null; }
    if (state.audio) {
      const oldVideo = video;
      const replacement = document.createElement('video');
      replacement.className = 'icp-video';
      replacement.controls = true;
      replacement.playsInline = true;
      replacement.preload = 'metadata';
      oldVideo.replaceWith(replacement);
      video = replacement;
      void state.audio.context.close();
      state.audio = null;
      updateDenoiseButton();
      bindVideoHandlers();
    } else {
      video.removeAttribute('src');
      video.load();
    }
    clearSubtitle();
  }

  async function playLecture(lecture) {
    resetVideo();
    const token = state.loadToken;
    state.live = false;
    $('.icp-go-live').hidden = true;
    state.current = lecture;
    state.restoreAt = Number(localStorage.getItem(progressKey(lecture)) || 0);
    state.lastSaved = state.restoreAt;
    renderList();
    $('.icp-now-title').textContent = lecture.title;
    $('.icp-date').textContent = lecture.date;
    status('正在获取视频地址…');
    try {
      let sub = null;
      try {
        sub = await core.api(ctx, '/courseapi/v3/portal-home-setting/get-sub-info',
          { course_id: state.courseId, sub_id: lecture.id }, { allowPartial: true });
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
          { course_id: state.courseId, sub_id: lecture.id });
        if (state.loadToken !== token) return;
        source = core.selectVideo(detail, { allowAnyNested: true });
      }
      if (!source) throw new Error('这节课没有可用的 MP4 地址');
      const userResult = await core.api(ctx, '/userapi/v1/infosimple');
      if (state.loadToken !== token) return;
      const signed = core.signVideo(source.url, userResult.params || userResult.data || {}, source.now || infoNow || undefined);
      video.src = ctx.vpn ? core.vpnUrl(signed) : signed;
      video.playbackRate = Number($('.icp-speed').value);
      $('.icp-placeholder').hidden = true;
      status('视频已就绪，正在读取官方字幕…');
      void loadSubtitles(lecture, token);
      try { await video.play(); status('正在播放。'); }
      catch (error) {
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
    state.current = lecture;
    state.live = true;
    state.restoreAt = 0;
    $('.icp-now-title').textContent = lecture?.title || 'HLS 直播';
    $('.icp-date').textContent = lecture?.date || '';
    $('.icp-placeholder').hidden = true;
    $('.icp-go-live').hidden = false;
    renderList();
    updateCaptionButton();
    const url = new URL(raw);
    const source = ctx.vpn && url.hostname !== location.hostname ? core.vpnUrl(raw) : raw;
    status('正在连接直播流…');
    try {
      if (typeof Hls !== 'undefined' && Hls.isSupported()) {
        state.hls = new Hls({ enableWorker: false, lowLatencyMode: true, backBufferLength: 30 });
        state.hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) status('直播流加载失败：' + (data.details || '请检查地址、权限和跨域设置'), true);
        });
        state.hls.on(Hls.Events.MANIFEST_PARSED, () => { void video.play().catch(() => status('直播已就绪，请点击播放按钮。')); });
        state.hls.loadSource(source);
        state.hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        await video.play().catch(() => status('直播已就绪，请点击播放按钮。'));
      } else {
        throw new Error('当前浏览器不支持 HLS');
      }
    } catch (error) { status('无法连接直播：' + error.message, true); }
  }

  function goLive() {
    if (video.seekable.length) video.currentTime = video.seekable.end(video.seekable.length - 1);
  }

  async function loadSubtitles(lecture, token) {
    try {
      const data = await core.api(ctx, '/courseapi/v3/web-socket/search-trans-result', { sub_id: lecture.id, format: 'json' });
      if (state.loadToken !== token) return;
      state.cues = core.subtitleCues(data);
      updateCaptionButton();
      renderTranscript();
      if (!state.cues.length) { status('正在播放 · 这节课暂无官方字幕。'); return; }
      const blob = new Blob([core.subtitleVtt(state.cues)], { type: 'text/vtt' });
      state.subtitleUrl = URL.createObjectURL(blob);
      const track = document.createElement('track');
      track.kind = 'subtitles'; track.label = '官方字幕'; track.srclang = 'zh'; track.src = state.subtitleUrl;
      track.default = state.captionOn;
      video.append(track);
      if (video.textTracks[0]) video.textTracks[0].mode = state.captionOn ? 'showing' : 'disabled';
      track.addEventListener('load', () => { if (video.textTracks[0]) video.textTracks[0].mode = state.captionOn ? 'showing' : 'disabled'; });
      status('正在播放 · 已加载 ' + state.cues.length + ' 条官方字幕。');
    } catch { if (state.loadToken === token) status('正在播放 · 暂时无法读取官方字幕。'); }
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
  video.addEventListener('loadedmetadata', () => {
    if (!state.live && state.restoreAt > 10 && state.restoreAt < video.duration - 10) video.currentTime = state.restoreAt;
    state.restoreAt = 0;
  });
  video.addEventListener('timeupdate', () => {
    updateActiveCue();
    if (state.current && !state.live && Math.abs(video.currentTime - state.lastSaved) >= 5) {
      state.lastSaved = video.currentTime;
      localStorage.setItem(progressKey(state.current), String(Math.floor(video.currentTime)));
    }
  });
  video.addEventListener('ended', () => { if (state.current && !state.live) localStorage.removeItem(progressKey(state.current)); });
  video.addEventListener('error', () => { if (video.src) status('视频加载失败。请检查播放权限或重新选择课次。', true); });
  }
  bindVideoHandlers();
  document.addEventListener('keydown', (event) => {
    if (panel.hidden || event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '') || document.activeElement?.isContentEditable) return;
    const key = event.key.toLowerCase();
    if (key === 'escape' && !document.fullscreenElement) { close(); return; }
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
