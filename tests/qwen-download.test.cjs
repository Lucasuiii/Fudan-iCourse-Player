const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../content.js'),'utf8');
const fn=source.slice(source.indexOf('  async function downloadQwenMedia('),source.indexOf('  async function qwenRequest('));
function harness(abort=false,total=null){
 const calls=[],controller=new AbortController();const label={};let read=0,cancelled=false;
 const c={core:{api:async()=>({params:{}}),signVideo:()=> 'https://icourse.fudan.edu.cn/a.mp4?fresh'},ctx:{},fetch:async(_url,init)=>{assert.equal(init.credentials,'include');assert.equal(init.headers.Range,'bytes=0-');assert.equal(_url,'https://icourse.fudan.edu.cn/a.mp4?fresh');return {ok:true,headers:{get:()=>total},body:{cancel:async()=>{cancelled=true},getReader:()=>({read:async()=>read++?{done:true}:{done:false,value:new Uint8Array(300000).fill(1)},cancel:async()=>{cancelled=true}})}}},qwenMedia:async m=>{calls.push(m);if(abort&&m.action==='append')controller.abort();return m.action==='begin'?{id:'private-transfer'}:{}},$:()=>label,DOMException,btoa,Uint8Array};
 vm.createContext(c);vm.runInContext(fn+';globalThis.run=downloadQwenMedia;',c);
 return {run:()=>c.run('https://icourse.fudan.edu.cn/a.mp4',controller.signal),calls,cancelled:()=>cancelled};
}
test('browser download streams bounded chunks with cookies and finishes once',async()=>{
 const h=harness();await h.run();assert.deepEqual(h.calls.map(m=>m.action),['begin','append','append','finish']);assert.equal(h.calls[2].offset,262144);assert.ok(h.calls[1].data.length<700000);
});
test('cancellation removes partial download without publishing it',async()=>{
 const h=harness(true);await assert.rejects(h.run(),e=>e.name==='AbortError');assert.equal(h.calls.at(-1).action,'abort');assert.equal(h.cancelled(),true);assert.equal(h.calls.some(m=>m.action==='finish'),false);
});

test('oversize response is cancelled before any local transfer begins',async()=>{
 const h=harness(false,9*1024**3);await assert.rejects(h.run(),/8 GiB/);assert.equal(h.calls.length,0);assert.equal(h.cancelled(),true);
});
