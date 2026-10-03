/* Export only subtitle text and media timestamps; never media URLs or credentials. */
(function(root){
  function stamp(seconds,separator){
    const ms=Math.round(Math.max(0,seconds)*1000),h=Math.floor(ms/3600000),m=Math.floor(ms/60000)%60,s=Math.floor(ms/1000)%60;
    return [h,m,s].map(n=>String(n).padStart(2,'0')).join(':')+separator+String(ms%1000).padStart(3,'0');
  }
  function serialize(cues,format='srt'){
    if(!['srt','vtt'].includes(format))throw Error('不支持的字幕格式');
    const clean=cues.filter(c=>Number.isFinite(c.start)&&Number.isFinite(c.end)&&c.start>=0&&c.end>c.start&&String(c.text).trim()).sort((a,b)=>a.start-b.start);
    return (format==='vtt'?'WEBVTT\n\n':'')+clean.map((c,i)=>(format==='srt'?String(i+1)+'\n':'')+stamp(c.start,format==='srt'?',':'.')+' --> '+stamp(c.end,format==='srt'?',':'.')+'\n'+String(c.text).replace(/\r/g,'').replace(/\n+/g,' ').replace(/-->/g,'→').trim()+'\n\n').join('');
  }
  function filename(course,lecture,partial,format){return (course+'-'+lecture+(partial?'-部分字幕':'')).replace(/[\\/:*?"<>|\x00-\x1f]/g,'_').slice(0,160)+'.'+format;}
  const api={serialize,filename};if(typeof module==='object')module.exports=api;else root.SubtitleExport=api;
})(globalThis);
