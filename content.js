/* global ICourseCore, Hls */
(function () {
  'use strict';
  const core = ICourseCore;
  const ctx = core.context(location);
  if (!ctx || document.getElementById('icp-launcher')) return;

  const state = { courseId: '', course: null, current: null, subtitleUrl: null, restoreAt: 0, lastSaved: 0, hls: null, live: false };
  const launcher = document.createElement('button');
  launcher.id = 'icp-launcher';
  launcher.type = 'button';
  launcher.textContent = '▶ 随行播放器';
  launcher.setAttribute('aria-label', '打开 iCourse 随行播放器');
  document.body.append(launcher);

  const panel = document.createElement('div');
  panel.id = 'icp-panel';
  panel.hidden = true;
  panel.innerHTML = `
    <div class="icp-shell" role="dialog" aria-modal="true" aria-label="iCourse 随行播放器">
      <header class="icp-header"><div><small>ICOURSE COMPANION</small><h2>随行播放器</h2></div><button class="icp-close" type="button" title="关闭">×</button></header>
      <div class="icp-topbar"><label>课程 ID <input class="icp-course-id" inputmode="numeric" placeholder="从课程网址获取" aria-label="课程 ID"></label><button class="icp-load" type="button">打开课程</button></div>
      <div class="icp-livebar"><label>已有直播地址？ <input class="icp-live-url" type="url" placeholder="粘贴有权限的 .m3u8 地址" aria-label="HLS 直播地址"></label><button class="icp-live-open" type="button">播放直播</button><span>直播地址仅用于本次播放</span></div>
      <p class="icp-status" role="status">在 iCourse 登录后输入课程 ID，或从课程页面自动识别。</p>
      <div class="icp-layout">
        <aside class="icp-sidebar"><div class="icp-course"><strong class="icp-course-title">尚未选择课程</strong><span class="icp-teacher"></span></div><input class="icp-filter" placeholder="搜索课次" aria-label="搜索课次"><div class="icp-list" aria-label="课次列表"></div></aside>
        <main class="icp-main"><div class="icp-stage"><video class="icp-video" controls playsinline preload="metadata"></video><div class="icp-placeholder"><span>▶</span><strong>选择一节已开放的课次</strong><small>视频不会另存为文件</small></div></div>
          <div class="icp-now"><div><small>当前课次</small><strong class="icp-now-title">等待选择课次</strong></div><span class="icp-date"></span></div>
          <div class="icp-tools"><button class="icp-back" type="button" title="后退 10 秒">↶ 10s</button><button class="icp-forward" type="button" title="前进 10 秒">10s ↷</button><button class="icp-go-live" type="button" hidden>● 回到直播</button><label>速度 <select class="icp-speed"><option value="0.75">0.75×</option><option value="1" selected>1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option><option value="1.75">1.75×</option><option value="2">2×</option><option value="2.5">2.5×</option><option value="3">3×</option></select></label><button class="icp-pip" type="button">画中画</button><button class="icp-full" type="button">全屏</button></div>
          <div class="icp-hint">空格 播放/暂停 · ←/→ 后退/前进 10 秒 · F 全屏 · P 画中画 · C 字幕</div>
        </main>
      </div>
    </div>`;
  document.body.append(panel);

  const $ = (selector) => panel.querySelector(selector);
  const video = $('.icp-video');
  const input = $('.icp-course-id');
  const list = $('.icp-list');
  const filter = $('.icp-filter');
  input.value = core.courseIdFromUrl(location.href);
  launcher.addEventListener('click', () => { panel.hidden = false; launcher.hidden = true; if (input.value && !state.course) loadCourse(); });
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

  function status(message, error = false) {
    const el = $('.icp-status');
    el.textContent = message;
    el.classList.toggle('icp-error', error);
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
      const count = state.course.lectures.filter((item) => item.available).length;
      status('已找到 ' + state.course.lectures.length + ' 节课，其中 ' + count + ' 节已开放播放。');
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
      button.disabled = !lecture.available;
      button.classList.toggle('icp-active', state.current?.id === lecture.id);
      const name = document.createElement('strong');
      name.textContent = lecture.title;
      const meta = document.createElement('span');
      meta.textContent = lecture.date + (lecture.available ? ' · 可播放' : ' · 暂未开放');
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
  }

  function resetVideo() {
    video.pause();
    if (state.hls) { state.hls.destroy(); state.hls = null; }
    video.removeAttribute('src');
    video.load();
    clearSubtitle();
  }

  async function playLecture(lecture) {
    if (!lecture.available) return;
    resetVideo();
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
      const [sub, userResult] = await Promise.all([
        core.api(ctx, '/courseapi/v3/portal-home-setting/get-sub-info', { course_id: state.courseId, sub_id: lecture.id }),
        core.api(ctx, '/userapi/v1/infosimple')
      ]);
      if (state.current !== lecture) return;
      const source = core.selectVideo(sub);
      if (!source) throw new Error('这节课没有已开放的 MP4 视频');
      const signed = core.signVideo(source.url, userResult.params || userResult.data || {}, source.now || undefined);
      video.src = ctx.vpn ? core.vpnUrl(signed) : signed;
      video.playbackRate = Number($('.icp-speed').value);
      $('.icp-placeholder').hidden = true;
      status('视频已就绪。正在尝试加载字幕…');
      void loadSubtitles(lecture);
      try { await video.play(); status('正在播放。'); }
      catch (error) {
        if (error.name === 'NotAllowedError') status('视频已就绪，请点击视频中的播放按钮。');
        else throw error;
      }
    } catch (error) {
      if (state.current === lecture) status('无法播放：' + error.message, true);
    }
  }

  async function playLive() {
    const raw = $('.icp-live-url').value.trim();
    let url;
    try {
      url = new URL(raw);
      if (!['https:', 'http:'].includes(url.protocol) || !/\.m3u8$/i.test(url.pathname)) throw new Error();
    } catch { return status('请输入有效的 HTTP(S) .m3u8 直播地址。', true); }
    resetVideo();
    state.current = null;
    state.live = true;
    state.restoreAt = 0;
    $('.icp-now-title').textContent = 'HLS 直播';
    $('.icp-date').textContent = '';
    $('.icp-placeholder').hidden = true;
    $('.icp-go-live').hidden = false;
    renderList();
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

  async function loadSubtitles(lecture) {
    try {
      const data = await core.api(ctx, '/courseapi/v3/web-socket/search-trans-result', { sub_id: lecture.id, format: 'json' });
      if (state.current !== lecture) return;
      const segments = data.list?.[0]?.all_content || [];
      const stamp = (seconds) => {
        const n = Math.max(0, Number(seconds) || 0);
        const h = Math.floor(n / 3600), m = Math.floor(n / 60) % 60, s = Math.floor(n % 60), ms = Math.floor((n % 1) * 1000);
        return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':') + '.' + String(ms).padStart(3, '0');
      };
      const cues = segments.filter((s) => s.Text && Number(s.EndSec) > Number(s.BeginSec)).map((s, i) =>
        (i + 1) + '\n' + stamp(s.BeginSec) + ' --> ' + stamp(s.EndSec) + '\n' + String(s.Text).replace(/-->/g, '→') + '\n');
      if (!cues.length) return;
      const blob = new Blob(['WEBVTT\n\n' + cues.join('\n')], { type: 'text/vtt' });
      state.subtitleUrl = URL.createObjectURL(blob);
      const track = document.createElement('track');
      track.kind = 'subtitles'; track.label = '官方字幕'; track.srclang = 'zh'; track.src = state.subtitleUrl;
      video.append(track);
      track.addEventListener('load', () => { if (video.textTracks[0]) video.textTracks[0].mode = 'showing'; });
      status('正在播放 · 官方字幕已加载。');
    } catch { /* Subtitles are optional. */ }
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

  video.addEventListener('loadedmetadata', () => {
    if (!state.live && state.restoreAt > 10 && state.restoreAt < video.duration - 10) video.currentTime = state.restoreAt;
    state.restoreAt = 0;
  });
  video.addEventListener('timeupdate', () => {
    if (state.current && Math.abs(video.currentTime - state.lastSaved) >= 5) {
      state.lastSaved = video.currentTime;
      localStorage.setItem(progressKey(state.current), String(Math.floor(video.currentTime)));
    }
  });
  video.addEventListener('ended', () => { if (state.current) localStorage.removeItem(progressKey(state.current)); });
  video.addEventListener('error', () => { if (video.src) status('视频加载失败。请检查播放权限或重新选择课次。', true); });
  document.addEventListener('keydown', (event) => {
    if (panel.hidden || event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '')) return;
    const key = event.key.toLowerCase();
    if (key === 'escape' && !document.fullscreenElement) { close(); return; }
    if (!video.src && !state.hls) return;
    if (key === ' ' || key === 'k') { event.preventDefault(); if (video.paused) void video.play(); else video.pause(); }
    if (key === 'arrowleft') { event.preventDefault(); seek(-10); }
    if (key === 'arrowright') { event.preventDefault(); seek(10); }
    if (key === 'f') { event.preventDefault(); void toggleFullscreen(); }
    if (key === 'p') { event.preventDefault(); void togglePip(); }
    if (key === 'c' && video.textTracks[0]) video.textTracks[0].mode = video.textTracks[0].mode === 'showing' ? 'disabled' : 'showing';
  });
})();
