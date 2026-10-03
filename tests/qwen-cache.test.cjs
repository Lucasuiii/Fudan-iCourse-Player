const {test}=require('node:test');const assert=require('node:assert/strict');
const Cache=require('../qwen-cache.js');
const wait=()=>new Promise(r=>setTimeout(r,0));
test('Qwen automatically continues to the end and a speed change keeps cached cues',async()=>{
 let position={source:'clip',duration:200,time:0,rate:2,paused:false,live:false},calls=[],paused=0,resumed=0,cues=[];
 const c=new Cache({snapshot:()=>position,request:async x=>{calls.push(x.start);return {start:x.start,cues:[{start:x.start,end:x.start+20,text:'text'}]};},onCues:x=>cues=x,onStatus:()=>{},pause:()=>paused++,resume:()=>resumed++});
 c.start();await wait();await wait();
 assert.deepEqual(calls,[0,20,40,60,80,100,120,140,160,180]);assert.equal(paused,1);assert.equal(resumed,1);assert.equal(cues.length,10);
 position.rate=1.5;c.tick();assert.equal(calls.length,10);c.stop();
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
test('continuous caching fills earlier windows after the end even while paused',async()=>{
 const pos={source:'clip',duration:100,time:40,rate:1,paused:true};const calls=[];
 const c=new Cache({snapshot:()=>pos,request:async x=>{calls.push(x.start);return {start:x.start,cues:[]};},onCues:()=>{},onStatus:()=>{},pause:()=>assert.fail('already paused'),resume:()=>assert.fail('manual pause must be retained')});
 try{c.start();await wait();assert.deepEqual(calls,[40,60,80,0,20]);assert.equal(c.completed.size,5);c.tick();assert.equal(calls.length,5);}finally{c.stop();}
});
test('long-course memory eviction does not repeatedly recognize evicted future windows',async()=>{
 const pos={source:'clip',duration:4200,time:0,rate:2,paused:true};const calls=[];
 const c=new Cache({snapshot:()=>pos,request:async x=>{calls.push(x.start);return {start:x.start,cues:[]};},onCues:()=>{},onStatus:()=>{},pause:()=>{},resume:()=>{}});
 try{c.start();await wait();assert.equal(calls.length,210);assert.equal(c.completed.size,210);assert.equal(c.cache.size,180);c.tick();assert.equal(calls.length,210);}finally{c.stop();}
});
test('seeking prioritizes the new current window over an in-flight background window',async()=>{
 let pos={source:'clip',duration:200,time:0,rate:1,paused:true};const pending=[];
 const c=new Cache({snapshot:()=>pos,request:(x,signal)=>new Promise(resolve=>pending.push({x,signal,resolve})),onCues:()=>{},onStatus:()=>{},pause:()=>{},resume:()=>{}});
 try{c.start();pos.time=100;c.tick();assert.equal(pending[0].signal.aborted,true);assert.equal(pending[1].x.start,100);pending[0].resolve({start:0,cues:[]});await wait();assert.equal(c.cache.has(0),false);}finally{c.stop();}
});
test('background caching can finish remaining windows after playback reaches the end',async()=>{
 const pos={source:'clip',duration:100,time:100,rate:1,paused:true};const calls=[];
 const c=new Cache({snapshot:()=>pos,request:async x=>{calls.push(x.start);return {start:x.start,cues:[]};},onCues:()=>{},onStatus:()=>{},pause:()=>{},resume:()=>{}});
 try{c.start();await wait();assert.deepEqual(calls,[80,0,20,40,60]);}finally{c.stop();}
});
test('turning off whole-course caching retains only the near playback horizon',async()=>{
 const pos={source:'clip',duration:300,time:0,rate:1,paused:true};const calls=[];
 const c=new Cache({snapshot:()=>pos,request:async x=>{calls.push(x.start);return {start:x.start,cues:[]};},onCues:()=>{},onStatus:()=>{},pause:()=>{},resume:()=>{}});
 try{c.setContinuous(false);c.start();await wait();assert.deepEqual(calls,[0,20,40,60,80]);c.setContinuous(true);await wait();assert.equal(c.completed.size,15);}finally{c.stop();}
});
test('progress covers the partial last window and cleared/source-changed caches',async()=>{
 const pos={source:'clip',duration:45,time:0,rate:1,paused:true};const reports=[];
 const c=new Cache({snapshot:()=>pos,request:async x=>({start:x.start,cues:[]}),onCues:()=>{},onStatus:()=>{},onProgress:p=>reports.push(p),pause:()=>{},resume:()=>{}});
 try{c.start();await wait();assert.ok(reports.some(p=>p.start===40&&p.end===45));assert.equal(reports.at(-1).completed,3);assert.equal(reports.at(-1).total,3);assert.equal(reports.at(-1).start,null);
 c.stop();c.reset(true);assert.equal(reports.at(-1).completed,0);pos.source='other';pos.duration=20;c.start();await wait();assert.equal(reports.at(-1).completed,1);assert.equal(reports.at(-1).total,1);
 }finally{c.stop();}
});
test('near-horizon progress stops showing an active window after completion',async()=>{
 const pos={source:'clip',duration:300,time:0,rate:1,paused:true};let progress;
 const c=new Cache({snapshot:()=>pos,request:async x=>({start:x.start,cues:[]}),onCues:()=>{},onStatus:()=>{},onProgress:p=>progress=p,pause:()=>{},resume:()=>{}});
 try{c.setContinuous(false);c.start();await wait();assert.equal(progress.completed,5);assert.equal(progress.start,null);assert.equal(progress.total,15);}finally{c.stop();}
});

test('initial wait resumes at five seconds while inference continues; later gaps do not pause again',async t=>{
 t.mock.timers.enable({apis:['setTimeout','Date'],now:0});
 const pos={source:'clip',duration:200,time:0,rate:1,paused:false},pending=[];let pauses=0,resumes=0;
 const c=new Cache({snapshot:()=>pos,request:(x,signal)=>new Promise(resolve=>pending.push({x,signal,resolve})),onCues:()=>{},onStatus:()=>{},pause:()=>{pauses++;pos.paused=true;},resume:()=>{resumes++;pos.paused=false;}});
 try{c.start();assert.equal(pauses,1);t.mock.timers.tick(4999);assert.equal(resumes,0);t.mock.timers.tick(1);assert.equal(resumes,1);assert.equal(c.waiting,false);assert.equal(c.active,true);assert.equal(pending[0].signal.aborted,false);
 pos.time=20;c.tick();assert.equal(pauses,1);assert.equal(pending[1].x.start,20);
 pending[1].resolve({start:20,cues:[{start:20,end:40,text:'ready'}]});await Promise.resolve();await Promise.resolve();await Promise.resolve();assert.equal(c.cache.has(20),true);assert.equal(resumes,1);
 }finally{c.stop();}
});
test('a manual pause remains paused at the wait deadline and stopping clears the deadline',t=>{
 t.mock.timers.enable({apis:['setTimeout','Date'],now:0});
 const pos={source:'clip',duration:100,time:0,rate:1,paused:false};let resumes=0;
 const c=new Cache({snapshot:()=>pos,request:()=>new Promise(()=>{}),onCues:()=>{},onStatus:()=>{},pause:()=>{pos.paused=true;},resume:()=>resumes++});
 c.start();c.cancelResume();t.mock.timers.tick(5000);assert.equal(resumes,0);c.stop();t.mock.timers.tick(10000);assert.equal(resumes,0);
 pos.paused=false;c.start();c.cancelResume();c.stop();t.mock.timers.tick(5000);assert.equal(resumes,0);
});
test('no-wait setting never pauses playback and seeking grants a new bounded preparation',t=>{
 t.mock.timers.enable({apis:['setTimeout','Date'],now:0});
 const pos={source:'clip',duration:100,time:0,rate:1,paused:false};let pauses=0,resumes=0;
 const c=new Cache({snapshot:()=>pos,waitLimitMs:0,request:()=>new Promise(()=>{}),onCues:()=>{},onStatus:()=>{},pause:()=>{pauses++;pos.paused=true;},resume:()=>{resumes++;pos.paused=false;}});
 try{c.start();assert.equal(pauses,0);assert.equal(c.waiting,false);c.setWaitLimit(3000);pos.time=40;c.reset();assert.equal(pauses,1);t.mock.timers.tick(3000);assert.equal(resumes,1);assert.equal(c.waiting,false);}finally{c.stop();}
});
test('changing the limit during preparation counts time already spent waiting',t=>{
 t.mock.timers.enable({apis:['setTimeout','Date'],now:0});
 const pos={source:'clip',duration:100,time:0,rate:1,paused:false};let resumes=0;
 const c=new Cache({snapshot:()=>pos,request:()=>new Promise(()=>{}),onCues:()=>{},onStatus:()=>{},pause:()=>{pos.paused=true;},resume:()=>{resumes++;pos.paused=false;}});
 try{c.start();t.mock.timers.tick(2000);c.setWaitLimit(3000);t.mock.timers.tick(999);assert.equal(resumes,0);t.mock.timers.tick(1);assert.equal(resumes,1);t.mock.timers.tick(10000);assert.equal(resumes,1);}finally{c.stop();}
});
test('caption layout chooses natural boundaries and preserves identifiers and punctuation',()=>{
 const cases=require('./fixtures/caption-layout.json');
 for(const sample of cases){
  const middle=Math.floor(sample.words.length/2);
  const cues=Cache.layout([{start:0,alignedWords:sample.words.slice(0,middle)},{start:20,alignedWords:sample.words.slice(middle)}]);
  assert.deepEqual(cues.map(c=>c.text),sample.expected,sample.name);
  assert.ok(cues.every(c=>c.end>c.start),sample.name);
 }
});
