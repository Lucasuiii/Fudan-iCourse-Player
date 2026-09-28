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
    const key = CryptoJS.enc.Utf8.parse(VPN_KEY);
    const encoded = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(url.hostname), key, {
      iv: key, mode: CryptoJS.mode.CFB, padding: CryptoJS.pad.NoPadding
    }).ciphertext.toString(CryptoJS.enc.Hex);
    const protocol = url.protocol.slice(0, -1);
    const port = url.port ? '-' + url.port : '';
    return 'https://' + VPN_HOST + '/' + protocol + port + '/77726476706e69737468656265737421' + encoded + url.pathname + url.search + url.hash;
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
    const response = await fetch(url, { credentials: 'include', redirect: 'follow' });
    if (!response.ok) throw new Error('请求失败（HTTP ' + response.status + '）');
    const data = await response.json().catch(() => { throw new Error('登录已失效或接口没有返回课程数据'); });
    if (Number(data.code) !== 0 && Number(data.code) !== 200) {
      const partial = data.data && typeof data.data === 'object' && Object.keys(data.data).length > 0;
      if (!(options.allowPartial && partial)) throw new Error(data.msg || '平台接口未返回可用数据');
    }
    return data;
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
            lectures.push({ id: String(item.id), title, date, available: String(item.playback_status) === '1' });
          }
        }
      }
    }
    lectures.sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
    return { title: String(course.title || '未命名课程'), teacher: String(course.realname || ''), lectures };
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

  root.ICourseCore = { context, vpnUrl, courseIdFromUrl, api, parseCourse, selectVideo, signVideo, subtitleCues, subtitleVtt };
})(globalThis);
