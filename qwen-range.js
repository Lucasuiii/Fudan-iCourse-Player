/* Browser-authenticated MP4 range transport; never downloads a complete recording. */
(function(root){
  async function readRange(fetcher,url,start,end,signal,total){
    const response=await fetcher(url,{credentials:'include',headers:{Range:`bytes=${start}-${end}`},signal});
    const fail=async message=>{await response.body?.cancel();const error=Error(message);error.status=response.status;throw error;};
    if(response.status!==206)return fail(response.status===200?'课程服务器未支持分段读取，已停止整段下载':'浏览器分段读取失败：HTTP '+response.status);
    const match=/^bytes (\d+)-(\d+)\/(\d+)$/.exec(response.headers.get('content-range')||'');
    if(!match||Number(match[1])!==start||Number(match[2])!==end||(total&&Number(match[3])!==total))return fail('课程服务器返回的字节范围与请求不符');
    const size=end-start+1,reader=response.body.getReader();const bytes=new Uint8Array(size);let at=0;
    try{
      while(true){const r=await reader.read();if(r.done)break;if(at+r.value.length>size)throw Error('分段响应超过请求大小');bytes.set(r.value,at);at+=r.value.length;}
      if(at!==size)throw Error('课程音频分块未完整下载');
      return {bytes,total:Number(match[3])};
    }catch(e){await reader.cancel().catch(()=>{});throw e;}
  }
  async function open({fetcher=fetch,url,source,send,signal,onStatus=()=>{},onPhase=()=>{},refreshUrl}){
    const controller=new AbortController(),abort=()=>controller.abort();signal.addEventListener('abort',abort,{once:true});
    if(signal.aborted)controller.abort();let id,failure,task,used=0,refreshed=false;
    const read=async(start,end,total)=>{
      try{return await readRange(fetcher,url,start,end,controller.signal,total);}
      catch(error){
        if(controller.signal.aborted||![401,403].includes(error.status)||!refreshUrl||refreshed)throw error;
        refreshed=true;onStatus('Qwen · 正在刷新音频授权…');
        const fresh=await refreshUrl(controller.signal);
        if(controller.signal.aborted)throw new DOMException('已取消','AbortError');
        const before=new URL(url),after=new URL(fresh);
        if(before.origin!==after.origin||before.pathname!==after.pathname)throw Error('录播资源已变化，请重新选择课次');
        url=fresh;
        return readRange(fetcher,url,start,end,controller.signal,total);
      }
    };
    try{
      const first=await read(0,15);
      ({id}=await send({action:'begin',source,total:first.total}));
      if(controller.signal.aborted)throw new DOMException('已取消','AbortError');
      task=(async()=>{
        while(!controller.signal.aborted){
          const {job,phase}=await send({action:'poll',id});
          if(phase)onPhase(phase);
          if(!job){await new Promise(resolve=>{const t=setTimeout(done,80);function done(){clearTimeout(t);controller.signal.removeEventListener('abort',done);resolve();}controller.signal.addEventListener('abort',done,{once:true});if(controller.signal.aborted)done();});continue;}
          try{
            if(!Number.isSafeInteger(job.start)||!Number.isSafeInteger(job.end)||job.start<0||job.end<job.start||job.end-job.start>=262144||job.end>=first.total)throw Error('本地解码器请求了无效范围');
            if(used+job.end-job.start+1>32*1024**2)throw Error('当前窗口读取超过 32 MB，已停止；不下载完整视频');
            const {bytes}=await read(job.start,job.end,first.total);used+=bytes.length;
            let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));
            await send({action:'result',id,jobId:job.id,data:btoa(binary)});
            onStatus('Qwen · 正在读取当前窗口 · '+(used/1024**2).toFixed(1)+' MB');
          }catch(error){await send({action:'result',id,jobId:job.id,error:true}).catch(()=>{});throw error;}
        }
      })().catch(error=>{if(!controller.signal.aborted)failure=error;controller.abort();});
      return {id,get error(){return failure;},async close(){controller.abort();await send({action:'abort',id}).catch(()=>{});await task;signal.removeEventListener('abort',abort);}};
    }catch(error){controller.abort();if(id)await send({action:'abort',id}).catch(()=>{});signal.removeEventListener('abort',abort);throw error;}
  }
  const api={open,readRange};if(typeof module==='object')module.exports=api;else root.QwenRange=api;
})(globalThis);
