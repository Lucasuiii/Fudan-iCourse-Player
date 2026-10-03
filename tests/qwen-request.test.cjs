const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const source=fs.readFileSync(require.resolve('../content.js'),'utf8');
function app(hit){
 const calls=[],nodes={},chunk={source:'https://icourse.fudan.edu.cn/a.mp4?t=playing',start:0,duration:100};let closed=0;
 const sandbox={qwenRead:{source:null,url:null},crypto:require('node:crypto').webcrypto,DOMException,state:{loadToken:1,current:{id:'22'},currentCourseId:'11'},video:{currentTime:0},qwen:{completed:new Set()},$:key=>nodes[key]||(nodes[key]={}),qwenMedia:()=>{},core:{refreshVideo:async()=>assert.fail('valid playing URL should not be refreshed')},ctx:{},chrome:{runtime:{sendMessage:async m=>{calls.push(m);if(m.type==='cached-chunk')return{ok:true,result:hit?{cached:true}:null};if(m.type==='relay-chunk')return{ok:true,result:{cues:[]}};assert.fail('unexpected direct media request '+m.type);}}},QwenRange:{open:async options=>{assert.equal(options.url,chunk.source);assert.equal(options.source,chunk.source);return{id:'relay',close:async()=>closed++};}}};
 vm.runInNewContext(source.slice(source.indexOf('  async function qwenRequest('),source.indexOf('  async function exportCaptions(')),sandbox);
 return{sandbox,calls,chunk,run:()=>sandbox.qwenRequest(chunk,new AbortController().signal),closed:()=>closed};
}
test('cache hit bypasses all browser audio reads',async()=>{const a=app(true);assert.equal((await a.run()).cached,true);assert.deepEqual(a.calls.map(m=>m.type),['cached-chunk']);assert.equal(a.closed(),0);});
test('cache miss goes straight to browser relay using current playing URL and cleans up',async()=>{const a=app(false);await a.run();assert.deepEqual(a.calls.map(m=>m.type),['cached-chunk','relay-chunk']);assert.equal(a.closed(),1);});
test('following windows reuse refreshed transport URL while keeping original cache source',async()=>{
 const a=app(false),urls=[];let refreshes=0;
 a.sandbox.core.refreshVideo=async()=>{refreshes++;return a.chunk.source.replace('playing','fresh');};
 a.sandbox.QwenRange.open=async options=>{urls.push(options.url);assert.equal(options.source,a.chunk.source);if(urls.length===1)await options.refreshUrl(new AbortController().signal);return{id:'relay',close:async()=>{}};};
 await a.run();await a.run();assert.deepEqual(urls,[a.chunk.source,a.chunk.source.replace('playing','fresh')]);assert.equal(refreshes,1);
 assert.ok(a.calls.every(m=>m.chunk.source===a.chunk.source));
});
