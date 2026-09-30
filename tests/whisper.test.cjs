const {test}=require('node:test');
const assert=require('node:assert/strict');
require('../whisper-prefetch.js');
const {Prefetch}=globalThis.ICourseWhisper;
const result=(start)=>({start,end:start+20,cues:[{start,end:start+10,text:'正交矩阵'}]});
test('prepares playhead first, bounds ahead and reuses cached segments after seeking',async()=>{
 const requests=[],events=[]; const p=new Prefetch(async c=>{requests.push(c.start);return result(c.start);},e=>events.push(e));
 p.start('recording',200);p.focus(45);await p.pump();await p.pump();
 assert.deepEqual(requests,[40,60]);assert.equal(p.ready(45),true);assert.equal(p.ahead(45),35);
 p.focus(140);await p.pump();assert.equal(requests.at(-1),140);
 p.focus(45);await p.pump();assert.equal(requests.at(-1),80);assert.equal(p.cues().length,4);
 for(let i=0;i<8;i++)await p.pump();assert.ok(Math.max(...requests.filter(s=>s<140))<=120);
});
test('late completion after changing lectures cannot publish or contaminate the new cache',async()=>{
 let finish;const events=[];const p=new Prefetch(()=>new Promise(r=>finish=r),e=>events.push(e));
 p.start('old',200);p.focus(0);const task=p.pump();p.start('new',200);finish(result(0));await task;
 assert.equal(p.ready(0),false);assert.equal(events.filter(e=>e.type==='chunk').length,0);
});
test('seek while inference is running prioritizes the new location on the next job',async()=>{
 let finish;const calls=[];const p=new Prefetch(c=>{calls.push(c.start);return new Promise(r=>finish=r);},()=>{});
 p.start('recording',300);p.focus(0);const old=p.pump();p.focus(220);await p.pump();assert.deepEqual(calls,[0]);finish(result(0));await old;
 const next=p.pump();assert.deepEqual(calls,[0,220]);finish(result(220));await next;
});
test('failure stops prefetch with an explicit error, silence chunks still count as ready',async()=>{
 const events=[];const p=new Prefetch(async()=>{throw Error('连接密钥无效');},e=>events.push(e));p.start('r',30);p.focus(0);await p.pump();assert.equal(p.active,false);assert.match(events.at(-1).error,/密钥/);
 const q=new Prefetch(async()=>({start:20,end:25,cues:[]}),()=>{});q.start('r',25);q.focus(24);await q.pump();assert.equal(q.ready(24),true);assert.equal(q.ahead(24),1);
});
