const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const { webcrypto } = require('node:crypto');
const source = fs.readFileSync(path.join(__dirname, '../core.js'), 'utf8');
function core(fetch) {
  const sandbox = { URL, AbortController, setTimeout, clearTimeout, crypto: webcrypto, fetch, CryptoJS: require('../vendor/crypto-js.js') };
  vm.runInNewContext(source, sandbox);
  return sandbox.ICourseCore;
}
const ctx = { apiBase: 'https://icourse.fudan.edu.cn', vpn: false };
function stalledFetch(_url, options) {
  return new Promise((_resolve, reject) => {
    const cancel = () => reject(new DOMException('Aborted', 'AbortError'));
    if (options.signal.aborted) cancel();
    else options.signal.addEventListener('abort', cancel, { once: true });
  });
}
test('a stalled request times out with an actionable message', async () => {
  await assert.rejects(core(stalledFetch).api(ctx, '/test', {}, { timeoutMs: 10 }), /请求超时/);
});
test('caller cancellation is preserved, including cancellation before fetch', async () => {
  for (const before of [false, true]) {
    const controller = new AbortController();
    if (before) controller.abort();
    const request = core(stalledFetch).api(ctx, '/test', {}, { signal: controller.signal });
    if (!before) controller.abort();
    await assert.rejects(request, { name: 'AbortError' });
  }
});
test('timeout also covers a stalled response body', async () => {
  const fetch = async (_url, options) => ({ ok: true, json: () => stalledFetch(_url, options) });
  await assert.rejects(core(fetch).api(ctx, '/test', {}, { timeoutMs: 10 }), /请求超时/);
});
test('partial get-sub-info remains usable; other API errors remain errors', async () => {
  const result = { code: 7001, data: { content: { playback: { url: 'https://example.test/a.mp4' } } } };
  const c = core(async () => ({ ok: true, json: async () => result }));
  assert.equal(await c.api(ctx, '/test', {}, { allowPartial: true }), result);
  await assert.rejects(c.api(ctx, '/test'), /平台接口/);
});
test('source selection preserves reference ordering and get-sub-detail fallback', () => {
  const c = core();
  const data = { data: { video_list: { a: { preview_url: 'https://example.test/first.mp4' } }, playurl: { now: 100, a: 'https://example.test/second.mp4' }, content: { playback: { url: 'https://example.test/nested.mp4' } } } };
  assert.match(c.selectVideo(data).url, /first\.mp4/);
  data.data.video_list = {};
  assert.match(c.selectVideo(data).url, /second\.mp4/);
  data.data.playurl = {};
  assert.match(c.selectVideo(data).url, /nested\.mp4/);
  data.data.content.playback.url = 'https://example.test/stream.m3u8';
  assert.equal(c.selectVideo(data), null);
  assert.match(c.selectVideo(data, { allowAnyNested: true }).url, /stream\.m3u8/);
});
test('direct intranet and WebVPN context remain separate and signing preserves URL parameters', () => {
  const c = core();
  const direct = c.context(new URL('https://icourse.fudan.edu.cn/course/123'));
  assert.equal(direct.vpn, false);
  const vpn = c.context(new URL(c.vpnUrl('https://icourse.fudan.edu.cn/course/123')));
  assert.equal(vpn.vpn, true);
  assert.equal(c.context(new URL('https://example.test/')), null);
  const signed = new URL(c.signVideo('https://example.test/a.mp4?existing=1', { id: '1', tenant_id: '2', phone: '123' }, 100));
  assert.equal(signed.searchParams.get('existing'), '1');
  assert.match(signed.searchParams.get('t'), /^1-100-[a-f0-9]{32}$/);
});
test('resource probe keeps partial responses and detail fallback without trusting playback_status', async () => {
  let calls = [];
  const c = core(async (url) => {
    calls.push(url.pathname);
    return { ok: true, json: async () => url.pathname.endsWith('get-sub-info')
      ? { code: 7001, data: { content: { playback: { url: 'https://example.test/a.mp4' } } } }
      : { code: 0, data: {} } };
  });
  assert.equal(await c.probeLecture(ctx, '11', { id: '101', available: false }), 'video');
  assert.equal(calls.length, 1);
  const fallback = core(async (url) => ({ ok: true, json: async () => ({ code: 0, data: url.pathname.endsWith('get-sub-detail') ? { content: { playback: { url: 'https://example.test/a.m3u8' } } } : {} }) }));
  assert.equal(await fallback.probeLecture(ctx, '11', { id: '101' }), 'video');
});
test('resource probe distinguishes absent resources from failed requests', async () => {
  const empty = core(async () => ({ ok: true, json: async () => ({ code: 0, data: {} }) }));
  assert.equal(await empty.probeLecture(ctx, '11', { id: '101' }), 'missing');
  const failed = core(async () => { throw new Error('offline'); });
  assert.equal(await failed.probeLecture(ctx, '11', { id: '101' }), 'unknown');
  const partlyFailed = core(async (url) => {
    if (url.pathname.endsWith('get-sub-info')) throw new Error('offline');
    return { ok: true, json: async () => ({ code: 0, data: {} }) };
  });
  assert.equal(await partlyFailed.probeLecture(ctx, '11', { id: '101' }), 'unknown');
});
test('resource probe checks active live sources and platform permission', async () => {
  for (const [canWatch, expected] of [[true, 'live'], [false, 'missing']]) {
    const c = core(async () => ({ ok: true, json: async () => ({ code: 0, data: { sub_type: 'live', sub_status: 1, can_watch: canWatch, live_url: { output: { m3u8: 'https://example.test/live.m3u8' } } } }) }));
    assert.equal(await c.probeLecture(ctx, '11', { id: '101' }), expected);
  }
});
test('resource probe propagates cancellation instead of marking a lecture missing', async () => {
  const controller = new AbortController();
  const request = core(stalledFetch).probeLecture(ctx, '11', { id: '101' }, { signal: controller.signal });
  controller.abort();
  await assert.rejects(request, { name: 'AbortError' });
});
test('future lectures are hidden using campus timezone and explicit start times', () => {
  const c = core();
  const now = new Date('2026-09-30T00:00:00Z'); // 08:00 in China.
  assert.equal(c.hasLectureStarted({ date: '2026-10-02', title: '2026-10-02第6-8节' }, now), false);
  assert.equal(c.hasLectureStarted({ date: '2026-09-29' }, now), true);
  assert.equal(c.hasLectureStarted({ date: '2026-09-30', title: '2026-09-30 09:00' }, now), false);
  assert.equal(c.hasLectureStarted({ date: '2026-09-30', title: '2026-09-30 08:00' }, now), true);
  assert.equal(c.hasLectureStarted({ date: '2026-09-30', title: '2026-09-30第6-8节' }, now), true);
  assert.equal(c.hasLectureStarted({ date: '2026-10-01' }, new Date('2026-09-30T16:00:00Z')), true);
});
test('refresh uses server clock and signs original media path before WebVPN conversion',async()=>{
 for(const vpn of [false,true]){
  const c=core(async(url,options)=>{assert.equal(options.credentials,'include');return{ok:true,json:async()=>String(url).includes('infosimple')?{code:0,params:{id:'101',tenant_id:'222',phone:'000'}}:{code:0,data:{now:1234567890,video_list:{one:{preview_url:'https://icourse.fudan.edu.cn/media/a.mp4'}}}}};});
  const raw='https://icourse.fudan.edu.cn/media/a.mp4',user={id:'101',tenant_id:'222',phone:'000'};
  const original=vpn?c.vpnUrl(raw):raw;
  const result=await c.refreshVideo({...ctx,vpn},'11','22',original);
  const correct=c.signVideo(raw,user,1234567890);
  assert.equal(new URL(result).searchParams.get('t'),new URL(correct).searchParams.get('t'));
  assert.equal(new URL(result).pathname,new URL(original).pathname);
 }
});
test('refresh rejects changed media before authorizing it for old caption cache',async()=>{
 const c=core(async()=>({ok:true,json:async()=>({code:0,data:{video_list:{one:{preview_url:'https://icourse.fudan.edu.cn/different.mp4'}}}})}));
 await assert.rejects(c.refreshVideo(ctx,'11','22','https://icourse.fudan.edu.cn/a.mp4'),/资源已变化/);
});
test('already-rewritten WebVPN media URLs have the same signature as upstream URLs',()=>{
 const c=core(),user={id:'101',tenant_id:'222',phone:'000'},raw='https://icourse.fudan.edu.cn/media/a.mp4?other=keep';
 const playing=c.vpnUrl(c.signVideo(raw,user,1234567890));
 const resigned=c.signVideo(playing,user,1234567890);
 assert.equal(new URL(resigned).searchParams.get('t'),new URL(playing).searchParams.get('t'));
 assert.equal(new URL(resigned).pathname,new URL(playing).pathname);
 assert.equal(new URL(resigned).searchParams.get('other'),'keep');
});

