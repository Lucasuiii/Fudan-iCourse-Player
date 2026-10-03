const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {webcrypto}=require('node:crypto');
function environment(){
 const requests=[],responses=new Map();
 class XHR {
  constructor(){this.readyState=0;this.status=0;this.responseURL='';this.headers={};}
  open(method,url){this.url=url;this.method=method;this.readyState=1;}
  setRequestHeader(k,v){this.headers[k]=v;}
  getAllResponseHeaders(){return '';}
  getResponseHeader(){return null;}
  abort(){this.aborted=true;}
  send(){requests.push(this);queueMicrotask(()=>{
   if(this.aborted)return;
   const body=responses.get(this.url);this.status=body===undefined?404:200;this.readyState=4;this.responseURL=this.url;
   this.responseText=typeof body==='string'?body:'';this.response=body;
   this.onreadystatechange?.();this.onload?.();
  });}
 }
 const scope={URL,AbortController,setTimeout,clearTimeout,setInterval,clearInterval,queueMicrotask,performance,TextDecoder,TextEncoder,Uint8Array,ArrayBuffer,crypto:webcrypto,XMLHttpRequest:XHR,CryptoJS:require('../vendor/crypto-js.js'),console};
 scope.self=scope;scope.globalThis=scope;
 for(const file of ['vendor/hls.min.js','core.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),scope);
 return {scope,c:scope.ICourseCore,Hls:scope.Hls,requests,responses};
}
function load(Loader,config,url,range){
 const loader=new Loader(config);
 return new Promise((resolve,reject)=>loader.load({url,responseType:'arraybuffer',...range},{...config.fragLoadPolicy.default,timeout:1000,maxRetry:0,retryDelay:0,maxRetryDelay:0,loadPolicy:config.fragLoadPolicy.default},{onSuccess:(response)=>{loader.destroy();resolve(response);},onError:e=>{loader.destroy();reject(Error(e.text));},onTimeout:()=>{loader.destroy();reject(Error('timeout'));}}));
}
test('actual startLive loads absolute variants, segments and AES keys through the WebVPN loader',async()=>{
 const a=environment(),origin='https://media.example.test:8443/live/';
 const master=origin+'master.m3u8?token=a%2Bb',variant=origin+'quality.m3u8?auth=x%2Fy';
 const absolute=origin+'absolute.ts?token=one',key=origin+'key.bin?k=abc';
 a.responses.set(a.c.vpnUrl(master),'#EXTM3U\n#EXT-X-STREAM-INF:BANDWIDTH=128000\n'+variant+'\n');
 a.responses.set(a.c.vpnUrl(variant),'#EXTM3U\n#EXT-X-TARGETDURATION:4\n#EXT-X-MEDIA-SEQUENCE:0\n#EXT-X-KEY:METHOD=AES-128,URI="'+key+'"\n#EXTINF:4,\nrelative.ts?token=two\n#EXTINF:4,\n'+absolute+'\n#EXT-X-ENDLIST\n');
 // Exercise the real startLive configuration and the bundled hls.js parser.
 class Hls extends a.Hls {static isSupported(){return true;}attachMedia(){}}
 const video={play:async()=>{}},elements=new Map();
 const state={loadToken:1,courseId:'11'},panel={hidden:false};
 Object.assign(a.scope,{Hls,core:a.c,ctx:{vpn:true},location:{hostname:'webvpn.fudan.edu.cn',href:a.c.vpnUrl('https://icourse.fudan.edu.cn/coursedetail?course_id=11')},state,panel,video,
  preferredSpeed:()=>1,resetVideo(){},renderList(){},updateCaptionButton(){},renderTranscript(){},status(message){a.status=message;},
  $:selector=>{if(!elements.has(selector))elements.set(selector,{value:'1'});return elements.get(selector);}});
 const content=fs.readFileSync(path.join(__dirname,'../content.js'),'utf8');
 vm.runInNewContext(content.slice(content.indexOf('  async function startLive('),content.indexOf('  function goLive()')),a.scope);
 let pendingTimer;
 const loaded=new Promise((resolve,reject)=>{
  pendingTimer=setTimeout(()=>reject(Error('HLS fixture timeout: '+a.status+' / '+a.requests.map(r=>r.url).join(', '))),2000);
  const original=Hls.prototype.loadSource;
  Hls.prototype.loadSource=function(url){this.on(Hls.Events.MANIFEST_PARSED,()=>this.startLoad());this.on(Hls.Events.LEVEL_LOADED,(_,data)=>resolve(data.details));this.on(Hls.Events.ERROR,(_,data)=>{if(data.fatal)reject(Error(data.details));});original.call(this,url);};
 });
 try{
  await a.scope.startLive(master);const details=await loaded;
  assert.equal(a.requests[0].url,a.c.vpnUrl(master));assert.equal(a.requests[1].url,a.c.vpnUrl(variant));
  const relative=new URL('relative.ts?token=two',a.c.vpnUrl(variant)).href;
  assert.equal(details.fragments[0].url,relative);assert.equal(details.fragments[1].url,absolute);
  for(const url of [relative,absolute,details.fragments[0].decryptdata.uri]){
   const expected=url===relative?url:a.c.vpnUrl(url);a.responses.set(expected,new ArrayBuffer(16));
   await load(state.hls.config.loader,state.hls.config,url,{rangeStart:2,rangeEnd:8});
   const request=a.requests.at(-1);assert.equal(request.url,expected);assert.equal(request.headers.Range,'bytes=2-7');
  }
  assert.equal(a.requests.at(-1).url,a.c.vpnUrl(key));
  assert.ok(a.requests.every(r=>new URL(r.url).hostname==='webvpn.fudan.edu.cn'));
 }finally{clearTimeout(pendingTimer);state.hls?.destroy();}
});
test('WebVPN conversion is idempotent; init fragments and existing proxy URLs retain port and query',async()=>{
 const a=environment();const config={...a.Hls.DefaultConfig,...a.c.hlsConfig(a.Hls,{vpn:true})};
 for(const raw of ['http://media.example.test:8080/init.mp4?x=a%2Fb','https://media.example.test/partial.m4s?token=c%2Bd']){
  const proxy=a.c.vpnUrl(raw);assert.equal(a.c.vpnUrl(proxy),proxy);a.responses.set(proxy,new ArrayBuffer(8));
  await load(config.loader,config,raw);await load(config.loader,config,proxy);
  assert.equal(a.requests.at(-1).url,proxy);assert.equal(new URL(proxy).search,new URL(raw).search);
 }
});
test('direct intranet retains the default HLS loader and original resource addresses',async()=>{
 const a=environment();const overrides=a.c.hlsConfig(a.Hls,{vpn:false});assert.equal(overrides.loader,undefined);
 const config={...a.Hls.DefaultConfig,...overrides},url='https://media.example.test:8443/seg.ts?token=a%2Bb';
 a.responses.set(url,new ArrayBuffer(16));await load(config.loader,config,url);assert.equal(a.requests[0].url,url);
});
test('the WebVPN loader retains built-in cancellation without late success callbacks',async()=>{
 const a=environment();const config={...a.Hls.DefaultConfig,...a.c.hlsConfig(a.Hls,{vpn:true})};
 const url='https://media.example.test/seg.ts';a.responses.set(a.c.vpnUrl(url),new ArrayBuffer(8));
 const loader=new config.loader(config);let completed=false;
 loader.load({url,responseType:'arraybuffer'},{timeout:1000,loadPolicy:config.fragLoadPolicy.default},{onSuccess(){completed=true;},onError(){completed=true;},onTimeout(){completed=true;}});
 loader.abort();await new Promise(r=>setImmediate(r));assert.equal(a.requests[0].aborted,true);assert.equal(completed,false);loader.destroy();
});
