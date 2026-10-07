/* Recording timestamps stay in media time; playback speed never changes ASR audio. */
(function(root){
  function layout(windows){
    const ordered=[...windows].sort((a,b)=>a.start-b.start),cues=[];
    const textOf=words=>{
      let text='',previous='';
      for(const w of words){const current=w.text;const space=/[A-Za-z0-9]$/.test(previous)&&/^[A-Za-z0-9]/.test(current)&&(previous.length>1||current.length>1)?' ':'';text+=space+current;previous=current;}
      return text;
    };
    const terminal=text=>/[。！？!?；;][”’」』）)"]*$/.test(text);
    const punctuation=text=>/^[，。！？、：；,.!?;:）)”’」』"]/.test(text);
    const words=ordered.flatMap(result=>Array.isArray(result.alignedWords)?result.alignedWords:(result.cues||[]))
      .filter(w=>w.text&&Number.isFinite(w.start)&&Number.isFinite(w.end)&&w.end>w.start).sort((a,b)=>a.start-b.start);
    let pending=[];
    const emit=count=>{const part=pending.slice(0,count);cues.push({start:part[0].start,end:Math.max(...part.map(w=>w.end)),text:textOf(part)});pending=pending.slice(count);};
    const naturalCut=()=>{
      let best;
      for(let i=1;i<pending.length;i++){
        const before=textOf(pending.slice(0,i)),after=textOf(pending.slice(i));
        if(before.length<8||after.length<6||punctuation(after))continue;
        const gap=pending[i].start-pending[i-1].end;
        let score=/[，,：:]$/.test(before)?60:gap>=0.18?35:0;
        if(!score&&/^(但是|所以|然后|不过|因此|接下来|另外|也就是说)/.test(after))score=25;
        if(score){score-=Math.abs(before.length-24)*0.4;if(!best||score>best.score)best={score,index:i};}
      }
      return best?best.index:pending.length;
    };
    // Reflow owned words across adjacent windows without changing recognition/cache identity.
    for(const w of words){
      if(pending.length&&!punctuation(w.text)){
        const text=textOf(pending),gap=w.start-Math.max(...pending.map(x=>x.end));
        if(terminal(text)||gap>0.6||(text.length>=12&&(/[，,：:]$/.test(text)||gap>0.35)))emit(pending.length);
        else if(textOf([...pending,w]).length>36||w.end-pending[0].start>8){
          emit(naturalCut());
          if(pending.length&&(textOf([...pending,w]).length>36||w.end-pending[0].start>8))emit(pending.length);
        }
      }
      pending.push(w);
    }
    if(pending.length)emit(pending.length);
    const last=cues.at(-1),prev=cues.at(-2);
    if(prev&&last.text.length<6&&prev.text.length+last.text.length<=40&&last.end-prev.start<=9&&last.start-prev.end<=0.35&&!terminal(prev.text)){
      prev.text=textOf([prev,last]);prev.end=Math.max(prev.end,last.end);cues.pop();
    }
    return cues;
  }

  const clock=seconds=>{const n=Math.max(0,Math.floor(seconds));return (n>=3600?Math.floor(n/3600)+':':'')+String(Math.floor(n/60)%60).padStart(n>=3600?2:1,'0')+':'+String(n%60).padStart(2,'0');};
  function failureReason(message){
    const raw=String(message||'未返回具体错误');
    if(/无法连接 Qwen 本地服务/.test(raw))return {reason:'无法连接本地服务 127.0.0.1:8768（尚不能确认是未启动、已退出还是连接被阻止）',action:'检查本地服务，再点击「识别与增强 → 重新载入」'};
    if(/课程音频连接失败/.test(raw))return {reason:'浏览器无法连接课程音频，具体网络原因未确认',action:'检查校园网/VPN和课程登录状态，再重新载入'};
    if(/密钥/.test(raw))return {reason:'本地服务连接密钥缺失或无效',action:'在「关键词与连接」检查密钥，再重新载入'};
    if(/HTTP (401|403)/.test(raw))return {reason:'课程服务器拒绝音频访问（'+raw.match(/HTTP (401|403)/)[0]+'）',action:'检查课程登录状态及校园网/VPN，再重新载入'};
    if(/未完整覆盖/.test(raw))return {reason:'解码音频短于请求窗口，未生成该窗口字幕；具体原因未确认',action:'点击「识别与增强 → 重新载入」重试'};
    if(/超时|超过 65 秒|timed out/.test(raw))return {reason:'请求超时，未取得完整窗口结果；具体原因未确认',action:'检查本地服务和校园网/VPN，再重新载入'};
    // Do not expose signed media URLs or infer a cause from an unclassified exception.
    if(/https?:\/\/|Bearer|token=|key=/i.test(raw))return {reason:'请求失败（具体原因未确认）',action:'检查本地服务和课程连接，再重新载入'};
    if(/Failed to fetch|NetworkError|fetch failed/i.test(raw))return {reason:'网络请求失败，尚不能确认是本地服务还是课程音频连接',action:'检查本地服务和校园网/VPN，再重新载入'};
    return {reason:raw,action:'点击「识别与增强 → 重新载入」重试'};
  }
  class QwenCache {
    constructor({snapshot,request,loadSaved,onCues,onStatus,onProgress=()=>{},pause,resume,waitLimitMs=5000}) {
      Object.assign(this,{snapshot,request,loadSaved,onCues,onStatus,onProgress,pause,resume});
      this.cache=new Map();this.completed=new Set();this.continuous=false;this.mode='watch';this.strength='standard';this.restUntil=0;this.refilling=true;this.epoch=0;this.active=false;this.busy=false;this.waiting=false;this.dirty=false;
      this.waitExpired=false;this.setWaitLimit(waitLimitMs);
    }
    statusInfo(){
      const s=this.snapshot(),valid=Number.isFinite(s.time)&&Number.isFinite(s.duration)&&s.duration>0;
      const currentStart=valid?Math.floor(Math.min(s.time,s.duration-0.001)/20)*20:null;
      const currentReady=currentStart!==null&&this.cache.has(currentStart);
      const current=currentReady?'当前位置字幕已缓存（停顿处可能无字幕）':'当前位置字幕未就绪';
      const window=this.failure?this.failure.start:this.busy?this.requestStart:null;
      const range=window===null?'':clock(window)+'–'+clock(Math.min(s.duration,window+20));
      const relation=window===currentStart?'当前窗口':window>currentStart?'后续窗口':'其他窗口';
      let detail;
      if(this.blocked)detail=this.blocked;
      else if(this.failure)detail=relation+' '+range+' 失败：'+this.failure.reason+'；缓存已停止，已有字幕保留。'+this.failure.action;
      else if(this.busy)detail=relation+' '+range+' · '+this.phase+(this.waitExpired&&!currentReady?'；等待已达上限，播放继续':'');
      else detail=this.active?(this.completed.size===Math.ceil(s.duration/20)?'全课字幕已缓存':s.paused?'已暂停，不追加识别任务':Date.now()<this.restUntil?'休息中 · '+Math.ceil((this.restUntil-Date.now())/1000)+' 秒后重新检查':'前方字幕已就绪，暂不识别'):'缓存已停止';
      const mode=this.continuous?'生成整课字幕':this.mode==='skip'?'跳看优先':'连续观看';
      return {text:'Qwen · '+mode+' · '+current+' · '+detail,currentReady,failed:Boolean(this.failure),phase:this.phase,window,range};
    }
    publishStatus(){
      const info=this.statusInfo();
      if(info.text===this.lastStatus&&this.waiting===this.lastWaiting)return;
      this.lastStatus=info.text;this.lastWaiting=this.waiting;this.onStatus(info.text,this.waiting,info);
    }
    setPhase(text){const prefix=this.requestKind==='sparse'?'稀疏预取 · ':this.requestKind==='whole'?'补齐全课 · ':'';this.phase=prefix+text;this.publishStatus();}
    report(){
      const s=this.snapshot(),duration=Number.isFinite(s.duration)&&s.duration>0?s.duration:0;
      const windows=[...this.completed].filter(start=>start<duration).sort((a,b)=>a-b);
      this.onProgress({duration,total:Math.ceil(duration/20),completed:windows.length,windows,
        start:this.busy?this.requestStart:null,end:this.busy?Math.min(duration,this.requestStart+20):null,active:this.active,wholeCourse:this.continuous});
    }
    start(){this.stop();this.failure=null;this.blocked=null;this.loadedSaved=false;this.waitExpired=false;this.restUntil=0;this.refilling=true;this.active=true;this.timer=setInterval(()=>this.tick(),500);this.tick();}
    stop(){this.continuous=false;this.active=false;clearInterval(this.timer);this.epoch++;this.controller?.abort();this.controller=null;this.busy=false;this.release();this.report();}
    release(){clearTimeout(this.waitTimer);this.waitTimer=null;if(this.waiting){this.waiting=false;const play=this.wasPlaying;this.wasPlaying=false;if(play)this.resume();}}
    setWaitLimit(ms){
      this.waitLimitMs=Number.isFinite(ms)?Math.max(0,Math.min(30000,ms)):5000;
      if(this.waiting)this.armWait();
    }
    armWait(){
      clearTimeout(this.waitTimer);
      const remaining=this.waitLimitMs-(Date.now()-this.waitStarted);
      if(remaining<=0)return this.expireWait();
      this.waitTimer=setTimeout(()=>this.expireWait(),remaining);
    }
    expireWait(){
      if(!this.active||!this.waiting)return;
      this.waitExpired=true;this.release();
      this.publishStatus();
    }
    setSchedule(mode,strength){
      this.mode=mode==='skip'?'skip':'watch';this.strength=strength==='low'?'low':'standard';this.restUntil=0;this.refilling=true;
      if(this.busy&&this.requestKind==='sparse'&&this.mode!=='skip'){this.epoch++;this.controller?.abort();this.busy=false;this.controller=null;}
      if(this.active)this.tick();
    }
    setContinuous(enabled){
      this.continuous=Boolean(enabled);this.restUntil=0;
      if(!this.continuous&&this.busy&&this.requestKind==='whole'){this.epoch++;this.controller?.abort();this.busy=false;this.controller=null;}
      if(this.active)this.tick();
    }
    nextTarget(s,start){
      if(s.paused&&(!this.waiting||!this.wasPlaying)&&!this.continuous)return null;
      if(!this.cache.has(start))return {target:start,kind:'current'};
      const horizon=Math.min(s.duration,s.time+60*s.rate),low=Math.min(s.duration,s.time+20*s.rate);
      let missing=null;
      for(let t=start;t<horizon;t+=20)if(!this.cache.has(t)){missing=t;break;}
      if(missing===null)this.refilling=false;
      else if(missing<low)this.refilling=true;
      if(!this.continuous&&Date.now()<this.restUntil)return null;
      if(missing!==null&&(this.refilling||this.continuous))return {target:missing,kind:'near'};
      if(this.continuous){
        for(let t=start;t<s.duration;t+=20)if(!this.completed.has(t))return {target:t,kind:'whole'};
        for(let t=0;t<start;t+=20)if(!this.completed.has(t))return {target:t,kind:'whole'};
      }else if(this.mode==='skip'&&missing===null){
        // Odd-numbered blocks first, then the even blocks; protected playback horizon is already ready.
        for(const parity of [0,20])for(let t=parity;t<s.duration;t+=40)if(!this.completed.has(t))return {target:t,kind:'sparse'};
      }
      return null;
    }
    cancelResume(){this.wasPlaying=false;}
    reset(clear=false){this.restUntil=0;this.refilling=true;if(clear){this.failure=null;this.loadedSaved=false;}this.epoch++;this.controller?.abort();this.controller=null;this.busy=false;if(clear){this.cache.clear();this.completed.clear();}this.release();this.waitExpired=false;if(this.active)this.tick();else this.report();}
    tick(){
      if(!this.active){if(this.failure)this.publishStatus();return;}
      const s=this.snapshot();
      if(!s.source||!Number.isFinite(s.duration)||s.duration<=0||!Number.isFinite(s.time)||s.time<0||s.time>s.duration||s.live){if(this.busy||this.waiting){this.epoch++;this.controller?.abort();this.busy=false;this.release();}this.blocked='未加载有效录播，无法准备字幕；请选择已加载的录播课次';this.report();return this.publishStatus();}
      if(s.rate<0.75||s.rate>2){if(this.busy||this.waiting){this.epoch++;this.controller?.abort();this.busy=false;this.release();}this.blocked='缓存暂停：当前倍速超出支持范围，请调整到 0.75×–2×';this.report();return this.publishStatus();}
      this.blocked=null;
      if(this.lastRate!==s.rate){this.refilling=true;this.lastRate=s.rate;}
      if(this.source!==s.source){this.release();this.waitExpired=false;this.source=s.source;this.loadedSaved=false;this.cache.clear();this.completed.clear();}
      const start=Math.floor(Math.min(s.time,s.duration-0.001)/20)*20;
      if(this.busy&&!this.cache.has(start)&&this.requestStart!==start){this.epoch++;this.controller?.abort();this.busy=false;this.controller=null;}

      if(this.loadSaved&&!this.loadedSaved&&!this.busy){
        const epoch=this.epoch,source=s.source,controller=new AbortController();
        this.controller=controller;this.busy=true;this.requestStart=start;this.requestKind='saved';this.phase='正在加载本机已保存的本课字幕';this.report();this.publishStatus();
        this.loadSaved({source,duration:s.duration},controller.signal).then(result=>{
          if(!this.active||epoch!==this.epoch||source!==this.snapshot().source)return;
          if(!Array.isArray(result?.windows))throw Error('本地字幕缓存返回无效');
          const windows=result.windows.filter(w=>Number.isInteger(w.start)&&w.start>=0&&w.start%20===0&&w.start<s.duration&&w.end===Math.min(s.duration,w.start+20)&&Array.isArray(w.cues));
          windows.sort((a,b)=>Math.abs(a.start-start)-Math.abs(b.start-start));
          this.completed=new Set(windows.map(w=>w.start));this.cache=new Map(windows.slice(0,180).map(w=>[w.start,w]));
          this.loadedSaved=true;this.dirty=true;
          this.onCues(layout(this.cache.values()));this.dirty=false;
        }).catch(error=>{
          if(epoch!==this.epoch||!this.active||error.name==='AbortError')return;
          this.failure={start,...failureReason(error.message)};this.active=false;clearInterval(this.timer);this.busy=false;this.release();this.report();this.publishStatus();
        }).finally(()=>{if(epoch===this.epoch){this.busy=false;this.controller=null;if(this.active)this.tick();}});
        return;
      }
      const current=this.cache.get(start);
      if(current){this.release();if(this.dirty){this.dirty=false;this.onCues(layout(this.cache.values()));}}
      if(this.busy){this.publishStatus();return;}
      const next=this.nextTarget(s,start);
      if(!next){this.report();return this.publishStatus();}
      const {target,kind}=next;

      const epoch=this.epoch,source=s.source;
      if(!current&&!this.waiting&&!this.waitExpired){
        if(this.waitLimitMs===0)this.waitExpired=true;
        else{this.waiting=true;this.waitStarted=Date.now();this.wasPlaying=!s.paused;if(this.wasPlaying)this.pause();this.armWait();}
      }
      this.busy=true;this.requestStart=target;this.requestKind=kind;this.phase=(kind==='sparse'?'稀疏预取':kind==='whole'?'补齐全课':'保障当前与前方字幕')+' · 查询本地字幕缓存';const controller=new AbortController();this.controller=controller;this.report();this.publishStatus();
      this.request({source,start:target,duration:s.duration},controller.signal).then(result=>{
        if(!this.active||epoch!==this.epoch||source!==this.snapshot().source)return;
        if(!result||result.start!==target||!Array.isArray(result.cues))throw Error('Qwen 返回了无效字幕窗口');
        this.cache.set(target,result);this.completed.add(target);this.dirty=true;
        if(!this.continuous&&!result.cached)this.restUntil=Date.now()+(kind==='sparse'?(this.strength==='low'?15000:8000):(this.strength==='low'?6000:3000));
        while(this.cache.size>180){const key=[...this.cache.keys()].filter(k=>k!==start).sort((a,b)=>Math.abs(b-start)-Math.abs(a-start))[0];this.cache.delete(key);}
      }).catch(error=>{
        if(epoch!==this.epoch||!this.active||error.name==='AbortError')return;
        this.failure={start:target,...failureReason(error.message)};this.active=false;clearInterval(this.timer);this.busy=false;this.release();this.report();this.publishStatus();
      }).finally(()=>{if(epoch===this.epoch){this.busy=false;this.controller=null;if(this.active)this.tick();}});
    }
  }
  QwenCache.layout=layout;
  if(typeof module==='object')module.exports=QwenCache;else root.QwenCache=QwenCache;
})(globalThis);
