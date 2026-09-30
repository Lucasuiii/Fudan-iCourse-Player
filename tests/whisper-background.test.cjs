const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
function app(){
 const listeners=[],calls=[];
 const event={addListener(){}};
 const chrome={runtime:{id:'own',getURL:p=>'chrome-extension://own/'+p,onMessage:{addListener:f=>listeners.push(f)}},tabs:{onRemoved:event,onUpdated:event},action:{onClicked:event},storage:{local:{get:async()=>({whisperKey:'private',whisperPrompts:{'11':'QR 分解'}})}}};
 vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../background.js'),'utf8'),{chrome,AbortSignal,fetch:async(url,init)=>{calls.push({url,init});return {ok:true,json:async()=>({cues:[]})};}});
 const send=(message,sender={id:'own',tab:{id:1}})=>new Promise(resolve=>{let waiting=false;for(const f of listeners)waiting=f({target:'whisper-background',courseId:'11',...message},sender,resolve)===true||waiting;if(!waiting)resolve(null);});
 return {send,calls,chrome};
}
test('Whisper credentials stay in background and requests use fixed loopback address',async()=>{
 const a=app();const reply=await a.send({type:'chunk',chunk:{source:'https://icourse.fudan.edu.cn/a.mp4',start:20,duration:100}});
 assert.equal(reply.ok,true);assert.equal(a.calls[0].url,'http://127.0.0.1:8766/chunk');assert.equal(a.calls[0].init.headers.Authorization,'Bearer private');assert.equal(JSON.parse(a.calls[0].init.body).prompt,'QR 分解');assert.equal(JSON.stringify(reply).includes('private'),false);
});
test('foreign senders and offscreen cannot request inference, missing key is actionable',async()=>{
 const a=app();assert.equal(await a.send({type:'chunk'},{id:'foreign',tab:{id:1}}),null);assert.equal(await a.send({type:'chunk'},{id:'own',url:'chrome-extension://own/offscreen.html'}),null);assert.equal(a.calls.length,0);
 a.chrome.storage.local.get=async()=>({});assert.match((await a.send({type:'health'})).error,/连接密钥/);
});

test('optional course glossary never affects another course or trusts caller prompts',async()=>{
 const a=app();await a.send({type:'chunk',courseId:'22',chunk:{source:'https://icourse.fudan.edu.cn/a.mp4',start:20,duration:100,prompt:'无关的术语'}});
 assert.deepEqual(JSON.parse(a.calls[0].init.body),{source:'https://icourse.fudan.edu.cn/a.mp4',start:20,duration:100});
});
test('PCM inference accepts only the extension offscreen owner with active capture',async()=>{
 const a=app();assert.equal(await a.send({type:'stream',samples:[0]}),null);
 a.chrome.runtime.getContexts=async()=>[{}];a.chrome.runtime.sendMessage=async()=>({ok:true,state:{tabId:1}});
 const reply=await a.send({type:'stream',samples:[0]},{id:'own',url:'chrome-extension://own/offscreen.html'});
 assert.equal(reply.ok,true);assert.equal(a.calls[0].url,'http://127.0.0.1:8766/stream');
 a.chrome.runtime.sendMessage=async()=>({ok:true,state:{tabId:null}});
 assert.match((await a.send({type:'stream',samples:[0]},{id:'own',url:'chrome-extension://own/offscreen.html'})).error,/停止/);
});
