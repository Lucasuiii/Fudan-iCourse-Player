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
    constructor({snapshot,request,onCues,onStatus,onProgress=()=>{},pause,resume}) {
      Object.assign(this,{snapshot,request,onCues,onStatus,onProgress,pause,resume});
      this.cache=new Map();this.completed=new Set();this.continuous=true;this.epoch=0;this.active=false;this.busy=false;this.waiting=false;this.dirty=false;
    }
    report(){
      const s=this.snapshot(),duration=Number.isFinite(s.duration)&&s.duration>0?s.duration:0;
      const windows=[...this.completed].filter(start=>start<duration).sort((a,b)=>a-b);
      this.onProgress({duration,total:Math.ceil(duration/20),completed:windows.length,windows,
        start:this.busy?this.requestStart:null,end:this.busy?Math.min(duration,this.requestStart+20):null,active:this.active});
    }
    start(){this.stop();this.active=true;this.timer=setInterval(()=>this.tick(),500);this.tick();}
    stop(){this.active=false;clearInterval(this.timer);this.epoch++;this.controller?.abort();this.controller=null;this.busy=false;this.release();this.report();}
    release(){if(this.waiting){this.waiting=false;const play=this.wasPlaying;this.wasPlaying=false;if(play)this.resume();}}
    setContinuous(enabled){
      this.continuous=Boolean(enabled);
      const s=this.snapshot();
      if(!this.continuous&&this.busy&&this.requestStart>s.time+100){this.epoch++;this.controller?.abort();this.busy=false;this.controller=null;}
      if(this.active)this.tick();
    }
    cancelResume(){this.wasPlaying=false;}
    reset(clear=false){this.epoch++;this.controller?.abort();this.controller=null;this.busy=false;if(clear){this.cache.clear();this.completed.clear();}this.release();if(this.active)this.tick();else this.report();}
    tick(){
      if(!this.active)return;
      const s=this.snapshot();
      if(!s.source||!Number.isFinite(s.duration)||s.duration<=0||!Number.isFinite(s.time)||s.time<0||s.time>s.duration||s.live){if(this.busy||this.waiting){this.epoch++;this.controller?.abort();this.busy=false;this.release();}this.report();return this.onStatus('Qwen 缓存仅支持已加载的录播',false);}
      if(s.rate<0.75||s.rate>2){if(this.busy||this.waiting){this.epoch++;this.controller?.abort();this.busy=false;this.release();}this.report();return this.onStatus('Qwen 缓存支持 0.75×–2×，请调整速度',false);}
      if(this.source!==s.source){this.source=s.source;this.cache.clear();this.completed.clear();}
      const start=Math.floor(Math.min(s.time,s.duration-0.001)/20)*20;
      if(this.busy&&!this.cache.has(start)&&this.requestStart!==start){this.epoch++;this.controller?.abort();this.busy=false;this.controller=null;}

      const current=this.cache.get(start);
      if(current){this.release();if(this.dirty){this.dirty=false;this.onCues(layout(this.cache.values()));}}
      if(this.busy)return;
      let target=start;
      while(this.cache.has(target)&&target+20<Math.min(s.duration,s.time+100))target+=20;
      // Keep the near playback horizon ready, then continue through the recording.
      if(this.cache.has(target)){
        if(!this.continuous){this.report();return this.onStatus('Qwen · 前方字幕已就绪',false);}
        target=start;
        while(target<s.duration&&this.completed.has(target))target+=20;
        if(target>=s.duration){target=0;while(target<s.duration&&this.completed.has(target))target+=20;}
        if(target>=s.duration){this.report();return this.onStatus('Qwen · 全课字幕已缓存 · '+this.completed.size+'/'+Math.ceil(s.duration/20),false);}
      }

      const epoch=this.epoch,source=s.source;
      if(!current&&!this.waiting){this.waiting=true;this.wasPlaying=!s.paused;if(this.wasPlaying)this.pause();}
      this.onStatus(!current?'Qwen · 正在准备当前位置字幕…':'Qwen · 缓存 '+this.completed.size+'/'+Math.ceil(s.duration/20)+' · '+Math.floor(target/60)+':'+String(target%60).padStart(2,'0'),this.waiting);
      this.busy=true;this.requestStart=target;const controller=new AbortController();this.controller=controller;this.report();
      this.request({source,start:target,duration:s.duration},controller.signal).then(result=>{
        if(!this.active||epoch!==this.epoch||source!==this.snapshot().source)return;
        if(!result||result.start!==target||!Array.isArray(result.cues))throw Error('Qwen 返回了无效字幕窗口');
        this.cache.set(target,result);this.completed.add(target);this.dirty=true;
        while(this.cache.size>180){const key=[...this.cache.keys()].filter(k=>k!==start).sort((a,b)=>Math.abs(b-start)-Math.abs(a-start))[0];this.cache.delete(key);}
      }).catch(error=>{
        if(epoch!==this.epoch||!this.active||error.name==='AbortError')return;
        this.active=false;clearInterval(this.timer);this.busy=false;this.release();this.report();this.onStatus(error.message,false);
      }).finally(()=>{if(epoch===this.epoch){this.busy=false;this.controller=null;if(this.active)this.tick();}});
    }
  }
  QwenCache.layout=layout;
  if(typeof module==='object')module.exports=QwenCache;else root.QwenCache=QwenCache;
})(globalThis);
