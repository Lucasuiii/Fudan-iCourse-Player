/* global CryptoJS */
(function (root) {
  'use strict';
  const VPN_HOST = 'webvpn.fudan.edu.cn';
  const ICOURSE_HOST = 'icourse.fudan.edu.cn';
  const VPN_KEY = 'wrdvpnisthebest!';
  const VPN_PREFIX = '/https/77726476706e69737468656265737421f9f44e8935236d1e781d8dad961b2631a501f26f';

  function context(locationLike) {
    const host = locationLike.hostname;
    if (host === ICOURSE_HOST) return { apiBase: locationLike.origin, vpn: false };
    if (host === VPN_HOST && locationLike.pathname.startsWith(VPN_PREFIX)) {
      return { apiBase: locationLike.origin + VPN_PREFIX, vpn: true };
    }
    return null;
  }

  function vpnUrl(rawUrl) {
    const url = new URL(rawUrl);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new Error('不支持的视频地址');
    if (url.hostname === VPN_HOST) return url.href;
    const key = CryptoJS.enc.Utf8.parse(VPN_KEY);
    const encoded = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(url.hostname), key, {
      iv: key, mode: CryptoJS.mode.CFB, padding: CryptoJS.pad.NoPadding
    }).ciphertext.toString(CryptoJS.enc.Hex);
    const protocol = url.protocol.slice(0, -1);
    const port = url.port ? '-' + url.port : '';
    return 'https://' + VPN_HOST + '/' + protocol + port + '/77726476706e69737468656265737421' + encoded + url.pathname + url.search + url.hash;
  }

  function hlsConfig(Hls, ctx) {
    const config = { enableWorker: false, lowLatencyMode: true, backBufferLength: 30 };
    if (ctx.vpn) {
      // The generic loader also handles AES keys and init/partial segments.
      // Retain the built-in transport, retry, range and cancellation behavior.
      config.loader = class extends Hls.DefaultConfig.loader {
        load(context, loaderConfig, callbacks) {
          const url = new URL(context.url);
          if (url.protocol === 'http:' || url.protocol === 'https:') context.url = vpnUrl(context.url);
          super.load(context, loaderConfig, callbacks);
        }
      };
    }
    return config;
  }

  function courseIdFromUrl(rawUrl) {
    const url = new URL(rawUrl);
    for (const key of ['course_id', 'courseId', 'id']) {
      const id = url.searchParams.get(key);
      if (id && /^\d{2,12}$/.test(id)) return id;
    }
    const match = url.pathname.match(/(?:course|courses|detail)\/(\d{2,12})(?:\/|$)/i) || url.hash.match(/(?:course|courses|detail)[/=](\d{2,12})(?:\b|\/)/i);
    return match ? match[1] : '';
  }

  async function api(ctx, path, params = {}, options = {}) {
    const url = new URL(ctx.apiBase + path);
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, String(value)));
    const controller = new AbortController();
    const cancel = () => controller.abort();
    if (options.signal?.aborted) cancel();
    else options.signal?.addEventListener('abort', cancel, { once: true });
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; cancel(); }, options.timeoutMs ?? 20000);
    try {
      const response = await fetch(url, { credentials: 'include', redirect: 'follow', signal: controller.signal });
      if (!response.ok) throw new Error('请求失败（HTTP ' + response.status + '）');
      const data = await response.json().catch((error) => {
        if (controller.signal.aborted) throw error;
        throw new Error('登录已失效或接口没有返回课程数据');
      });
      if (Number(data.code) !== 0 && Number(data.code) !== 200) {
        const partial = data.data && typeof data.data === 'object' && Object.keys(data.data).length > 0;
        if (!(options.allowPartial && partial)) throw new Error(data.msg || '平台接口未返回可用数据');
      }
      return data;
    } catch (error) {
      if (timedOut) throw new Error('请求超时，请检查网络后重试');
      throw error;
    } finally {
      clearTimeout(timer);
      options.signal?.removeEventListener('abort', cancel);
    }
  }

  function parseCourse(data) {
    const course = data.data || {};
    const lectures = [];
    for (const [year, months] of Object.entries(course.sub_list || {})) {
      for (const [month, days] of Object.entries(months || {})) {
        for (const [day, items] of Object.entries(days || {})) {
          for (const item of Array.isArray(items) ? items : []) {
            if (!item.id) continue;
            const title = String(item.sub_title || '课次 ' + item.id);
            const date = /^\d{4}-\d{2}-\d{2}/.exec(title)?.[0] || [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
            lectures.push({ id: String(item.id), title, date, available: String(item.playback_status) === '1', live: String(item.sub_type || '').includes('live') && ['1', '2'].includes(String(item.sub_status)) });
          }
        }
      }
    }
    lectures.sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
    return { title: String(course.title || '未命名课程'), teacher: String(course.realname || ''), lectures };
  }

  function hasLectureStarted(lecture, now = new Date()) {
    // Campus dates are evaluated in China time, independent of browser timezone.
    const parts = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
    const value = (type) => parts.find((part) => part.type === type).value;
    const today = value('year') + '-' + value('month') + '-' + value('day');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(lecture.date || '')) return true;
    if (lecture.date !== today) return lecture.date < today;
    // Honor an explicit clock time in the title; do not guess class-period times.
    const time = /^\d{4}-\d{2}-\d{2}[ T]+(\d{1,2}):(\d{2})/.exec(lecture.title || '');
    if (!time || Number(time[1]) > 23 || Number(time[2]) > 59) return true;
    return new Date(lecture.date + 'T' + time[1].padStart(2, '0') + ':' + time[2] + ':00+08:00').getTime() <= now.getTime();
  }

  function selectVideo(data, options = {}) {
    const info = data.data || {};
    const candidates = [];
    for (const entry of Object.values(info.video_list || {})) {
      if (entry && typeof entry === 'object') candidates.push(entry.preview_url);
    }
    for (const [key, value] of Object.entries(info.playurl || {})) if (key !== 'now') candidates.push(value);
    candidates.push(info.content?.playback?.url);
    for (const candidate of candidates) {
      if (typeof candidate !== 'string') continue;
      try {
        const url = new URL(candidate);
        if (url.protocol === 'https:' && (/\.mp4$/i.test(url.pathname) || (options.allowAnyNested && candidate === info.content?.playback?.url))) {
          return { url: candidate, now: Number(info.now || info.content?.now) || null };
        }
      } catch { /* Try the next source. */ }
    }
    return null;
  }

  function selectLive(data) {
    const info = data.data || {};
    const live = info.live_url || {};
    if (!live.output) return null;
    const output = live.output;
    const candidates = typeof output === 'string' ? (/\.m3u8(?:$|[?#])/i.test(output) ? [output] : []) : [output.m3u8, output.m3u8_lhd, output.m3u8_lsd];
    for (const candidate of candidates) {
      if (typeof candidate !== 'string') continue;
      try {
        const url = new URL(candidate);
        if (['https:', 'http:'].includes(url.protocol)) {
          url.searchParams.set('clientUUID', crypto.randomUUID());
          return url.toString();
        }
      } catch { /* Try the next quality. */ }
    }
    return null;
  }

  // Inspect platform metadata only; never fetch media or persist signed URLs.
  async function probeLecture(ctx, courseId, lecture, options = {}) {
    const params = { course_id: courseId, sub_id: lecture.id };
    let sub = null;
    let infoFailed = false;
    try {
      sub = await api(ctx, '/courseapi/v3/portal-home-setting/get-sub-info', params, { ...options, allowPartial: true });
    } catch (error) {
      if (options.signal?.aborted) throw error;
      infoFailed = true;
    }
    const activeLive = sub?.data ? String(sub.data.sub_type || '').includes('live') && ['1', '2'].includes(String(sub.data.sub_status)) : lecture.live;
    if (!sub && activeLive) return 'unknown';
    if (sub?.data?.can_watch === false && (activeLive || sub.data.live_url?.output)) return 'missing';
    if (sub && activeLive) {
      return selectLive(sub) ? 'live' : 'missing';
    }
    if (selectVideo(sub || { data: {} })) return 'video';
    try {
      const detail = await api(ctx, '/courseapi/v3/multi-search/get-sub-detail', params, options);
      if (selectVideo(detail, { allowAnyNested: true })) return 'video';
      return infoFailed ? 'unknown' : 'missing';
    } catch (error) {
      if (options.signal?.aborted) throw error;
      return 'unknown';
    }
  }

  function signVideo(rawUrl, user, now = Math.floor(Date.now() / 1000)) {
    const url = new URL(rawUrl);
    const userId = String(user.id || '');
    const tenantId = String(user.tenant_id || '');
    if (!userId || !tenantId) throw new Error('无法读取账户信息，不能验证视频地址');
    const phone = String(user.phone || '').split('').reverse().join('');
    const hash = CryptoJS.MD5(url.pathname + userId + tenantId + phone + now).toString();
    url.searchParams.set('clientUUID', crypto.randomUUID());
    url.searchParams.set('t', userId + '-' + now + '-' + hash);
    return url.toString();
  }

  function subtitleCues(data) {
    const segments = data?.list?.[0]?.all_content;
    if (!Array.isArray(segments)) return [];
    return segments.map((segment) => ({
      start: Number(segment.BeginSec),
      end: Number(segment.EndSec),
      text: String(segment.Text || '').replace(/\s+/g, ' ').trim()
    })).filter((cue) => Number.isFinite(cue.start) && Number.isFinite(cue.end) && cue.start >= 0 && cue.end > cue.start && cue.text)
      .sort((a, b) => a.start - b.start);
  }

  function subtitleVtt(cues) {
    const stamp = (seconds) => {
      const ms = Math.round(seconds * 1000);
      const hours = Math.floor(ms / 3600000);
      const minutes = Math.floor(ms / 60000) % 60;
      const secs = Math.floor(ms / 1000) % 60;
      return [hours, minutes, secs].map((value) => String(value).padStart(2, '0')).join(':') + '.' + String(ms % 1000).padStart(3, '0');
    };
    return 'WEBVTT\n\n' + cues.map((cue) => stamp(cue.start) + ' --> ' + stamp(cue.end) + '\n' + cue.text.replace(/-->/g, '→').replace(/[<>]/g, '') + '\n').join('\n');
  }

  async function voiceRequest(runtime, type, fields = {}) {
    const reload = '请在扩展管理页重新加载Lyue，再刷新课程页面';
    if (!runtime?.id) throw new Error(reload);
    const send = async (operation, data = {}) => {
      let reply;
      try { reply = await runtime.sendMessage({ target: 'voice-background', type: operation, ...data }); }
      catch (error) { throw new Error('音频扩展连接失败：' + error.message + '；' + reload); }
      if (!reply) throw new Error('音频扩展没有响应；' + reload);
      if (!reply.ok) throw new Error(reply.error || '音频扩展操作失败');
      return reply;
    };
    // A refreshed page can run newer code while Chrome still has the old worker.
    if (type === 'asr' && fields.enabled) {
      const capability = await send('state');
      if (capability.asrProtocol !== 1) throw new Error('扩展后台不支持本地识别或尚未完成更新；' + reload);
    }
    return (await send(type, fields)).state;
  }

  root.ICourseCore = { context, vpnUrl, hlsConfig, courseIdFromUrl, api, parseCourse, hasLectureStarted, selectVideo, selectLive, probeLecture, signVideo, subtitleCues, subtitleVtt, voiceRequest };
})(globalThis);
