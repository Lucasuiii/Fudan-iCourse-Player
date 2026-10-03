/* One media element and one control bar, including fullscreen. */
(function(root){
  function bind({video,mute,volume,speed,full,container,document}){
    const syncVolume=()=>{
      const silent=video.muted||video.volume===0;
      mute.textContent=silent?'取消静音':'静音';mute.setAttribute('aria-pressed',String(silent));
      volume.value=String(video.volume);
    };
    mute.addEventListener('click',()=>{video.muted=!(video.muted||video.volume===0);if(!video.muted&&video.volume===0)video.volume=0.5;syncVolume();});
    volume.addEventListener('input',()=>{video.volume=Number(volume.value);video.muted=video.volume===0;syncVolume();});
    video.addEventListener('volumechange',syncVolume);
    const syncSpeed=()=>{
      const value=String(video.playbackRate);
      if(!Array.from(speed.options).some(o=>o.value===value)){
        const option=document.createElement('option');option.value=value;option.textContent=value+'×';speed.append(option);
      }
      speed.value=value;
    };
    video.addEventListener('ratechange',syncSpeed);
    const syncFullscreen=()=>{
      const active=document.fullscreenElement===container;
      full.textContent=active?'退出全屏':'全屏';full.setAttribute('aria-pressed',String(active));
    };
    document.addEventListener('fullscreenchange',syncFullscreen);
    syncVolume();syncFullscreen();
    // Keep the saved speed selector until media is loaded and applies it.
  }
  if(typeof module==='object')module.exports={bind};else root.PlayerTransport={bind};
})(globalThis);
