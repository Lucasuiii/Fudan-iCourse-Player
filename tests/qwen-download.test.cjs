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
