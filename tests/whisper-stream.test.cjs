const {test}=require('node:test');const assert=require('node:assert/strict');const vm=require('node:vm');const fs=require('node:fs');
function app(options={}){let node,resolve;const events=[],requests=[];const source={connect:n=>n,disconnect(){}};const context={audioWorklet:{addModule:async()=>{}},createGain:()=>({gain:{},disconnect(){}}),destination:{}};
const scope={performance:{now:()=>1000},Int16Array,AbortController,setTimeout,clearTimeout,fetch:async(url,init)=>{if(options.fetch)return options.fetch(url,init);const m={type:url.split("/").pop(),...(init.body?JSON.parse(init.body):{})};requests.push(m);if(m.type==="health")return {ok:true,json:async()=>({})};return new Promise(r=>resolve=()=>r({ok:true,json:async()=>({text:"正交矩阵"})}));},AudioWorkletNode:class{constructor(){node=this;this.port={};}connect(){return {connect(){}};}disconnect(){}},chrome:{runtime:{sendMessage:async m=>{requests.push(m);if(m.type==='health')return {ok:true,result:{}};return new Promise(r=>resolve=r);}}}};
vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../whisper-stream.js'),'utf8'),scope);
const session=new scope.ICourseWhisperStream.WhisperStream(context,source,e=>events.push(e),'11',{key:'test-local-key',prompt:''});const pcm=()=>node.port.onmessage({data:{samples:new Float32Array(1600).fill(.1),sampleRate:16000}});return {session,events,requests,pcm,resolve:()=>resolve()};}
const tick=()=>new Promise(r=>setImmediate(r));
test('stream inference is bounded and a seek discards stale drafts',async()=>{const a=app();await a.session.start();a.session.setClock({epoch:1,time:10,paused:false,rate:1});for(let i=0;i<20;i++)a.pcm();assert.equal(a.requests.length,2);for(let i=0;i<20;i++)a.pcm();assert.equal(a.requests.length,2);a.session.setClock({epoch:2,time:60,paused:false,rate:1});a.resolve();await tick();assert.equal(a.events.filter(e=>e.type==='text').length,0);assert.equal(a.session.count,0);});
test('draft becomes final at bounded utterance length; close rejects late results',async()=>{const a=app();await a.session.start();a.session.setClock({epoch:1,time:0,paused:false,rate:1});for(let i=0;i<120;i++)a.pcm();a.resolve();await tick();assert.equal(a.events.at(-1).final,false);assert.equal(a.requests.length,3);a.resolve();await tick();assert.equal(a.events.at(-1).final,true);assert.equal(a.session.count,0);for(let i=0;i<20;i++)a.pcm();a.session.close();const n=a.events.length;a.resolve();await tick();assert.equal(a.events.length,n);});
test('paused and unsupported playback never feed recognition',async()=>{const a=app();await a.session.start();for(let i=0;i<20;i++)a.pcm();a.session.setClock({epoch:1,time:0,paused:false,rate:2.5});for(let i=0;i<20;i++)a.pcm();assert.equal(a.requests.length,1);});

test('supported speeds map captured audio duration to media timestamps',async()=>{
 for(const rate of [.75,1,1.25,1.5,1.75,2]){
  const a=app();await a.session.start();a.session.setClock({epoch:1,time:10,paused:false,rate});
  for(let i=0;i<20;i++)a.pcm();a.resolve();await tick();const text=a.events.at(-1);
  assert.equal(text.type,'text');assert.equal(text.end-text.start,2*rate);a.session.close();
 }
});
test('speed changes invalidate inference even if caller epoch is unchanged',async()=>{
 const a=app();await a.session.start();a.session.setClock({epoch:1,time:10,paused:false,rate:1});
 for(let i=0;i<20;i++)a.pcm();a.session.setClock({epoch:1,time:20,paused:false,rate:2});a.resolve();await tick();
 assert.equal(a.events.filter(e=>e.type==='text').length,0);assert.equal(a.session.count,0);
 for(let i=0;i<20;i++)a.pcm();a.resolve();await tick();assert.equal(a.events.at(-1).end-a.events.at(-1).start,4);
});
test('audio captured during final inference continues at the scaled media boundary',async()=>{
 const a=app();await a.session.start();a.session.setClock({epoch:1,time:10,paused:false,rate:2});
 for(let i=0;i<60;i++)a.pcm();a.resolve();await tick();
 for(let i=0;i<20;i++)a.pcm();a.resolve();await tick();
 const final=a.events.at(-1);assert.equal(final.final,true);assert.equal(a.session.count,32000);
 a.resolve();await tick();const next=a.events.at(-1);assert.equal(next.start,final.end);assert.equal(next.end-next.start,4);
});
test('2x commits a shorter captured window rather than waiting twelve wall seconds',async()=>{
 const a=app();await a.session.start();a.session.setClock({epoch:1,time:0,paused:false,rate:2});
 for(let i=0;i<60;i++)a.pcm();a.resolve();await tick();a.resolve();await tick();
 assert.equal(a.events.at(-1).final,true);assert.equal(a.events.at(-1).end-a.events.at(-1).start,12);
});

test('offscreen requests use authenticated loopback and course terms without runtime inference messages',async()=>{
 const calls=[];const a=app({fetch:async(url,init)=>{calls.push({url,init});return {ok:true,json:async()=>({text:'测试'})};}});
 a.session.config.prompt='QR 分解';await a.session.start();await a.session.request('stream',{samples:[0,1]});
 assert.equal(calls[0].url,'http://127.0.0.1:8766/health');assert.equal(calls[0].init.headers.Authorization,'Bearer test-local-key');
 assert.deepEqual(JSON.parse(calls[1].init.body),{samples:[0,1],prompt:'QR 分解'});a.session.close();
});
test('closing a session aborts its active local request',async()=>{
 let signal;const a=app({fetch:async(url,init)=>{signal=init.signal;return new Promise((resolve,reject)=>signal.addEventListener('abort',()=>{const e=Error('aborted');e.name='AbortError';reject(e);}));}});
 const pending=a.session.request('health');a.session.close();assert.equal(signal.aborted,true);await assert.rejects(pending,/超时/);
});
test('service errors and absent trusted configuration are actionable',async()=>{
 const a=app({fetch:async()=>({ok:false,json:async()=>({error:'模型未加载'})})});await assert.rejects(a.session.request('health'),/模型未加载/);
 a.session.config=null;await assert.rejects(a.session.request('health'),/重新加载扩展/);a.session.close();
});

test('slow inference drops stale audio within bounded memory and recovers instead of stopping',async()=>{
 const a=app();await a.session.start();a.session.setClock({epoch:1,time:10,paused:false,rate:1.5});
 for(let i=0;i<170;i++)a.pcm();assert.equal(a.session.closed,false);assert.ok(a.session.count<256000);
 assert.equal(a.events.at(-1).type,'backlog');a.resolve();await tick();assert.equal(a.events.filter(e=>e.type==='text').length,0);
 assert.equal(a.requests.length,3);a.resolve();await tick();assert.equal(a.events.at(-1).type,'text');assert.ok(a.events.at(-1).start>10);a.session.close();
});
