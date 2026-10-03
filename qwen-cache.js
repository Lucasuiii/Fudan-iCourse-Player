/* Recording timestamps stay in media time; playback speed never changes ASR audio. */
(function(root){
  function layout(windows){
    const ordered=[...windows].sort((a,b)=>a.start-b.start),cues=[];
    const join=(a,b)=>a+(/[A-Za-z0-9]$/.test(a)&&/^[A-Za-z0-9]/.test(b)?' ':'')+b;
    const terminal=text=>/[。！？!?；;]$/.test(text);
    // Word ownership is already resolved by the service, so adjacent windows can be reflowed together.
    const words=ordered.flatMap(result=>Array.isArray(result.alignedWords)?result.alignedWords:(result.cues||[]));
    for(let i=0;i<words.length;i++){
      const w=words[i];
      if(!w.text||!Number.isFinite(w.start)||!Number.isFinite(w.end)||w.end<=w.start)continue;
      const prev=cues.at(-1),gap=prev?w.start-prev.end:0;
      const upcoming=words.slice(i,i+6).map(w=>w.text).join('');
      const split=prev&&(terminal(prev.text)||gap>0.6||
        (prev.text.length>=12&&(/[，,：:]$/.test(prev.text)||gap>0.35||/^(但是|所以|然后|不过|因此|接下来|另外|也就是说)/.test(upcoming)))||
        prev.text.length+w.text.length>36||w.end-prev.start>8);
      if(!prev||split)cues.push({...w});
      else{prev.text=join(prev.text,w.text);prev.end=Math.max(prev.end,w.end);}
    }
    const last=cues.at(-1),prev=cues.at(-2);
    if(prev&&last.text.length<6&&prev.text.length+last.text.length<=40&&last.end-prev.start<=9&&last.start-prev.end<=0.35&&!terminal(prev.text)){
      prev.text=join(prev.text,last.text);prev.end=last.end;cues.pop();
    }
    return cues;
  }
  class QwenCache {
    constructor({snapshot,request,onCues,onStatus,pause,resume}) {
      Object.assign(this,{snapshot,request,onCues,onStatus,pause,resume});
      this.cache=new Map();this.epoch=0;this.active=false;this.busy=false;this.waiting=false;this.dirty=false;
    }
    start(){this.stop();this.active=true;this.timer=setInterval(()=>this.tick(),500);this.tick();}
    stop(){this.active=false;clearInterval(this.timer);this.epoch++;this.controller?.abort();this.controller=null;this.busy=false;this.release();}
    release(){if(this.waiting){this.waiting=false;const play=this.wasPlaying;this.wasPlaying=false;if(play)this.resume();}}
    cancelResume(){this.wasPlaying=false;}
    reset(clear=false){this.epoch++;this.controller?.abort();this.controller=null;this.busy=false;if(clear)this.cache.clear();this.release();if(this.active)this.tick();}
    tick(){
      if(!this.active)return;
      const s=this.snapshot();
      if(!s.source||!Number.isFinite(s.duration)||s.duration<=0||!Number.isFinite(s.time)||s.time<0||s.time>=s.duration||s.live){if(this.busy||this.waiting){this.epoch++;this.controller?.abort();this.busy=false;this.release();}return this.onStatus('Qwen 缓存仅支持已加载的录播',false);}
      if(s.rate<0.75||s.rate>2){if(this.busy||this.waiting){this.epoch++;this.controller?.abort();this.busy=false;this.release();}return this.onStatus('Qwen 缓存支持 0.75×–2×，请调整速度',false);}
      const start=Math.floor(s.time/20)*20;
      const current=this.cache.get(start);
      if(current){this.release();if(this.dirty){this.dirty=false;this.onCues(layout(this.cache.values()));}}
      if(this.busy)return;
      let target=start;
      while(this.cache.has(target)&&target+20<Math.min(s.duration,s.time+100))target+=20;
      if(this.cache.has(target))return this.onStatus('Qwen · 已缓存前方字幕 · '+s.rate+'×',false);
      const epoch=this.epoch,source=s.source;
      if(!current&&!this.waiting){this.waiting=true;this.wasPlaying=!s.paused;if(this.wasPlaying)this.pause();}
      this.onStatus(!current?'Qwen · 正在准备当前位置字幕…':'Qwen · 正在缓存前方字幕…',this.waiting);
      this.busy=true;const controller=new AbortController();this.controller=controller;
      this.request({source,start:target,duration:s.duration},controller.signal).then(result=>{
        if(!this.active||epoch!==this.epoch||source!==this.snapshot().source)return;
        if(!result||result.start!==target||!Array.isArray(result.cues))throw Error('Qwen 返回了无效字幕窗口');
        this.cache.set(target,result);this.dirty=true;
        while(this.cache.size>180){const key=[...this.cache.keys()].find(k=>k!==start);this.cache.delete(key);}
      }).catch(error=>{
        if(epoch!==this.epoch||!this.active||error.name==='AbortError')return;
        this.active=false;clearInterval(this.timer);this.release();this.onStatus(error.message,false);
      }).finally(()=>{if(epoch===this.epoch){this.busy=false;this.controller=null;if(this.active)this.tick();}});
    }
  }
  QwenCache.layout=layout;
  if(typeof module==='object')module.exports=QwenCache;else root.QwenCache=QwenCache;
})(globalThis);
