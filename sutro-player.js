/* Native text tracks are the common caption state for Sutro and Lyue. */
(function(root){
  class SutroPlayer {
    constructor({video,theme,stage,container=stage,onCaptionChange,onSourceChange=()=>{},onSettings,onPause,Cue=root.VTTCue}){
      Object.assign(this,{video,theme,stage,container,onCaptionChange,Cue});this.tracks=new Map();this.cueLists=new Map();this.source='platform';this.enabled=true;this.top=false;
      video.textTracks.addEventListener('change',()=>{
        const showing=[...this.tracks].find(([,track])=>track.mode==='showing'&&track.cues?.length);
        if(showing&&showing[0]!==this.source){this.source=showing[0];this.enabled=true;onSourceChange(this.source);onCaptionChange(true);return;}
        const track=this.tracks.get(this.source);
        if(this.cueLists.get(this.source)?.length&&this.enabled!==(track.mode==='showing')){this.enabled=track.mode==='showing';onCaptionChange(this.enabled);}
      });
      // Record user intent before an asynchronous TextTrack change/new ASR window can race it.
      stage.addEventListener('mediatogglesubtitlesrequest',event=>{event.stopPropagation();this.select(this.source,!this.enabled);onCaptionChange(this.enabled);},true);
      stage.addEventListener('mediadisablesubtitlesrequest',()=>{this.enabled=false;onCaptionChange(false);},true);
      stage.addEventListener('mediashowsubtitlesrequest',()=>{this.enabled=true;onCaptionChange(true);},true);
      stage.addEventListener('mediapauserequest',onPause);
      // Chrome's isolated world has no CustomElementRegistry. UI configuration lives in MAIN.
      stage.addEventListener('icp-settings-request',()=>onSettings());

    }
    isPlaybackShortcut(event){
      if(event.altKey||event.ctrlKey||event.metaKey||event.isComposing)return false;
      if(![' ','spacebar','k'].includes(event.key.toLowerCase()))return false;
      const path=event.composedPath();
      // Keep typing and native menu/slider interactions intact, including inside shadow roots.
      if(path.some(node=>node.isContentEditable||node.matches?.('input,textarea,select,a,summary,[role=textbox],[role=combobox],[role=slider],[role=menu],[role=menuitem],[role=menuitemradio],[role=menuitemcheckbox]')))return false;
      // A focused Sutro button must not consume Space to repeat its last action (e.g. exit fullscreen).
      if(path.includes(this.theme)||path.includes(this.video))return true;
      return !path.some(node=>node.matches?.('button,[role=button]'));
    }
    track(source){
      if(!this.tracks.has(source)){
        const labels={platform:'平台字幕','qwen-cache':'Qwen 本地识别','whisper-live':'Whisper 流式'};
        const track=this.video.addTextTrack('subtitles',labels[source]||'本地字幕','zh');track.mode='disabled';this.tracks.set(source,track);this.cueLists.set(source,[]);
      }
      return this.tracks.get(source);
    }
    setCues(source,cues){
      const track=this.track(source);for(const cue of this.cueLists.get(source))track.removeCue(cue);
      const items=[];this.cueLists.set(source,items);
      for(const cue of cues){if(!cue.text||!Number.isFinite(cue.start)||!Number.isFinite(cue.end)||cue.end<=cue.start)continue;const item=new this.Cue(cue.start,cue.end,cue.text);item.line=this.top?0:-3;track.addCue(item);items.push(item);}
      this.select(this.source,this.enabled);
    }
    select(source,enabled){
      this.source=source;this.enabled=Boolean(enabled);
      for(const [name,track] of this.tracks)track.mode=name===source&&this.enabled?'showing':'disabled';
    }
    position(top){this.top=Boolean(top);for(const items of this.cueLists.values())for(const cue of items)cue.line=top?0:-3;}
    clear(){for(const [source,track] of this.tracks){track.mode='disabled';for(const cue of this.cueLists.get(source))track.removeCue(cue);this.cueLists.set(source,[]);}}
    async fullscreen(){if(root.document.fullscreenElement)await root.document.exitFullscreen();else await this.container.requestFullscreen();}
  }
  if(typeof module==='object')module.exports=SutroPlayer;else root.SutroPlayer=SutroPlayer;
})(globalThis);
