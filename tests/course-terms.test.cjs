const {test}=require('node:test');const assert=require('node:assert/strict');
const terms=require('../course-terms.js');
test('every course uses empty context unless keywords were explicitly saved',()=>{
 assert.equal(terms.resolve('38146'),'');
 assert.equal(terms.resolve('38147'),'');assert.equal(terms.resolve(''),'');assert.equal(terms.resolve('not-a-course',{'not-a-course':'spoof'}),'');
});
test('saved terms are used exactly, scoped, bounded and never changed in storage',()=>{
 const saved={'38146':'老师习惯说 epsilon 伊普西龙','22':'另一门课程'};
 assert.equal(terms.resolve('38146',saved),saved['38146']);
 assert.equal(terms.resolve('22',saved),'另一门课程');assert.equal(saved['38146'],'老师习惯说 epsilon 伊普西龙');
 assert.equal(terms.resolve('38146',{'38146':'字'.repeat(800)}),'字'.repeat(800));
});
