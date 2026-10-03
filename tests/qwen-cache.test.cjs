const {test}=require('node:test');const assert=require('node:assert/strict');
const Cache=require('../qwen-cache.js');
const wait=()=>new Promise(r=>setTimeout(r,0));
test('Qwen prefetch stays within 100 media seconds and a speed change keeps cached cues',async()=>{
 let position={source:'clip',duration:200,time:0,rate:2,paused:false,live:false},calls=[],paused=0,resumed=0,cues=[];
 const c=new Cache({snapshot:()=>position,request:async x=>{calls.push(x.start);return {start:x.start,cues:[{start:x.start,end:x.start+20,text:'text'}]};},onCues:x=>cues=x,onStatus:()=>{},pause:()=>paused++,resume:()=>resumed++});
 c.start();await wait();await wait();
 assert.deepEqual(calls,[0,20,40,60,80]);assert.equal(paused,1);assert.equal(resumed,1);assert.equal(cues.length,5);
 position.rate=1.5;c.tick();assert.equal(calls.length,5);c.stop();
});
test('seek and restart discard a late result; manual cancel does not force playback',async()=>{
 let pos={source:'clip',duration:500,time:0,rate:1,paused:false},resolve,play=0;
 const c=new Cache({snapshot:()=>pos,request:()=>new Promise(r=>resolve=r),onCues:()=>{},onStatus:()=>{},pause:()=>{},resume:()=>play++});
 c.start();const old=resolve;c.cancelResume();c.stop();old({start:0,cues:[]});await wait();assert.equal(c.cache.size,0);assert.equal(play,0);
});
test('unsupported speed releases preparation and service errors restore prior playback',async()=>{
 let pos={source:'clip',duration:100,time:0,rate:1,paused:false},play=0;
 const c=new Cache({snapshot:()=>pos,request:()=>new Promise(()=>{}),onCues:()=>{},onStatus:()=>{},pause:()=>{},resume:()=>play++});
 c.start();pos.rate=3;c.tick();assert.equal(play,1);assert.equal(c.busy,false);c.stop();
 pos.rate=1;
 const broken=new Cache({snapshot:()=>pos,request:async()=>{throw Error('offline');},onCues:()=>{},onStatus:()=>{},pause:()=>{},resume:()=>play++});
 broken.start();await wait();assert.equal(play,2);assert.equal(broken.active,false);broken.stop();
});
