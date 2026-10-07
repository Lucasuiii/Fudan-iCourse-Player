const {test}=require('node:test');const assert=require('node:assert/strict');
const Scheduler=require('../qwen-cache.js');
// Legacy whole-course tests explicitly opt into the now user-initiated generation task.
class Cache extends Scheduler {start(){super.start();this.setContinuous(true);}}
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
test('turning off whole-course generation while paused stops new requests',async()=>{
 const pos={source:'clip',duration:300,time:0,rate:1,paused:true};const calls=[];
 const c=new Cache({snapshot:()=>pos,request:async x=>{calls.push(x.start);return {start:x.start,cues:[]};},onCues:()=>{},onStatus:()=>{},pause:()=>{},resume:()=>{}});
 try{c.start();c.setContinuous(false);await wait();assert.deepEqual(calls,[0]);c.setContinuous(true);await wait();assert.equal(c.completed.size,15);}finally{c.stop();}
});
test('progress covers the partial last window and cleared/source-changed caches',async()=>{
 const pos={source:'clip',duration:45,time:0,rate:1,paused:true};const reports=[];
 const c=new Cache({snapshot:()=>pos,request:async x=>({start:x.start,cues:[]}),onCues:()=>{},onStatus:()=>{},onProgress:p=>reports.push(p),pause:()=>{},resume:()=>{}});
 try{c.start();await wait();assert.ok(reports.some(p=>p.start===40&&p.end===45));assert.equal(reports.at(-1).completed,3);assert.equal(reports.at(-1).total,3);assert.equal(reports.at(-1).start,null);
 c.stop();c.reset(true);assert.equal(reports.at(-1).completed,0);pos.source='other';pos.duration=20;c.start();await wait();assert.equal(reports.at(-1).completed,1);assert.equal(reports.at(-1).total,1);
 }finally{c.stop();}
});
test('paused progress stops showing an active window after in-flight completion',async()=>{
 const pos={source:'clip',duration:300,time:0,rate:1,paused:true};let progress;
 const c=new Cache({snapshot:()=>pos,request:async x=>({start:x.start,cues:[]}),onCues:()=>{},onStatus:()=>{},onProgress:p=>progress=p,pause:()=>{},resume:()=>{}});
 try{c.start();c.setContinuous(false);await wait();assert.equal(progress.completed,1);assert.equal(progress.start,null);assert.equal(progress.total,15);}finally{c.stop();}
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

test('later-window failure reports its range, keeps current cues, and stays visible after playback enters the gap',async()=>{
 const pos={source:'clip',duration:100,time:0,rate:1,paused:true};const statuses=[];let cues=[];
 const c=new Cache({snapshot:()=>pos,request:async x=>{if(x.start===20)throw Error('音频未完整覆盖当前窗口');return {start:x.start,cues:[{start:0,end:19,text:'已有字幕'}]};},onCues:x=>cues=x,onStatus:(text,waiting,info)=>statuses.push(info),pause:()=>{},resume:()=>{}});
 try{c.start();await wait();
  assert.equal(c.active,false);assert.equal(c.completed.size,1);assert.equal(cues[0].text,'已有字幕');
  let status=statuses.at(-1);assert.equal(status.currentReady,true);assert.equal(status.failed,true);
  assert.match(status.text,/后续窗口 0:20–0:40 失败/);assert.match(status.text,/解码音频短于请求窗口/);assert.match(status.text,/具体原因未确认/);assert.match(status.text,/缓存已停止，已有字幕保留/);assert.match(status.text,/重新载入/);
  pos.time=25;c.reset();c.tick();status=statuses.at(-1);assert.equal(status.currentReady,false);assert.match(status.text,/当前位置字幕未就绪/);assert.match(status.text,/当前窗口 0:20–0:40 失败/);
  c.report();assert.equal(statuses.at(-1),status,'progress does not erase failure');
 }finally{c.stop();}
});
test('connection error does not pretend to know the service stopped; retries clear stale failure',async()=>{
 const pos={source:'clip',duration:20,time:0,rate:1,paused:true};let broken=true,status;
 const c=new Cache({snapshot:()=>pos,request:async x=>{if(broken)throw Error('无法连接 Qwen 本地服务（127.0.0.1:8768）');return {start:x.start,cues:[]};},onCues:()=>{},onStatus:(text,w,info)=>status=info,pause:()=>{},resume:()=>{}});
 try{c.start();await wait();assert.match(status.text,/尚不能确认/);assert.equal(status.currentReady,false);
 broken=false;c.start();await wait();assert.equal(status.failed,false);assert.equal(status.currentReady,true);assert.match(status.text,/停顿处可能无字幕/);assert.match(status.text,/全课字幕已缓存/);
 }finally{c.stop();}
});
test('reading and recognition phases identify the processing range and do not claim uncached playback is ready',()=>{
 const pos={source:'clip',duration:100,time:42,rate:1,paused:true};let status;
 const c=new Cache({snapshot:()=>pos,request:()=>new Promise(()=>{}),onCues:()=>{},onStatus:(text,w,info)=>status=info,pause:()=>{},resume:()=>{}});
 try{c.start();c.setPhase('音频读取完成，正在识别与对齐时间戳');
 assert.match(status.text,/当前位置字幕未就绪/);assert.match(status.text,/当前窗口 0:40–1:00/);assert.match(status.text,/正在识别与对齐时间戳/);assert.doesNotMatch(status.text,/正在读取/);
 }finally{c.stop();}
});
test('failure messages distinguish access denied, missing key, and hide signed URLs',async()=>{
 for(const [error,pattern,absent] of [['浏览器分段读取失败：HTTP 403',/课程服务器拒绝音频访问/,/服务未启动/],['本地连接密钥无效',/连接密钥缺失或无效/,/HTTP/],['error https://host/video?token=secret',/具体原因未确认/,/secret/]]){
  let status;const c=new Cache({snapshot:()=>({source:'clip',duration:20,time:0,rate:1,paused:true}),request:async()=>{throw Error(error);},onCues:()=>{},onStatus:text=>status=text,pause:()=>{},resume:()=>{}});
  try{c.start();await wait();assert.match(status,pattern);assert.doesNotMatch(status,absent);}finally{c.stop();}
 }
});

test('unsupported speed remains explicit when playback time updates publish status',()=>{
 const pos={source:'clip',duration:100,time:0,rate:3,paused:true};let text;
 const c=new Cache({snapshot:()=>pos,request:()=>assert.fail('unsupported speed'),onCues:()=>{},onStatus:x=>text=x,pause:()=>{},resume:()=>{}});
 try{c.start();c.publishStatus();assert.match(text,/当前倍速超出支持范围/);assert.match(text,/0.75×–2×/);}finally{c.stop();}
});

test('reopening loads saved timestamped windows before any missing-window recognition',async()=>{
 const pos={source:'clip',duration:60,time:25,rate:2,paused:true};const calls=[],statuses=[];let cues=[];
 const c=new Cache({snapshot:()=>pos,loadSaved:async()=>({windows:[{start:0,end:20,cues:[{start:1,end:2,text:'旧字幕'}]},{start:20,end:40,cues:[{start:25,end:28,text:'当前字幕'}]}]}),request:async x=>{calls.push(x.start);return {start:x.start,cues:[]};},onCues:x=>cues=x,onStatus:t=>statuses.push(t),pause:()=>assert.fail('cached position should not pause'),resume:()=>{}});
 try{c.start();await wait();assert.deepEqual(calls,[40]);assert.equal(c.completed.size,3);assert.equal(cues.length,2);assert.match(statuses[0],/正在加载本机已保存/);assert.match(statuses.at(-1),/全课字幕已缓存/);}finally{c.stop();}
});
test('a cancelled saved-cache load cannot populate a different recording',async()=>{
 const pos={source:'one',duration:20,time:0,rate:1,paused:true};let resolve;
 const c=new Cache({snapshot:()=>pos,loadSaved:()=>new Promise(r=>resolve=r),request:()=>assert.fail('stale load'),onCues:()=>assert.fail('stale cues'),onStatus:()=>{},pause:()=>{},resume:()=>{}});
 c.start();c.stop();pos.source='two';resolve({windows:[{start:0,end:20,cues:[]}]});await wait();assert.equal(c.cache.size,0);
});
test('saved-cache hydration keeps all completed markers but bounds in-page cues near playback',async()=>{
 const pos={source:'clip',duration:4000,time:2000,rate:1,paused:true};
 const c=new Cache({snapshot:()=>pos,loadSaved:async()=>({windows:Array.from({length:200},(_,i)=>({start:i*20,end:i*20+20,cues:[]}))}),request:()=>assert.fail('already saved'),onCues:()=>{},onStatus:()=>{},pause:()=>{},resume:()=>{}});
 try{c.start();await wait();assert.equal(c.completed.size,200);assert.equal(c.cache.size,180);assert.ok(c.cache.has(2000));}finally{c.stop();}
});

function setupScheduler(pos,request,extra={}){
 return new Scheduler({snapshot:()=>pos,request,onCues:()=>{},onStatus:()=>{},pause:()=>{pos.paused=true;},resume:()=>{pos.paused=false;},...extra});
}
test('default scheduler rests after 60 viewing seconds and refills only below low water',async()=>{
 const pos={source:'clip',duration:400,time:0,rate:1,paused:false},calls=[];
 const c=setupScheduler(pos,async x=>{calls.push(x.start);return {start:x.start,cues:[],cached:true};});
 try{c.start();await wait();assert.equal(c.continuous,false);assert.deepEqual(calls,[0,20,40]);
 pos.time=10;c.tick();await wait();assert.equal(calls.length,3);
 pos.time=45;c.tick();await wait();assert.deepEqual(calls,[0,20,40,60,80,100]);
 }finally{c.stop();}
});
test('2x reserves 120 media seconds and a speed change refills the protected area',async()=>{
 const pos={source:'clip',duration:400,time:0,rate:1,paused:false},calls=[];
 const c=setupScheduler(pos,async x=>{calls.push(x.start);return {start:x.start,cues:[],cached:true};});
 try{c.start();await wait();pos.rate=2;c.tick();await wait();assert.deepEqual(calls,[0,20,40,60,80,100]);}finally{c.stop();}
});
test('sparse prefetch protects playback first, then visits odd blocks before even blocks',async()=>{
 const pos={source:'clip',duration:200,time:0,rate:1,paused:false},calls=[];
 const c=setupScheduler(pos,async x=>{calls.push(x.start);return {start:x.start,cues:[],cached:true};});c.setSchedule('skip','standard');
 try{c.start();await wait();assert.deepEqual(calls,[0,20,40,80,120,160,60,100,140,180]);}finally{c.stop();}
});
test('pausing allows in-flight result to finish but starts no new inference, including seeks',async()=>{
 const pos={source:'clip',duration:200,time:0,rate:1,paused:false},pending=[];
 const c=setupScheduler(pos,x=>new Promise(resolve=>pending.push({x,resolve})));
 try{c.start();pending[0].resolve({start:0,cues:[],cached:true});await wait();assert.equal(pending[1].x.start,20);
 pos.paused=true;c.cancelResume();pending[1].resolve({start:20,cues:[],cached:true});await wait();assert.equal(pending.length,2);
 pos.time=100;c.reset();assert.equal(pending.length,2);pos.paused=false;c.tick();assert.equal(pending[2].x.start,100);
 }finally{c.stop();}
});
test('paused opening hydrates cache without recognizing missing audio; whole-course action overrides pause',async()=>{
 const pos={source:'clip',duration:60,time:0,rate:1,paused:true},calls=[];
 const c=setupScheduler(pos,async x=>{calls.push(x.start);return {start:x.start,cues:[]};},{loadSaved:async()=>({windows:[]})});
 try{c.start();await wait();assert.deepEqual(calls,[]);c.setContinuous(true);await wait();assert.deepEqual(calls,[0,20,40]);}finally{c.stop();}
});
test('low and standard rest intervals apply only to new inference; seek bypasses rest',async t=>{
 t.mock.timers.enable({apis:['Date'],now:1000});
 for(const [strength,delay] of [['low',6000],['standard',3000]]){
 const pos={source:'clip',duration:300,time:0,rate:1,paused:false},calls=[];
 const c=setupScheduler(pos,async x=>{calls.push(x.start);return {start:x.start,cues:[]};});c.setSchedule('watch',strength);
 try{c.start();await wait();assert.deepEqual(calls,[0]);assert.equal(c.restUntil,Date.now()+delay);
 t.mock.timers.tick(delay-1);c.tick();assert.equal(calls.length,1);t.mock.timers.tick(1);c.tick();await wait();assert.deepEqual(calls,[0,20]);
 pos.time=180;c.reset();await wait();assert.equal(calls.at(-1),180);
 }finally{c.stop();}
 }
});
test('sparse work uses longer rests and a seek aborts stale work without losing prior cache',async t=>{
 t.mock.timers.enable({apis:['Date'],now:1000});
 const pos={source:'clip',duration:200,time:0,rate:1,paused:false},pending=[];
 const c=setupScheduler(pos,(x,signal)=>new Promise(resolve=>pending.push({x,signal,resolve})));
 c.setSchedule('skip','low');
 try{c.start();for(let i=0;i<3;i++){pending[i].resolve({start:i*20,cues:[],cached:true});await wait();}
 assert.equal(pending[3].x.start,80);pending[3].resolve({start:80,cues:[]});await wait();assert.equal(c.restUntil,Date.now()+15000);
 t.mock.timers.tick(15000);c.tick();assert.equal(pending[4].x.start,120);
 pos.time=180;c.reset();assert.equal(pending[4].signal.aborted,true);assert.equal(pending[5].x.start,180);
 pending[4].resolve({start:120,cues:[]});await wait();assert.equal(c.cache.has(120),false);assert.equal(c.cache.has(80),true);
 }finally{c.stop();}
});

test('returning to continuous watching cancels sparse work and ignores its late result',async()=>{
 const pos={source:'clip',duration:200,time:0,rate:1,paused:false},pending=[];
 const c=setupScheduler(pos,(x,signal)=>new Promise(resolve=>pending.push({x,signal,resolve})));c.setSchedule('skip','standard');
 try{c.start();for(let i=0;i<3;i++){pending[i].resolve({start:i*20,cues:[],cached:true});await wait();}
 assert.equal(pending[3].x.start,80);c.setSchedule('watch','standard');assert.equal(pending[3].signal.aborted,true);
 pending[3].resolve({start:80,cues:[]});await wait();assert.equal(c.cache.has(80),false);assert.equal(c.busy,false);assert.equal(pending.length,4);
 }finally{c.stop();}
});
test('stopping whole-course generation cancels distant work and restores paused scheduling',async()=>{
 const pos={source:'clip',duration:200,time:0,rate:1,paused:true},pending=[];let progress;
 const c=setupScheduler(pos,(x,signal)=>new Promise(resolve=>pending.push({x,signal,resolve})),{onProgress:p=>progress=p});
 try{c.start();c.setContinuous(true);for(let i=0;i<3;i++){pending[i].resolve({start:i*20,cues:[],cached:true});await wait();}
 assert.equal(pending[3].x.start,60);assert.equal(c.requestKind,'whole');c.setContinuous(false);assert.equal(pending[3].signal.aborted,true);assert.equal(progress.wholeCourse,false);
 pending[3].resolve({start:60,cues:[]});await wait();assert.equal(c.completed.size,3);assert.equal(pending.length,4);
 }finally{c.stop();}
});