test('live metadata with omitted status can use HLS, but recordings and permission checks remain separate',()=>{
 const c=core();
 assert.equal(c.liveState({data:{live_url:{output:{m3u8:'https://example.test/live.m3u8'}}}}),true);
 assert.equal(c.liveState({data:{live_url:{output:{m3u8:'https://example.test/live.m3u8'}},video_list:{a:{preview_url:'https://example.test/a.mp4'}}}}),false);
});
test('find live refreshes current lecture metadata and returns source without scanning old recordings',async()=>{
 const date=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()),calls=[];
 const c=core(async url=>{calls.push(String(url));return {ok:true,json:async()=>({code:0,data:{sub_type:'live',sub_status:1,can_watch:true,live_url:{output:{m3u8:'https://example.test/live.m3u8'}}}})};});
 const lecture={id:'now',date};const result=await c.findCurrentLive(ctx,'course',[{id:'old',date:'2000-01-01'},lecture]);
 assert.equal(result.lecture,lecture);assert.match(result.url,/live\.m3u8/);assert.equal(calls.length,1);assert.match(calls[0],/sub_id=now/);
});
test('live discovery reports denied access, unready source, network failure and no active live distinctly',async()=>{
 const lecture={id:'live',live:true};
 for(const [data,message] of [
 [{sub_type:'live',sub_status:1,can_watch:false,live_url:{output:{m3u8:'https://example.test/live.m3u8'}}},/不可观看/],
 [{sub_type:'live',sub_status:1,can_watch:true},/尚未返回/],
 [{sub_type:'live',sub_status:3},/未找到/]]){
 const c=core(async()=>({ok:true,json:async()=>({code:0,data})}));await assert.rejects(c.findCurrentLive(ctx,'course',[lecture]),message);
 }
 await assert.rejects(core(async()=>{throw Error('offline');}).findCurrentLive(ctx,'course',[lecture]),/读取失败/);
});
test('live discovery honors caller cancellation and cannot return a stale source',async()=>{
 const controller=new AbortController();const c=core(stalledFetch);
 const p=c.findCurrentLive(ctx,'course',[{id:'live',live:true}],{signal:controller.signal});controller.abort();await assert.rejects(p,{name:'AbortError'});
});


test('live fallback can supply an alternate HLS source without overriding explicit denial',async()=>{
 const live={sub_type:'live',sub_status:1};
 for(const [primary,detail,allowed] of [
 [{...live,can_watch:true},{...live,live_url:{output:{m3u8:'https://example.test/alternate.m3u8'}}},true],
 [{...live,can_watch:false},{...live,can_watch:true,live_url:{output:{m3u8:'https://example.test/alternate.m3u8'}}},true],
 [{...live,can_watch:false},{...live,live_url:{output:{m3u8:'https://example.test/alternate.m3u8'}}},false],
 [{...live,can_watch:true},{...live,can_watch:false,live_url:{output:{m3u8:'https://example.test/alternate.m3u8'}}},false]]){
 const c=core(async url=>({ok:true,json:async()=>({code:0,data:url.pathname.endsWith('get-sub-detail')?detail:primary})}));
 const result=c.findCurrentLive(ctx,'course',[{id:'now',live:true}]);
 if(allowed)assert.match((await result).url,/alternate\.m3u8/);else await assert.rejects(result,/不可观看/);
 }
});
