const {test}=require('node:test');const assert=require('node:assert/strict');const {readRange,open}=require('../qwen-range.js');
function response(start,end,total,status=206){
 let read=false,cancelled=false;
 return{status,headers:{get:()=>`bytes ${start}-${end}/${total}`},body:{cancel:async()=>{cancelled=true},getReader:()=>({read:async()=>read?{done:true}:(read=true,{done:false,value:new Uint8Array(end-start+1).fill(1)}),cancel:async()=>{cancelled=true}})},cancelled:()=>cancelled};
}
test('range transport rejects a full-body response without reading media',async()=>{
 const r=response(0,15,5*1024**3,200);await assert.rejects(readRange(async()=>r,'https://example.com',0,15,new AbortController().signal),/未支持分段/);assert.equal(r.cancelled(),true);
});
test('range transport checks exact boundaries and recording size',async()=>{
 const r=response(10,20,100);await assert.rejects(readRange(async()=>r,'https://example.com',0,15,new AbortController().signal),/范围与请求不符/);assert.equal(r.cancelled(),true);
 const ok=await readRange(async()=>response(0,15,5*1024**3),'https://example.com',0,15,new AbortController().signal);assert.equal(ok.bytes.length,16);assert.equal(ok.total,5*1024**3);
});
test('relay reads only requested windows, then discards its session',async()=>{
 const ranges=[],actions=[];const c=new AbortController();let sent=false;
 const relay=await open({url:'https://icourse.fudan.edu.cn/fresh.mp4',source:'https://icourse.fudan.edu.cn/original.mp4',signal:c.signal,fetcher:async(url,init)=>{
  assert.equal(init.credentials,'include');const m=/bytes=(\d+)-(\d+)/.exec(init.headers.Range);ranges.push([+m[1],+m[2]]);return response(+m[1],+m[2],5*1024**3);
 },send:async m=>{actions.push(m);if(m.action==='begin')return{id:'test'};if(m.action==='poll'&&!sent){sent=true;return{job:{id:'one',start:1048576,end:1048591}};}return{job:null};}});
 for(let i=0;i<20&&!actions.some(x=>x.action==='result');i++)await new Promise(r=>setTimeout(r,5));
 await relay.close();assert.deepEqual(ranges,[[0,15],[1048576,1048591]]);assert.equal(actions.at(-1).action,'abort');assert.equal(relay.error,undefined);
});
test('403 refresh retries the same browser URL once without changing cache identity',async()=>{
 const urls=[],actions=[];let refreshes=0;
 const original='https://icourse.fudan.edu.cn/a.mp4?t=old',fresh='https://icourse.fudan.edu.cn/a.mp4?t=new';
 const relay=await open({url:original,source:original,signal:new AbortController().signal,refreshUrl:async()=>{refreshes++;return fresh;},fetcher:async(url,init)=>{urls.push(url);assert.equal(init.credentials,'include');return response(0,15,100,url===original?403:206);},send:async m=>{actions.push(m);return m.action==='begin'?{id:'x'}:{job:null};}});
 await relay.close();assert.equal(refreshes,1);assert.deepEqual(urls,[original,fresh]);assert.equal(actions.find(x=>x.action==='begin').source,original);
});
test('persistent 403 is bounded and does not start a media session',async()=>{
 let refreshes=0,calls=0;
 await assert.rejects(open({url:'https://icourse.fudan.edu.cn/a.mp4',source:'same',signal:new AbortController().signal,refreshUrl:async()=>{refreshes++;return 'https://icourse.fudan.edu.cn/a.mp4?t=new';},fetcher:async()=>{calls++;return response(0,15,100,403);},send:async()=>assert.fail('no session before authorized bytes')}),/HTTP 403/);
 assert.equal(refreshes,1);assert.equal(calls,2);
});
test('refresh cannot substitute another recording or continue after cancellation',async()=>{
 for(const cancel of [false,true]){
 const c=new AbortController();let calls=0;
 await assert.rejects(open({url:'https://icourse.fudan.edu.cn/a.mp4',source:'same',signal:c.signal,refreshUrl:async()=>{if(cancel)c.abort();return 'https://icourse.fudan.edu.cn/b.mp4';},fetcher:async()=>{calls++;return response(0,15,100,403);},send:async()=>assert.fail('no session')}),cancel?{name:'AbortError'}:/资源已变化/);
 assert.equal(calls,1);
 }
});
test('authorization expiry during later byte reads refreshes the transport and preserves range size',async()=>{
 const calls=[];let sent=false,refreshes=0,result;
 const relay=await open({url:'https://icourse.fudan.edu.cn/a.mp4?t=old',source:'identity',signal:new AbortController().signal,refreshUrl:async()=>{refreshes++;return 'https://icourse.fudan.edu.cn/a.mp4?t=new';},fetcher:async(url,init)=>{const m=/bytes=(\d+)-(\d+)/.exec(init.headers.Range);const start=+m[1],end=+m[2];calls.push({fresh:url.includes('new'),start,end});return response(start,end,1000,start===100&&!url.includes('new')?403:206);},send:async m=>{if(m.action==='begin')return{id:'x'};if(m.action==='poll'&&!sent){sent=true;return{job:{id:'job',start:100,end:115}};}if(m.action==='result')result=m;return{job:null};}});
 for(let i=0;i<20&&!result;i++)await new Promise(r=>setTimeout(r,5));
 await relay.close();assert.equal(refreshes,1);assert.equal(result.error,undefined);assert.deepEqual(calls,[{fresh:false,start:0,end:15},{fresh:false,start:100,end:115},{fresh:true,start:100,end:115}]);
});
