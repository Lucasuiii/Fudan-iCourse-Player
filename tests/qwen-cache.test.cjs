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
test('aligned captions reflow across 20-second windows without cutting a sentence or losing words',()=>{
 const words=Array.from('这是一个跨越窗口边界但应该连贯阅读的句子。下一句。').map((text,i)=>({text,start:19+i*0.1,end:19+(i+1)*0.1}));
 const windows=[{start:0,alignedWords:words.filter(w=>w.start<20)},{start:20,alignedWords:words.filter(w=>w.start>=20)}];
 const cues=Cache.layout(windows);
 assert.equal(cues.length,2);assert.ok(cues[0].start<20&&cues[0].end>20);
 assert.equal(cues.map(c=>c.text).join(''),words.map(w=>w.text).join(''));
 assert.ok(cues[0].text.endsWith('。'));
 assert.deepEqual(windows[0].alignedWords,words.filter(w=>w.start<20));
});
test('caption reflow keeps pauses and separate missing-window gaps, and does not split English words',()=>{
 const cues=Cache.layout([{start:0,alignedWords:[{start:0,end:1,text:'QR'},{start:1,end:2,text:'decomposition'},{start:3,end:4,text:'下一句'}]},{start:40,alignedWords:[{start:40,end:41,text:'另一个窗口'}]}]);
 assert.deepEqual(cues.map(c=>c.text),['QR decomposition','下一句','另一个窗口']);
});
