/* Rolling local Whisper windows. One inference at a time; playback never waits. */
(function(root) {
  'use strict';
  class WhisperStream {
    constructor(context, source, emit, courseId) {
      Object.assign(this, {context, source, emit, courseId, closed:false, busy:false, blocks:[], count:0, revision:0, segment:0});
      this.clock={epoch:0,time:0,paused:true,rate:1}; this.stamp=performance.now();
    }
    async start() {
      this.emit({type:'loading'});
      await this.request('health');
      await this.context.audioWorklet.addModule('pcm-worklet.js');
      if(this.closed)return;
      this.node=new AudioWorkletNode(this.context,'icourse-pcm');
      this.silent=this.context.createGain(); this.silent.gain.value=0;
      this.source.connect(this.node).connect(this.silent).connect(this.context.destination);
      this.node.port.onmessage=({data})=>this.accept(data);
      this.emit({type:'ready'});
    }
    async request(type, fields={}) {
      const reply=await chrome.runtime.sendMessage({target:'whisper-background',type,courseId:this.courseId,...fields});
      if(!reply?.ok)throw Error(reply?.error||'Whisper 服务没有响应');
      return reply.result;
    }
    setClock(clock) {
      if(!Number.isFinite(clock.time)||!Number.isInteger(clock.epoch)||!Number.isFinite(clock.rate))return;
      if(clock.epoch!==this.clock.epoch||clock.rate!==this.clock.rate){this.revision++;this.blocks=[];this.count=0;this.sentCount=0;this.silence=0;this.final=false;this.segment++;}
      this.clock=clock;this.stamp=performance.now();
    }
    accept({samples,sampleRate}) {
      if(this.closed||this.clock.paused||this.clock.rate<0.75||this.clock.rate>2)return;
      const n=Math.floor(samples.length*16000/sampleRate), pcm=new Int16Array(n);
      let energy=0;
      for(let i=0;i<n;i++){const x=samples[Math.min(samples.length-1,Math.floor(i*sampleRate/16000))];pcm[i]=Math.round(Math.max(-1,Math.min(1,x))*32767);energy+=x*x;}
      if(!this.count)this.startTime=Math.max(0,this.clock.time+((performance.now()-this.stamp)/1000-n/16000)*this.clock.rate);
      this.blocks.push(pcm);this.count+=n;
      this.silence=energy/Math.max(n,1)<0.000025?(this.silence||0)+n:0;
      this.final=this.count>=16000*Math.min(12,12/this.clock.rate)||this.silence>=11200;
      if(this.count>=32000&&(this.final||this.count-(this.sentCount||0)>=32000))void this.pump();
      if(this.count>256000)this.fail('Whisper 跟不上播放，已停止识别；视频继续播放。');
    }
    async pump() {
      if(this.busy||this.closed||this.count<32000)return;
      this.busy=true;
      const revision=this.revision, epoch=this.clock.epoch, segment=this.segment, start=this.startTime, final=this.final, rate=this.clock.rate;
      const count=final ? Math.min(this.count,Math.floor(16000*Math.min(12,12/rate))) : this.count;
      this.sentCount=count;
      const pcm=new Int16Array(count);let offset=0;
      for(const block of this.blocks){const n=Math.min(block.length,count-offset);if(n<=0)break;pcm.set(block.subarray(0,n),offset);offset+=n;}
      try {
        const result=await this.request('stream',{samples:Array.from(pcm)});
        if(this.closed||revision!==this.revision)return;
        const text=result.text.trim();
        if(text)this.emit({type:'text',epoch,segment,start,end:start+count/16000*rate,text,final});
        if(final){let consumed=count;const tail=[];for(const block of this.blocks){if(consumed>=block.length)consumed-=block.length;else {tail.push(block.slice(consumed));consumed=0;}}this.blocks=tail;this.count=tail.reduce((n,b)=>n+b.length,0);this.startTime=start+count/16000*rate;this.sentCount=0;this.silence=0;this.final=false;this.segment++;}
      }catch(error){if(!this.closed&&revision===this.revision)this.fail(error.message);}
      finally {this.busy=false;if(!this.closed&&this.count>=32000&&(this.final||this.count-(this.sentCount||0)>=32000))void this.pump();}
    }
    fail(error){this.close();this.emit({type:'error',error});}
    close(){if(this.closed)return;this.closed=true;this.revision++;if(this.node){this.node.port.onmessage=null;this.source.disconnect(this.node);this.node.disconnect();}this.silent?.disconnect();this.blocks=[];}
  }
  root.ICourseWhisperStream={WhisperStream};
})(globalThis);
