const {test}=require('node:test');const assert=require('node:assert/strict');
const terms=require('../course-terms.js');
test('numerical-analysis course receives Greek symbols and algorithm context only within its scope',()=>{
 const prompt=terms.resolve('38146');
 for(const word of ['α 阿尔法','β 贝塔','ε 艾普西龙','λ 拉姆达','σ 西格玛','条件数','增长因子','LU 分解','QR 分解'])assert.ok(prompt.includes(word));
 assert.equal(terms.resolve('38147'),'');assert.equal(terms.resolve(''),'');assert.equal(terms.resolve('not-a-course',{'not-a-course':'spoof'}),'');
 assert.ok(prompt.length<800);
});
test('custom terms remain first, scoped, bounded and never changed in storage',()=>{
 const saved={'38146':'老师习惯说 epsilon 伊普西龙','22':'另一门课程'};
 assert.ok(terms.resolve('38146',saved).startsWith(saved['38146']));assert.ok(terms.resolve('38146',saved).includes('条件数'));
 assert.equal(terms.resolve('22',saved),'另一门课程');assert.equal(saved['38146'],'老师习惯说 epsilon 伊普西龙');
 assert.equal(terms.resolve('38146',{'38146':'字'.repeat(800)}),'字'.repeat(800));
});
