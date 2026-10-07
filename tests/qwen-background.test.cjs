const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
function app(prompts={'11':'QR 分解'},fetchImpl){
 const listeners=[],calls=[];
 const event={addListener(){}};
 const chrome={runtime:{id:'own',getURL:p=>'chrome-extension://own/'+p,onMessage:{addListener:f=>listeners.push(f)}},tabs:{onRemoved:event,onUpdated:event},action:{onClicked:event},storage:{local:{get:async()=>({whisperKey:'private',whisperPrompts:prompts})}}};
 vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../course-terms.js'),'utf8')+'\n'+fs.readFileSync(require('node:path').join(__dirname,'../background.js'),'utf8'),{chrome,AbortSignal,AbortController,setTimeout,clearTimeout,fetch:fetchImpl||(async(url,init)=>{calls.push({url,init});return {ok:true,json:async()=>({cues:[]})};})});
 const send=(message,sender={id:'own',tab:{id:1}})=>new Promise(resolve=>{let waiting=false;for(const f of listeners)waiting=f({target:'qwen-background',courseId:'11',...message},sender,resolve)===true||waiting;if(!waiting)resolve(null);});
 return {send,calls,chrome};
}
test('saved terms notify matching-course players without exposing key or prompt',async()=>{
 let changed;const notices=[];const event={addListener(){}};
 const chrome={runtime:{id:'own',getURL:p=>'chrome-extension://own/'+p,onMessage:event},tabs:{onRemoved:event,onUpdated:event,query:async()=>[{id:1}],sendMessage:async(id,m)=>notices.push(m)},action:{onClicked:event},storage:{onChanged:{addListener:f=>changed=f}}};
 vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../course-terms.js'),'utf8')+'\n'+fs.readFileSync(require('node:path').join(__dirname,'../background.js'),'utf8'),{chrome});
 changed({whisperPrompts:{oldValue:{'11':'old','22':'unchanged'},newValue:{'11':'QR 分解','22':'unchanged'}}},'local');
 await new Promise(r=>setImmediate(r));assert.deepEqual(Array.from(notices[0].courseIds),['11']);assert.equal(JSON.stringify(notices).includes('QR'),false);
 changed({whisperKey:{oldValue:'secret',newValue:'newsecret'}},'local');await new Promise(r=>setImmediate(r));assert.equal(notices[1].all,true);assert.equal(JSON.stringify(notices).includes('secret'),false);
});

test('Qwen uses its fixed authenticated endpoint and scoped course terms',async()=>{
 const a=app();const r=await a.send({target:'qwen-background',type:'chunk',requestId:'one',chunk:{source:'https://icourse.fudan.edu.cn/a.mp4',start:20,duration:100,prompt:'untrusted'}});
 assert.equal(r.ok,true);assert.equal(a.calls[0].url,'http://127.0.0.1:8768/chunk');assert.equal(a.calls[0].init.headers.Authorization,'Bearer private');assert.equal(JSON.parse(a.calls[0].init.body).prompt,'QR 分解');assert.equal(JSON.stringify(r).includes('private'),false);
 assert.equal(await a.send({target:'qwen-background',type:'chunk'},{id:'foreign',tab:{id:1}}),null);
 assert.equal(await a.send({target:'qwen-background',type:'chunk'},{id:'own',url:'chrome-extension://own/options.html'}),null);
});

test('relay inference uses the trusted tab owner and scoped course prompt',async()=>{
 const a=app();const r=await a.send({target:'qwen-background',type:'relay-chunk',requestId:'relay',relayId:'range-token',owner:'spoof',chunk:{source:'https://icourse.fudan.edu.cn/a.mp4',start:20,duration:100,prompt:'untrusted'}});
 assert.equal(r.ok,true);assert.equal(a.calls[0].url,'http://127.0.0.1:8768/relay-chunk');const body=JSON.parse(a.calls[0].init.body);assert.equal(body.owner,'1');assert.equal(body.relayId,'range-token');assert.equal(body.prompt,'QR 分解');
});
test('Qwen cache lookup uses trusted glossary and owner, and options pages cannot read captions',async()=>{
 const a=app();const message={target:'qwen-background',type:'cached-chunk',courseId:'11',chunk:{source:'https://icourse.fudan.edu.cn/a.mp4',start:20,duration:100},owner:'forged'};
 const reply=await a.send(message);assert.equal(reply.ok,true);
 assert.equal(a.calls[0].url,'http://127.0.0.1:8768/cached-chunk');
 const data=JSON.parse(a.calls[0].init.body);assert.equal(data.owner,'1');assert.equal(data.prompt,'QR 分解');
 assert.equal(await a.send(message,{id:'own',url:'chrome-extension://own/options.html'}),null);
});

test('Qwen inference, cache lookup, export use only the saved course context',async()=>{
 const a=app({'38146':'ε epsilon，QR 分解'});
 for(const type of ['chunk','cached-chunk','export-captions'])assert.equal((await a.send({target:'qwen-background',type,courseId:'38146',requestId:type,chunk:{source:'https://icourse.fudan.edu.cn/a.mp4',start:0,duration:100,prompt:'caller spoof'}})).ok,true);
 const prompts=a.calls.map(c=>JSON.parse(c.init.body).prompt);
 assert.equal(new Set(prompts).size,1);assert.equal(prompts[0],'ε epsilon，QR 分解');assert.equal(prompts[0].includes('caller spoof'),false);
});
test('numerical course inference has no implicit glossary when its settings are empty',async()=>{
 const a=app();
 await a.send({target:'qwen-background',type:'chunk',courseId:'38146',chunk:{source:'https://icourse.fudan.edu.cn/a.mp4',start:0,duration:100}});
 assert.equal(JSON.parse(a.calls[0].init.body).prompt,'');
});

test('Qwen loopback connection failure is explicit without claiming a confirmed shutdown',async()=>{
 const a=app({},async()=>{throw TypeError('Failed to fetch');});
 const reply=await a.send({target:'qwen-background',type:'cached-chunk',requestId:'offline',chunk:{source:'clip',start:0,duration:20}});
 assert.equal(reply.ok,false);assert.match(reply.error,/无法连接 Qwen 本地服务/);assert.match(reply.error,/127.0.0.1:8768/);assert.match(reply.error,/具体原因未确认/);assert.doesNotMatch(reply.error,/服务已退出|服务未启动/);
});
test('Qwen service HTTP errors preserve the service reason instead of becoming connection failures',async()=>{
 const a=app({},async()=>({ok:false,status:503,json:async()=>({error:'音频未完整覆盖当前窗口'})}));
 const reply=await a.send({target:'qwen-background',type:'relay-chunk',requestId:'short',chunk:{source:'clip',start:0,duration:20}});
 assert.equal(reply.error,'音频未完整覆盖当前窗口');
});

test('settings opens Qwen connection page without fetching or exposing credentials',async()=>{
 const a=app();let opened=0,saved;
 a.chrome.runtime.openOptionsPage=async()=>opened++;
 a.chrome.storage.local.set=async values=>saved=values;
 assert.equal((await a.send({type:'settings',courseId:'38146'})).ok,true);
 assert.equal(opened,1);assert.equal(saved.whisperCourseId,'38146');assert.equal(a.calls.length,0);
});
test('retired Whisper and ASR endpoints are not accepted',async()=>{
 const a=app();assert.equal(await a.send({target:'whisper-background',type:'health'}),null);
 assert.equal(await a.send({target:'voice-background',type:'asr',enabled:true}),null);
 assert.equal(a.calls.length,0);
});
