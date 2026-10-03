const {test}=require('node:test');const assert=require('node:assert/strict');const Export=require('../subtitle-export.js');
test('SRT and VTT retain media timestamps including hours, Chinese text and millisecond rollover',()=>{
 const cues=[{start:3599.9996,end:3602.5,text:'数值算法\nQR 分解'},{start:0,end:1.2,text:'第一句'}];
 const srt=Export.serialize(cues);
 assert.match(srt,/1\n00:00:00,000 --> 00:00:01,200\n第一句/);
 assert.match(srt,/2\n01:00:00,000 --> 01:00:02,500\n数值算法 QR 分解/);
 assert.ok(Export.serialize(cues,'vtt').startsWith('WEBVTT\n\n00:00:00.000'));
 assert.equal(Export.serialize([{start:NaN,end:1,text:'bad'},{start:2,end:1,text:'bad'}]),'');
});
test('partial exports and safe filenames cannot contain paths or control characters',()=>{
 assert.equal(Export.filename('课程/一','2026:09',true,'srt'),'课程_一-2026_09-部分字幕.srt');
 assert.throws(()=>Export.serialize([],'html'));
});
