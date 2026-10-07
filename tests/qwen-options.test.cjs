const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const tick=()=>new Promise(r=>setImmediate(r));
async function settings(){
 const fields=Object.fromEntries(['key','course','prompt','save','status','engine'].map(id=>[id,{value:'',textContent:'',addEventListener(type,fn){this[type]=fn;}}]));
 fields.engine.value='qwen';
 const stored={whisperKey:'valid-private-key-1234567890',whisperCourseId:'11',whisperPrompts:{'22':'另一门课程'}};
 const chrome={storage:{local:{get:async keys=>typeof keys==='string'?{[keys]:stored[keys]}:{...stored},set:async values=>Object.assign(stored,values)}},runtime:{sendMessage:async()=>({ok:true,result:{model:'qwen3-asr-1.7b-bf16'}})}};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../options.js'),'utf8'),{ICourseTerms:require('../course-terms.js'),chrome,document:{querySelector:id=>fields[id.slice(1)]}});await tick();return{fields,stored};
}
test('optional glossary updates one course, preserves other courses and can be cleared',async()=>{
 const {fields,stored}=await settings();assert.equal(fields.prompt.value,'');
 fields.prompt.value='QR 分解';await fields.save.click();assert.equal(stored.whisperPrompts['11'],'QR 分解');assert.equal(stored.whisperPrompts['22'],'另一门课程');
 fields.prompt.value='';await fields.save.click();assert.equal(stored.whisperPrompts['11'],undefined);assert.equal(stored.whisperPrompts['22'],'另一门课程');assert.match(fields.status.textContent,/连接成功/);
});
test('a glossary without course ID cannot become a global preset',async()=>{
 const {fields,stored}=await settings();fields.course.value='';fields.prompt.value='专业术语';await fields.save.click();assert.match(fields.status.textContent,/课程 ID/);assert.equal(stored.whisperPrompts['11'],undefined);
 fields.prompt.value='';await fields.save.click();assert.match(fields.status.textContent,/连接成功/);
});

test('numerical course uses the same editable saved keywords as other courses',async()=>{
 const {fields,stored}=await settings();fields.course.value='38146';fields.course.input();assert.equal(fields.prompt.value,'');
 fields.prompt.value='伊普西龙';await fields.save.click();assert.equal(stored.whisperPrompts['38146'],'伊普西龙');fields.course.value='22';fields.course.input();assert.equal(fields.prompt.value,'另一门课程');
 fields.course.value='38146';fields.course.input();assert.equal(fields.prompt.value,'伊普西龙');
 fields.prompt.value='';await fields.save.click();assert.equal(stored.whisperPrompts['38146'],undefined);
});
