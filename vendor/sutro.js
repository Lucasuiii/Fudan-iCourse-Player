(()=>{var h={MEDIA_PLAY_REQUEST:"mediaplayrequest",MEDIA_PAUSE_REQUEST:"mediapauserequest",MEDIA_MUTE_REQUEST:"mediamuterequest",MEDIA_UNMUTE_REQUEST:"mediaunmuterequest",MEDIA_LOOP_REQUEST:"medialooprequest",MEDIA_VOLUME_REQUEST:"mediavolumerequest",MEDIA_SEEK_REQUEST:"mediaseekrequest",MEDIA_AIRPLAY_REQUEST:"mediaairplayrequest",MEDIA_ENTER_FULLSCREEN_REQUEST:"mediaenterfullscreenrequest",MEDIA_EXIT_FULLSCREEN_REQUEST:"mediaexitfullscreenrequest",MEDIA_PREVIEW_REQUEST:"mediapreviewrequest",MEDIA_ENTER_PIP_REQUEST:"mediaenterpiprequest",MEDIA_EXIT_PIP_REQUEST:"mediaexitpiprequest",MEDIA_ENTER_CAST_REQUEST:"mediaentercastrequest",MEDIA_EXIT_CAST_REQUEST:"mediaexitcastrequest",MEDIA_SHOW_TEXT_TRACKS_REQUEST:"mediashowtexttracksrequest",MEDIA_HIDE_TEXT_TRACKS_REQUEST:"mediahidetexttracksrequest",MEDIA_SHOW_SUBTITLES_REQUEST:"mediashowsubtitlesrequest",MEDIA_DISABLE_SUBTITLES_REQUEST:"mediadisablesubtitlesrequest",MEDIA_TOGGLE_SUBTITLES_REQUEST:"mediatogglesubtitlesrequest",MEDIA_PLAYBACK_RATE_REQUEST:"mediaplaybackraterequest",MEDIA_RENDITION_REQUEST:"mediarenditionrequest",MEDIA_AUDIO_TRACK_REQUEST:"mediaaudiotrackrequest",MEDIA_SEEK_TO_LIVE_REQUEST:"mediaseektoliverequest",REGISTER_MEDIA_STATE_RECEIVER:"registermediastatereceiver",UNREGISTER_MEDIA_STATE_RECEIVER:"unregistermediastatereceiver"},M={MEDIA_CHROME_ATTRIBUTES:"mediachromeattributes",MEDIA_CONTROLLER:"mediacontroller"},Bo={MEDIA_AIRPLAY_UNAVAILABLE:"mediaAirplayUnavailable",MEDIA_AUDIO_TRACK_ENABLED:"mediaAudioTrackEnabled",MEDIA_AUDIO_TRACK_LIST:"mediaAudioTrackList",MEDIA_AUDIO_TRACK_UNAVAILABLE:"mediaAudioTrackUnavailable",MEDIA_BUFFERED:"mediaBuffered",MEDIA_CAST_UNAVAILABLE:"mediaCastUnavailable",MEDIA_CHAPTERS_CUES:"mediaChaptersCues",MEDIA_CURRENT_TIME:"mediaCurrentTime",MEDIA_DURATION:"mediaDuration",MEDIA_ENDED:"mediaEnded",MEDIA_ERROR:"mediaError",MEDIA_ERROR_CODE:"mediaErrorCode",MEDIA_ERROR_MESSAGE:"mediaErrorMessage",MEDIA_FULLSCREEN_UNAVAILABLE:"mediaFullscreenUnavailable",MEDIA_HAS_PLAYED:"mediaHasPlayed",MEDIA_HEIGHT:"mediaHeight",MEDIA_IS_AIRPLAYING:"mediaIsAirplaying",MEDIA_IS_CASTING:"mediaIsCasting",MEDIA_IS_FULLSCREEN:"mediaIsFullscreen",MEDIA_IS_PIP:"mediaIsPip",MEDIA_LOADING:"mediaLoading",MEDIA_MUTED:"mediaMuted",MEDIA_LOOP:"mediaLoop",MEDIA_PAUSED:"mediaPaused",MEDIA_PIP_UNAVAILABLE:"mediaPipUnavailable",MEDIA_PLAYBACK_RATE:"mediaPlaybackRate",MEDIA_PREVIEW_CHAPTER:"mediaPreviewChapter",MEDIA_PREVIEW_COORDS:"mediaPreviewCoords",MEDIA_PREVIEW_IMAGE:"mediaPreviewImage",MEDIA_PREVIEW_TIME:"mediaPreviewTime",MEDIA_RENDITION_LIST:"mediaRenditionList",MEDIA_RENDITION_SELECTED:"mediaRenditionSelected",MEDIA_RENDITION_UNAVAILABLE:"mediaRenditionUnavailable",MEDIA_SEEKABLE:"mediaSeekable",MEDIA_STREAM_TYPE:"mediaStreamType",MEDIA_SUBTITLES_LIST:"mediaSubtitlesList",MEDIA_SUBTITLES_SHOWING:"mediaSubtitlesShowing",MEDIA_TARGET_LIVE_WINDOW:"mediaTargetLiveWindow",MEDIA_TIME_IS_LIVE:"mediaTimeIsLive",MEDIA_VOLUME:"mediaVolume",MEDIA_VOLUME_LEVEL:"mediaVolumeLevel",MEDIA_VOLUME_UNAVAILABLE:"mediaVolumeUnavailable",MEDIA_LANG:"mediaLang",MEDIA_WIDTH:"mediaWidth"},pd=Object.entries(Bo),o=pd.reduce((t,[e,i])=>(t[e]=i.toLowerCase(),t),{}),th={USER_INACTIVE_CHANGE:"userinactivechange",BREAKPOINTS_CHANGE:"breakpointchange",BREAKPOINTS_COMPUTED:"breakpointscomputed"},De=pd.reduce((t,[e,i])=>(t[e]=i.toLowerCase(),t),{...th}),gv=Object.entries(De).reduce((t,[e,i])=>{let a=o[e];return a&&(t[i]=a),t},{userinactivechange:"userinactive"}),vd=Object.entries(o).reduce((t,[e,i])=>{let a=De[e];return a&&(t[i]=a),t},{userinactive:"userinactivechange"}),oe={SUBTITLES:"subtitles",CAPTIONS:"captions",DESCRIPTIONS:"descriptions",CHAPTERS:"chapters",METADATA:"metadata"},pt={DISABLED:"disabled",HIDDEN:"hidden",SHOWING:"showing"};var kr={MOUSE:"mouse",PEN:"pen",TOUCH:"touch"},ne={UNAVAILABLE:"unavailable",UNSUPPORTED:"unsupported"},_e={LIVE:"live",ON_DEMAND:"on-demand",UNKNOWN:"unknown"};var fd={INLINE:"inline",FULLSCREEN:"fullscreen",PICTURE_IN_PICTURE:"picture-in-picture"};function Ed(t){return t?.map(ah).join(" ")}function gd(t){return t?.split(/\s+/).map(rh)}function ah(t){if(t){let{id:e,width:i,height:a}=t;return[e,i,a].filter(r=>r!=null).join(":")}}function rh(t){if(t){let[e,i,a]=t.split(":");return{id:e,width:+i,height:+a}}}function bd(t){return t?.map(sh).join(" ")}function _d(t){return t?.split(/\s+/).map(oh)}function sh(t){if(t){let{id:e,kind:i,language:a,label:r}=t;return[e,i,a,r].filter(s=>s!=null).join(":")}}function oh(t){if(t){let[e,i,a,r]=t.split(":");return{id:e,kind:i,language:a,label:r}}}function Ad(t){return t.replace(/[-_]([a-z])/g,(e,i)=>i.toUpperCase())}function di(t){return typeof t=="number"&&!Number.isNaN(t)&&Number.isFinite(t)}function yr(t){return typeof t!="string"?!1:!isNaN(t)&&!isNaN(parseFloat(t))}var Sr=t=>new Promise(e=>setTimeout(e,t));var Td={"Start airplay":"Start airplay","Stop airplay":"Stop airplay",Audio:"Audio",Captions:"Captions","Enable captions":"Enable captions","Disable captions":"Disable captions","Start casting":"Start casting","Stop casting":"Stop casting","Enter fullscreen mode":"Enter fullscreen mode","Exit fullscreen mode":"Exit fullscreen mode",Mute:"Mute",Unmute:"Unmute",Loop:"Loop","Enter picture in picture mode":"Enter picture in picture mode","Exit picture in picture mode":"Exit picture in picture mode",Play:"Play",Pause:"Pause","Playback rate":"Playback rate","Playback rate {playbackRate}":"Playback rate {playbackRate}",Quality:"Quality","Seek backward":"Seek backward","Seek forward":"Seek forward",Settings:"Settings",Auto:"Auto","audio player":"audio player","video player":"video player",volume:"volume",seek:"seek","closed captions":"closed captions","current playback rate":"current playback rate","playback time":"playback time","media loading":"media loading",settings:"settings","audio tracks":"audio tracks",quality:"quality",play:"play",pause:"pause",mute:"mute",unmute:"unmute","chapter: {chapterName}":"chapter: {chapterName}",live:"live",Off:"Off","start airplay":"start airplay","stop airplay":"stop airplay","start casting":"start casting","stop casting":"stop casting","enter fullscreen mode":"enter fullscreen mode","exit fullscreen mode":"exit fullscreen mode","enter picture in picture mode":"enter picture in picture mode","exit picture in picture mode":"exit picture in picture mode","seek to live":"seek to live","playing live":"playing live","seek back {seekOffset} seconds":"seek back {seekOffset} seconds","seek forward {seekOffset} seconds":"seek forward {seekOffset} seconds","Network Error":"Network Error","Decode Error":"Decode Error","Source Not Supported":"Source Not Supported","Encryption Error":"Encryption Error","A network error caused the media download to fail.":"A network error caused the media download to fail.","A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.":"A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.","An unsupported error occurred. The server or network failed, or your browser does not support this format.":"An unsupported error occurred. The server or network failed, or your browser does not support this format.","The media is encrypted and there are no keys to decrypt it.":"The media is encrypted and there are no keys to decrypt it.",hour:"hour",hours:"hours",minute:"minute",minutes:"minutes",second:"second",seconds:"seconds","{time} remaining":"{time} remaining","{currentTime} of {totalTime}":"{currentTime} of {totalTime}","video not loaded, unknown time.":"video not loaded, unknown time."};var kd,ui={en:Td},ci=((kd=globalThis.navigator)==null?void 0:kd.language)||"en",yd=t=>{ci=t},Sd=(t,e)=>{ui[t]=e},nh=t=>{var e,i,a;let[r]=ci.split("-");return((e=ui[ci])==null?void 0:e[t])||((i=ui[r])==null?void 0:i[t])||((a=ui.en)==null?void 0:a[t])||t},Id=()=>{let[t]=ci.split("-");return ui[ci]?ci:ui[t]?t:"en"},c=(t,e={})=>nh(t).replace(/\{(\w+)\}/g,(i,a)=>a in e?String(e[a]):`{${a}}`);var Md=[{singular:"hour",plural:"hours"},{singular:"minute",plural:"minutes"},{singular:"second",plural:"seconds"}],wd=(t,e)=>{let i=t===1?c(Md[e].singular):c(Md[e].plural);return`${t} ${i}`},Ot=t=>{if(!di(t))return"";let e=Math.abs(t),i=e!==t,a=new Date(0,0,0,0,0,e,0),s=[a.getHours(),a.getMinutes(),a.getSeconds()].map((n,d)=>n&&wd(n,d)).filter(n=>n).join(", ");return i?c("{time} remaining",{time:s}):e===0?wd(0,2):s};function Ae(t,e){let i=!1;t<0&&(i=!0,t=0-t),t=t<0?0:t;let a=Math.floor(t%60),r=Math.floor(t/60%60),s=Math.floor(t/3600),n=Math.floor(e/60%60),d=Math.floor(e/3600);return(isNaN(t)||t===1/0)&&(s=r=a="0"),s=s>0||d>0?s+":":"",r=((s||n>=10)&&r<10?"0"+r:r)+":",a=a<10?"0"+a:a,(i?"-":"")+s+r+a}var Sv=Object.freeze({length:0,start(t){let e=t>>>0;if(e>=this.length)throw new DOMException(`Failed to execute 'start' on 'TimeRanges': The index provided (${e}) is greater than or equal to the maximum bound (${this.length}).`);return 0},end(t){let e=t>>>0;if(e>=this.length)throw new DOMException(`Failed to execute 'end' on 'TimeRanges': The index provided (${e}) is greater than or equal to the maximum bound (${this.length}).`);return 0}});var Ir=class{addEventListener(){}removeEventListener(){}dispatchEvent(){return!0}},Mr=class extends Ir{},wr=class extends Mr{constructor(){super(...arguments),this.role=null}},Wo=class{observe(){}unobserve(){}disconnect(){}},Ld={createElement:function(){return new ma.HTMLElement},createElementNS:function(){return new ma.HTMLElement},addEventListener(){},removeEventListener(){},dispatchEvent(t){return!1}},ma={ResizeObserver:Wo,document:Ld,Node:Mr,Element:wr,HTMLElement:class extends wr{constructor(){super(...arguments),this.innerHTML=""}get content(){return new ma.DocumentFragment}},DocumentFragment:class extends Ir{},customElements:{get:function(){},define:function(){},whenDefined:function(){}},localStorage:{getItem(t){return null},setItem(t,e){},removeItem(t){}},CustomEvent:function(){},getComputedStyle:function(){},navigator:{languages:[],get userAgent(){return""}},matchMedia(t){return{matches:!1,media:t}},DOMParser:class{parseFromString(e,i){return{body:{textContent:e}}}}},Cd="global"in globalThis&&globalThis?.global===globalThis||typeof window>"u"||typeof window.customElements>"u",Dd=Object.keys(ma).every(t=>t in globalThis),l=Cd&&!Dd?ma:globalThis,N=Cd&&!Dd?Ld:globalThis.document;var Rd=new WeakMap,$o=t=>{let e=Rd.get(t);return e||Rd.set(t,e=new Set),e},xd=new l.ResizeObserver(t=>{for(let e of t)for(let i of $o(e.target))i(e)});function at(t,e){$o(t).add(e),xd.observe(t)}function rt(t,e){let i=$o(t);i.delete(e),i.size||xd.unobserve(t)}function $(t){let e={};for(let i of t)e[i.name]=i.value;return e}function B(t){var e;return(e=Lr(t))!=null?e:Re(t,"media-controller")}function Lr(t){var e;let{MEDIA_CONTROLLER:i}=M,a=t.getAttribute(i);if(a)return(e=Ut(t))==null?void 0:e.getElementById(a)}var Cr=(t,e,i=".value")=>{let a=t.querySelector(i);a&&(a.textContent=e)},dh=(t,e)=>{let i=`slot[name="${e}"]`,a=t.shadowRoot.querySelector(i);return a?a.children:[]},Dr=(t,e)=>dh(t,e)[0],ae=(t,e)=>!t||!e?!1:t?.contains(e)?!0:ae(t,e.getRootNode().host),Re=(t,e)=>{if(!t)return null;let i=t.closest(e);return i||Re(t.getRootNode().host,e)};function pa(t=document){var e;let i=t?.activeElement;return i?(e=pa(i.shadowRoot))!=null?e:i:null}function Ut(t){var e;let i=(e=t?.getRootNode)==null?void 0:e.call(t);return i instanceof ShadowRoot||i instanceof Document?i:null}function Rr(t,{depth:e=3,checkOpacity:i=!0,checkVisibilityCSS:a=!0}={}){if(t.checkVisibility)return t.checkVisibility({checkOpacity:i,checkVisibilityCSS:a});let r=t;for(;r&&e>0;){let s=getComputedStyle(r);if(i&&s.opacity==="0"||a&&s.visibility==="hidden"||s.display==="none")return!1;r=r.parentElement,e--}return!0}function Od(t,e,i,a){let r=a.x-i.x,s=a.y-i.y,n=r*r+s*s;if(n===0)return 0;let d=((t-i.x)*r+(e-i.y)*s)/n;return Math.max(0,Math.min(1,d))}function W(t,e){let i=uh(t,a=>a===e);return i||va(t,e)}function uh(t,e){var i,a;let r;for(r of(i=t.querySelectorAll("style:not([media])"))!=null?i:[]){let s;try{s=(a=r.sheet)==null?void 0:a.cssRules}catch{continue}for(let n of s??[])if(e(n.selectorText))return n}}function va(t,e){var i,a;let r=(i=t.querySelectorAll("style:not([media])"))!=null?i:[],s=r?.[r.length-1];if(!s?.sheet)return console.warn("Media Chrome: No style sheet found on style tag of",t),{style:{setProperty:()=>{},removeProperty:()=>"",getPropertyValue:()=>""}};let n=s?.sheet.insertRule(`${e}{}`,s.sheet.cssRules.length);return(a=s.sheet.cssRules)==null?void 0:a[n]}function L(t,e,i=Number.NaN){let a=t.getAttribute(e);return a!=null?+a:i}function R(t,e,i){let a=+i;if(i==null||Number.isNaN(a)){t.hasAttribute(e)&&t.removeAttribute(e);return}L(t,e,void 0)!==a&&t.setAttribute(e,`${a}`)}function A(t,e){return t.hasAttribute(e)}function T(t,e,i){if(i==null){t.hasAttribute(e)&&t.removeAttribute(e);return}A(t,e)!=i&&t.toggleAttribute(e,i)}function I(t,e,i=null){var a;return(a=t.getAttribute(e))!=null?a:i}function S(t,e,i){if(i==null){t.hasAttribute(e)&&t.removeAttribute(e);return}let a=`${i}`;I(t,e,void 0)!==a&&t.setAttribute(e,a)}var Ud=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Te=(t,e,i)=>(Ud(t,e,"read from private field"),i?i.call(t):e.get(t)),ch=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},xr=(t,e,i,a)=>(Ud(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),ee;function hh(t){return`
    <style>
      :host {
        display: var(--media-control-display, var(--media-gesture-receiver-display, inline-block));
        box-sizing: border-box;
      }
    </style>
  `}var hi=class extends l.HTMLElement{constructor(){if(super(),ch(this,ee,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=$(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[M.MEDIA_CONTROLLER,o.MEDIA_PAUSED]}attributeChangedCallback(e,i,a){var r,s,n,d,u;e===M.MEDIA_CONTROLLER&&(i&&((s=(r=Te(this,ee))==null?void 0:r.unassociateElement)==null||s.call(r,this),xr(this,ee,null)),a&&this.isConnected&&(xr(this,ee,(n=this.getRootNode())==null?void 0:n.getElementById(a)),(u=(d=Te(this,ee))==null?void 0:d.associateElement)==null||u.call(d,this)))}connectedCallback(){var e,i;this.tabIndex=-1,this.setAttribute("aria-hidden","true"),xr(this,ee,mh(this)),this.getAttribute(M.MEDIA_CONTROLLER)&&((i=(e=Te(this,ee))==null?void 0:e.associateElement)==null||i.call(e,this)),Te(this,ee)&&(Te(this,ee).addEventListener("pointerdown",this),Te(this,ee).addEventListener("click",this),Te(this,ee).hasAttribute("tabindex")||(Te(this,ee).tabIndex=0))}disconnectedCallback(){var e,i,a,r;this.getAttribute(M.MEDIA_CONTROLLER)&&((i=(e=Te(this,ee))==null?void 0:e.unassociateElement)==null||i.call(e,this)),(a=Te(this,ee))==null||a.removeEventListener("pointerdown",this),(r=Te(this,ee))==null||r.removeEventListener("click",this),xr(this,ee,null)}handleEvent(e){var i;let a=(i=e.composedPath())==null?void 0:i[0];if(["video","media-controller"].includes(a?.localName)){if(e.type==="pointerdown")this._pointerType=e.pointerType;else if(e.type==="click"){let{clientX:s,clientY:n}=e,{left:d,top:u,width:p,height:_}=this.getBoundingClientRect(),b=s-d,f=n-u;if(b<0||f<0||b>p||f>_||p===0&&_===0)return;let v=this._pointerType||"mouse";if(this._pointerType=void 0,v===kr.TOUCH){this.handleTap(e);return}else if(v===kr.MOUSE||v===kr.PEN){this.handleMouseClick(e);return}}}}get mediaPaused(){return A(this,o.MEDIA_PAUSED)}set mediaPaused(e){T(this,o.MEDIA_PAUSED,e)}handleTap(e){}handleMouseClick(e){let i=this.mediaPaused?h.MEDIA_PLAY_REQUEST:h.MEDIA_PAUSE_REQUEST;this.dispatchEvent(new l.CustomEvent(i,{composed:!0,bubbles:!0}))}};ee=new WeakMap;hi.shadowRootOptions={mode:"open"};hi.getTemplateHTML=hh;function mh(t){var e;let i=t.getAttribute(M.MEDIA_CONTROLLER);return i?(e=t.getRootNode())==null?void 0:e.getElementById(i):Re(t,"media-controller")}l.customElements.get("media-gesture-receiver")||l.customElements.define("media-gesture-receiver",hi);var Or=hi;var qo=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},q=(t,e,i)=>(qo(t,e,"read from private field"),i?i.call(t):e.get(t)),re=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},ke=(t,e,i,a)=>(qo(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),ye=(t,e,i)=>(qo(t,e,"access private method"),i),fa,Nr,mi,fi,vi,Vo,pi,Ur,Ko,Pd,Go,Nd,Ea,Hr,Fr,Yo,Ei,ga,vt,Pr,k={AUDIO:"audio",AUTOHIDE:"autohide",BREAKPOINTS:"breakpoints",GESTURES_DISABLED:"gesturesdisabled",KEYBOARD_CONTROL:"keyboardcontrol",NO_AUTOHIDE:"noautohide",USER_INACTIVE:"userinactive",AUTOHIDE_OVER_CONTROLS:"autohideovercontrols"};function ph(t){return`
    <style>
      
      :host([${o.MEDIA_IS_FULLSCREEN}]) ::slotted([slot=media]) {
        outline: none;
      }

      :host {
        box-sizing: border-box;
        position: relative;
        display: inline-block;
        line-height: 0;
        background-color: var(--media-background-color, #000);
        overflow: hidden;
      }

      :host(:not([${k.AUDIO}])) [part~=layer]:not([part~=media-layer]) {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        display: flex;
        flex-flow: column nowrap;
        align-items: start;
        pointer-events: none;
        background: none;
      }

      slot[name=media] {
        display: var(--media-slot-display, contents);
      }

      
      :host([${k.AUDIO}]) slot[name=media] {
        display: var(--media-slot-display, none);
      }

      
      :host([${k.AUDIO}]) [part~=layer][part~=gesture-layer] {
        height: 0;
        display: block;
      }

      
      :host(:not([${k.AUDIO}])[${k.GESTURES_DISABLED}]) ::slotted([slot=gestures-chrome]),
          :host(:not([${k.AUDIO}])[${k.GESTURES_DISABLED}]) media-gesture-receiver[slot=gestures-chrome] {
        display: none;
      }

      
      ::slotted(:not([slot=media]):not([slot=poster]):not(media-loading-indicator):not([role=dialog]):not([hidden])) {
        pointer-events: auto;
      }

      :host(:not([${k.AUDIO}])) *[part~=layer][part~=centered-layer] {
        align-items: center;
        justify-content: center;
      }

      :host(:not([${k.AUDIO}])) ::slotted(media-gesture-receiver[slot=gestures-chrome]),
      :host(:not([${k.AUDIO}])) media-gesture-receiver[slot=gestures-chrome] {
        align-self: stretch;
        flex-grow: 1;
      }

      slot[name=middle-chrome] {
        display: inline;
        flex-grow: 1;
        pointer-events: none;
        background: none;
      }

      
      ::slotted([slot=media]),
      ::slotted([slot=poster]) {
        width: 100%;
        height: 100%;
      }

      
      :host(:not([${k.AUDIO}])) .spacer {
        flex-grow: 1;
      }

      
      :host(:-webkit-full-screen) {
        
        width: 100% !important;
        height: 100% !important;
      }

      
      ::slotted(:not([slot=media]):not([slot=poster]):not([${k.NO_AUTOHIDE}]):not([hidden]):not([role=dialog])) {
        opacity: 1;
        transition: var(--media-control-transition-in, opacity 0.25s);
      }

      
      :host([${k.USER_INACTIVE}]:not([${o.MEDIA_PAUSED}]):not([${o.MEDIA_IS_AIRPLAYING}]):not([${o.MEDIA_IS_CASTING}]):not([${k.AUDIO}])) ::slotted(:not([slot=media]):not([slot=poster]):not([${k.NO_AUTOHIDE}]):not([role=dialog])) {
        opacity: 0;
        transition: var(--media-control-transition-out, opacity 1s);
      }

      :host([${k.USER_INACTIVE}]:not([${k.NO_AUTOHIDE}]):not([${o.MEDIA_PAUSED}]):not([${o.MEDIA_IS_CASTING}]):not([${k.AUDIO}])) ::slotted([slot=media]) {
        cursor: none;
      }

      :host([${k.USER_INACTIVE}][${k.AUTOHIDE_OVER_CONTROLS}]:not([${k.NO_AUTOHIDE}]):not([${o.MEDIA_PAUSED}]):not([${o.MEDIA_IS_CASTING}]):not([${k.AUDIO}])) * {
        --media-cursor: none;
        cursor: none;
      }


      ::slotted(media-control-bar)  {
        align-self: stretch;
      }

      
      :host(:not([${k.AUDIO}])[${o.MEDIA_HAS_PLAYED}]) slot[name=poster] {
        display: none;
      }

      ::slotted([role=dialog]) {
        width: 100%;
        height: 100%;
        align-self: center;
      }

      ::slotted([role=menu]) {
        align-self: end;
      }
    </style>

    <slot name="media" part="layer media-layer"></slot>
    <slot name="poster" part="layer poster-layer"></slot>
    <slot name="gestures-chrome" part="layer gesture-layer">
      <media-gesture-receiver slot="gestures-chrome">
        <template shadowrootmode="${Or.shadowRootOptions.mode}">
          ${Or.getTemplateHTML({})}
        </template>
      </media-gesture-receiver>
    </slot>
    <span part="layer vertical-layer">
      <slot name="top-chrome" part="top chrome"></slot>
      <slot name="middle-chrome" part="middle chrome"></slot>
      <slot name="centered-chrome" part="layer centered-layer center centered chrome"></slot>
      
      <slot part="bottom chrome"></slot>
    </span>
    <slot name="dialog" part="layer dialog-layer"></slot>
  `}var vh=Object.values(o),fh="sm:384 md:576 lg:768 xl:960";function Eh(t){Hd(t.target,t.contentRect.width)}function Hd(t,e){var i;if(!t.isConnected)return;let a=(i=t.getAttribute(k.BREAKPOINTS))!=null?i:fh,r=gh(a),s=bh(r,e),n=!1;if(Object.keys(r).forEach(d=>{if(s.includes(d)){t.hasAttribute(`breakpoint${d}`)||(t.setAttribute(`breakpoint${d}`,""),n=!0);return}t.hasAttribute(`breakpoint${d}`)&&(t.removeAttribute(`breakpoint${d}`),n=!0)}),n){let d=new CustomEvent(De.BREAKPOINTS_CHANGE,{detail:s});t.dispatchEvent(d)}t.breakpointsComputed||(t.breakpointsComputed=!0,t.dispatchEvent(new CustomEvent(De.BREAKPOINTS_COMPUTED,{bubbles:!0,composed:!0})))}function gh(t){let e=t.split(/\s+/);return Object.fromEntries(e.map(i=>i.split(":")))}function bh(t,e){return Object.keys(t).filter(i=>e>=parseInt(t[i]))}var Pt=class extends l.HTMLElement{constructor(){if(super(),re(this,Ko),re(this,Go),re(this,Ea),re(this,Fr),re(this,Ei),re(this,fa,void 0),re(this,Nr,0),re(this,mi,null),re(this,fi,null),re(this,vi,void 0),this.breakpointsComputed=!1,re(this,Vo,e=>{let i=this.media;for(let a of e){if(a.type!=="childList")continue;let r=a.removedNodes;for(let s of r){if(s.slot!="media"||a.target!=this)continue;let n=a.previousSibling&&a.previousSibling.previousElementSibling;if(!n||!i)this.mediaUnsetCallback(s);else{let d=n.slot!=="media";for(;(n=n.previousSibling)!==null;)n.slot=="media"&&(d=!1);d&&this.mediaUnsetCallback(s)}}if(i)for(let s of a.addedNodes)s===i&&this.handleMediaUpdated(i)}}),re(this,pi,!1),re(this,Ur,e=>{q(this,pi)||(setTimeout(()=>{Eh(e),ke(this,pi,!1)},0),ke(this,pi,!0))}),re(this,vt,void 0),re(this,Pr,()=>{if(!q(this,vt).assignedElements({flatten:!0}).length){q(this,mi)&&this.mediaUnsetCallback(q(this,mi));return}this.handleMediaUpdated(this.media)}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=$(this.attributes),i=this.constructor.getTemplateHTML(e);this.shadowRoot.setHTMLUnsafe?this.shadowRoot.setHTMLUnsafe(i):this.shadowRoot.innerHTML=i}ke(this,fa,new MutationObserver(q(this,Vo)))}static get observedAttributes(){return[k.AUTOHIDE,k.GESTURES_DISABLED].concat(vh).filter(e=>![o.MEDIA_RENDITION_LIST,o.MEDIA_AUDIO_TRACK_LIST,o.MEDIA_CHAPTERS_CUES,o.MEDIA_WIDTH,o.MEDIA_HEIGHT,o.MEDIA_ERROR,o.MEDIA_ERROR_MESSAGE].includes(e))}attributeChangedCallback(e,i,a){e.toLowerCase()==k.AUTOHIDE&&(this.autohide=a)}get media(){let e=this.querySelector(":scope > [slot=media]");return e?.nodeName=="SLOT"&&(e=e.assignedElements({flatten:!0})[0]),e}async handleMediaUpdated(e){e&&(ke(this,mi,e),e.localName.includes("-")&&await l.customElements.whenDefined(e.localName),this.mediaSetCallback(e))}connectedCallback(){var e;q(this,fa).observe(this,{childList:!0,subtree:!0}),at(this,q(this,Ur));let a=this.getAttribute(k.AUDIO)!=null?c("audio player"):c("video player");this.setAttribute("role","region"),this.setAttribute("aria-label",a),this.handleMediaUpdated(this.media),this.setAttribute(k.USER_INACTIVE,""),Hd(this,this.getBoundingClientRect().width);let r=this.querySelector(":scope > slot[slot=media]");r&&(ke(this,vt,r),q(this,vt).addEventListener("slotchange",q(this,Pr))),this.addEventListener("pointerdown",this),this.addEventListener("pointermove",this),this.addEventListener("pointerup",this),this.addEventListener("mouseleave",this),this.addEventListener("keyup",this),(e=l.window)==null||e.addEventListener("mouseup",this)}disconnectedCallback(){var e;rt(this,q(this,Ur)),clearTimeout(q(this,fi)),q(this,fa).disconnect(),this.media&&this.mediaUnsetCallback(this.media),(e=l.window)==null||e.removeEventListener("mouseup",this),this.removeEventListener("pointerdown",this),this.removeEventListener("pointermove",this),this.removeEventListener("pointerup",this),this.removeEventListener("mouseleave",this),this.removeEventListener("keyup",this),q(this,vt)&&(q(this,vt).removeEventListener("slotchange",q(this,Pr)),ke(this,vt,null)),ke(this,pi,!1)}mediaSetCallback(e){}mediaUnsetCallback(e){ke(this,mi,null)}handleEvent(e){switch(e.type){case"pointerdown":ke(this,Nr,e.timeStamp);break;case"pointermove":ye(this,Ko,Pd).call(this,e);break;case"pointerup":ye(this,Go,Nd).call(this,e);break;case"mouseleave":ye(this,Ea,Hr).call(this);break;case"mouseup":this.removeAttribute(k.KEYBOARD_CONTROL);break;case"keyup":ye(this,Ei,ga).call(this),this.setAttribute(k.KEYBOARD_CONTROL,"");break}}set autohide(e){let i=Number(e);ke(this,vi,isNaN(i)?0:i)}get autohide(){return(q(this,vi)===void 0?2:q(this,vi)).toString()}get breakpoints(){return I(this,k.BREAKPOINTS)}set breakpoints(e){S(this,k.BREAKPOINTS,e)}get audio(){return A(this,k.AUDIO)}set audio(e){T(this,k.AUDIO,e)}get gesturesDisabled(){return A(this,k.GESTURES_DISABLED)}set gesturesDisabled(e){T(this,k.GESTURES_DISABLED,e)}get keyboardControl(){return A(this,k.KEYBOARD_CONTROL)}set keyboardControl(e){T(this,k.KEYBOARD_CONTROL,e)}get noAutohide(){return A(this,k.NO_AUTOHIDE)}set noAutohide(e){T(this,k.NO_AUTOHIDE,e)}get autohideOverControls(){return A(this,k.AUTOHIDE_OVER_CONTROLS)}set autohideOverControls(e){T(this,k.AUTOHIDE_OVER_CONTROLS,e)}get userInteractive(){return A(this,k.USER_INACTIVE)}set userInteractive(e){T(this,k.USER_INACTIVE,e)}};fa=new WeakMap;Nr=new WeakMap;mi=new WeakMap;fi=new WeakMap;vi=new WeakMap;Vo=new WeakMap;pi=new WeakMap;Ur=new WeakMap;Ko=new WeakSet;Pd=function(t){if(t.pointerType!=="mouse"&&t.timeStamp-q(this,Nr)<250)return;ye(this,Fr,Yo).call(this),clearTimeout(q(this,fi));let e=this.hasAttribute(k.AUTOHIDE_OVER_CONTROLS);([this,this.media].includes(t.target)||e)&&ye(this,Ei,ga).call(this)};Go=new WeakSet;Nd=function(t){if(t.pointerType==="touch"){let e=!this.hasAttribute(k.USER_INACTIVE);[this,this.media].includes(t.target)&&e?ye(this,Ea,Hr).call(this):ye(this,Ei,ga).call(this)}else t.composedPath().some(e=>["media-play-button","media-fullscreen-button"].includes(e?.localName))&&ye(this,Ei,ga).call(this)};Ea=new WeakSet;Hr=function(){if(q(this,vi)<0||this.hasAttribute(k.USER_INACTIVE))return;this.setAttribute(k.USER_INACTIVE,"");let t=new l.CustomEvent(De.USER_INACTIVE_CHANGE,{composed:!0,bubbles:!0,detail:!0});this.dispatchEvent(t)};Fr=new WeakSet;Yo=function(){if(!this.hasAttribute(k.USER_INACTIVE))return;this.removeAttribute(k.USER_INACTIVE);let t=new l.CustomEvent(De.USER_INACTIVE_CHANGE,{composed:!0,bubbles:!0,detail:!1});this.dispatchEvent(t)};Ei=new WeakSet;ga=function(){ye(this,Fr,Yo).call(this),clearTimeout(q(this,fi));let t=parseInt(this.autohide);t<0||ke(this,fi,setTimeout(()=>{ye(this,Ea,Hr).call(this)},t*1e3))};vt=new WeakMap;Pr=new WeakMap;Pt.shadowRootOptions={mode:"open"};Pt.getTemplateHTML=ph;l.customElements.get("media-container")||l.customElements.define("media-container",Pt);var Fd=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},J=(t,e,i)=>(Fd(t,e,"read from private field"),i?i.call(t):e.get(t)),ba=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Br=(t,e,i,a)=>(Fd(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),gi,bi,Wr,Nt,st,ft,Et=class{constructor(e,i,{defaultValue:a}={defaultValue:void 0}){ba(this,st),ba(this,gi,void 0),ba(this,bi,void 0),ba(this,Wr,void 0),ba(this,Nt,new Set),Br(this,gi,e),Br(this,bi,i),Br(this,Wr,new Set(a))}[Symbol.iterator](){return J(this,st,ft).values()}get length(){return J(this,st,ft).size}get value(){var e;return(e=[...J(this,st,ft)].join(" "))!=null?e:""}set value(e){var i;e!==this.value&&(Br(this,Nt,new Set),this.add(...(i=e?.split(" "))!=null?i:[]))}toString(){return this.value}item(e){return[...J(this,st,ft)][e]}values(){return J(this,st,ft).values()}forEach(e,i){J(this,st,ft).forEach(e,i)}add(...e){var i,a;e.forEach(r=>J(this,Nt).add(r)),!(this.value===""&&!((i=J(this,gi))!=null&&i.hasAttribute(`${J(this,bi)}`)))&&((a=J(this,gi))==null||a.setAttribute(`${J(this,bi)}`,`${this.value}`))}remove(...e){var i;e.forEach(a=>J(this,Nt).delete(a)),(i=J(this,gi))==null||i.setAttribute(`${J(this,bi)}`,`${this.value}`)}contains(e){return J(this,st,ft).has(e)}toggle(e,i){return typeof i<"u"?i?(this.add(e),!0):(this.remove(e),!1):this.contains(e)?(this.remove(e),!1):(this.add(e),!0)}replace(e,i){return this.remove(e),this.add(i),e===i}};gi=new WeakMap;bi=new WeakMap;Wr=new WeakMap;Nt=new WeakMap;st=new WeakSet;ft=function(){return J(this,Nt).size?J(this,Nt):J(this,Wr)};var _h=(t="")=>t.split(/\s+/),Bd=(t="")=>{let[e,i,a]=t.split(":"),r=a?decodeURIComponent(a):void 0;return{kind:e==="cc"?oe.CAPTIONS:oe.SUBTITLES,language:i,label:r}},Ht=(t="",e={})=>_h(t).map(i=>{let a=Bd(i);return{...e,...a}}),zo=t=>t?Array.isArray(t)?t.map(e=>typeof e=="string"?Bd(e):e):typeof t=="string"?Ht(t):[t]:[],$r=({kind:t,label:e,language:i}={kind:"subtitles"})=>e?`${t==="captions"?"cc":"sb"}:${i}:${encodeURIComponent(e)}`:i,ot=(t=[])=>Array.prototype.map.call(t,$r).join(" "),Ah=(t,e)=>i=>i[t]===e,Wd=t=>{let e=Object.entries(t).map(([i,a])=>Ah(i,a));return i=>e.every(a=>a(i))},Ft=(t,e=[],i=[])=>{let a=zo(i).map(Wd),r=s=>a.some(n=>n(s));Array.from(e).filter(r).forEach(s=>{s.mode=t})},Bt=(t,e=()=>!0)=>{if(!t?.textTracks)return[];let i=typeof e=="function"?e:Wd(e);return Array.from(t.textTracks).filter(i)},Vr=t=>{var e;return!!((e=t.mediaSubtitlesShowing)!=null&&e.length)||t.hasAttribute(o.MEDIA_SUBTITLES_SHOWING)};var Vd=t=>{var e;let{media:i,fullscreenElement:a}=t;try{let r=a&&"requestFullscreen"in a?"requestFullscreen":a&&"webkitRequestFullScreen"in a?"webkitRequestFullScreen":void 0;if(r){let s=(e=a[r])==null?void 0:e.call(a);if(s instanceof Promise)return s.catch(()=>{})}else i?.webkitEnterFullscreen?i.webkitEnterFullscreen():i?.requestFullscreen&&i.requestFullscreen()}catch(r){console.error(r)}},$d="exitFullscreen"in N?"exitFullscreen":"webkitExitFullscreen"in N?"webkitExitFullscreen":"webkitCancelFullScreen"in N?"webkitCancelFullScreen":void 0,Kd=t=>{var e;let{documentElement:i}=t;if($d){let a=(e=i?.[$d])==null?void 0:e.call(i);if(a instanceof Promise)return a.catch(()=>{})}},_a="fullscreenElement"in N?"fullscreenElement":"webkitFullscreenElement"in N?"webkitFullscreenElement":void 0,Th=t=>{let{documentElement:e,media:i}=t,a=e?.[_a];return!a&&"webkitDisplayingFullscreen"in i&&"webkitPresentationMode"in i&&i.webkitDisplayingFullscreen&&i.webkitPresentationMode===fd.FULLSCREEN?i:a},Gd=t=>{var e;let{media:i,documentElement:a,fullscreenElement:r=i}=t;if(!i||!a)return!1;let s=Th(t);if(!s)return!1;if(s===r||s===i)return!0;if(s.localName.includes("-")){let n=s.shadowRoot;if(!(_a in n))return ae(s,r);for(;n?.[_a];){if(n[_a]===r)return!0;n=(e=n[_a])==null?void 0:e.shadowRoot}}return!1},kh="fullscreenEnabled"in N?"fullscreenEnabled":"webkitFullscreenEnabled"in N?"webkitFullscreenEnabled":void 0,qd=t=>{let{documentElement:e,media:i}=t;return!!e?.[kh]||i&&"webkitSupportsFullscreen"in i};var Kr,Qo=()=>{var t,e;return Kr||(Kr=(e=(t=N)==null?void 0:t.createElement)==null?void 0:e.call(t,"video"),Kr)},Yd=async(t=Qo())=>{if(!t)return!1;let e=t.volume;t.volume=e/2+.1;let i=new AbortController,a=await Promise.race([yh(t,i.signal),Sh(t,e)]);return i.abort(),a},yh=(t,e)=>new Promise(i=>{t.addEventListener("volumechange",()=>i(!0),{signal:e})}),Sh=async(t,e)=>{for(let i=0;i<10;i++){if(t.volume===e)return!1;await Sr(10)}return t.volume!==e},Ih=/.*Version\/.*Safari\/.*/.test(l.navigator.userAgent),Zo=(t=Qo())=>l.matchMedia("(display-mode: standalone)").matches&&Ih?!1:typeof t?.requestPictureInPicture=="function",Xo=(t=Qo())=>qd({documentElement:N,media:t}),zd=Xo(),Qd=Zo(),Zd=!!l.WebKitPlaybackTargetAvailabilityEvent,Xd=!!l.chrome;var _i=t=>Bt(t.media,e=>[oe.SUBTITLES,oe.CAPTIONS].includes(e.kind)).sort((e,i)=>e.kind>=i.kind?1:-1),Jo=t=>Bt(t.media,e=>e.mode===pt.SHOWING&&[oe.SUBTITLES,oe.CAPTIONS].includes(e.kind)),Gr=(t,e)=>{let i=_i(t),a=Jo(t),r=!!a.length;if(i.length){if(e===!1||r&&e!==!0)Ft(pt.DISABLED,i,a);else if(e===!0||!r&&e!==!1){let s=i[0],{options:n}=t;if(!n?.noSubtitlesLangPref){let _=l.localStorage.getItem("media-chrome-pref-subtitles-lang"),b=_?[_,...l.navigator.languages]:l.navigator.languages,f=i.filter(v=>b.some(y=>v.language.toLowerCase().startsWith(y.split("-")[0]))).sort((v,y)=>{let g=b.findIndex(w=>v.language.toLowerCase().startsWith(w.split("-")[0])),C=b.findIndex(w=>y.language.toLowerCase().startsWith(w.split("-")[0]));return g-C});f[0]&&(s=f[0])}let{language:d,label:u,kind:p}=s;Ft(pt.DISABLED,i,a),Ft(pt.SHOWING,i,[{language:d,label:u,kind:p}])}}},qr=(t,e)=>t===e?!0:t==null||e==null||typeof t!=typeof e?!1:typeof t=="number"&&Number.isNaN(t)&&Number.isNaN(e)?!0:typeof t!="object"?!1:Array.isArray(t)?Mh(t,e):Object.entries(t).every(([i,a])=>i in e&&qr(a,e[i])),Mh=(t,e)=>{let i=Array.isArray(t),a=Array.isArray(e);return i!==a?!1:i||a?t.length!==e.length?!1:t.every((r,s)=>qr(r,e[s])):!0};var wh=Object.values(_e),Yr,Lh=Yd().then(t=>(Yr=t,Yr)),Jd=async(...t)=>{await Promise.all(t.filter(e=>e).map(async e=>{if(!("localName"in e&&e instanceof l.HTMLElement))return;let i=e.localName;if(!i.includes("-"))return;let a=l.customElements.get(i);a&&e instanceof a||(await l.customElements.whenDefined(i),l.customElements.upgrade(e))}))},Ch=new l.DOMParser,Dh=t=>t&&(Ch.parseFromString(t,"text/html").body.textContent||t),Ai={mediaError:{get(t,e){let{media:i}=t;if(e?.type!=="playing")return i?.error},mediaEvents:["emptied","error","playing"]},mediaErrorCode:{get(t,e){var i;let{media:a}=t;if(e?.type!=="playing")return(i=a?.error)==null?void 0:i.code},mediaEvents:["emptied","error","playing"]},mediaErrorMessage:{get(t,e){var i,a;let{media:r}=t;if(e?.type!=="playing")return(a=(i=r?.error)==null?void 0:i.message)!=null?a:""},mediaEvents:["emptied","error","playing"]},mediaWidth:{get(t){var e;let{media:i}=t;return(e=i?.videoWidth)!=null?e:0},mediaEvents:["resize"]},mediaHeight:{get(t){var e;let{media:i}=t;return(e=i?.videoHeight)!=null?e:0},mediaEvents:["resize"]},mediaPaused:{get(t){var e;let{media:i}=t;return(e=i?.paused)!=null?e:!0},set(t,e){var i;let{media:a}=e;a&&(t?a.pause():(i=a.play())==null||i.catch(()=>{}))},mediaEvents:["play","playing","pause","emptied"]},mediaHasPlayed:{get(t,e){let{media:i}=t;return i?e?e.type==="playing":!i.paused:!1},mediaEvents:["playing","emptied"]},mediaEnded:{get(t){var e;let{media:i}=t;return(e=i?.ended)!=null?e:!1},mediaEvents:["seeked","ended","emptied"]},mediaPlaybackRate:{get(t){var e;let{media:i}=t;return(e=i?.playbackRate)!=null?e:1},set(t,e){let{media:i}=e;i&&Number.isFinite(+t)&&(i.playbackRate=+t)},mediaEvents:["ratechange","loadstart"]},mediaMuted:{get(t){var e;let{media:i}=t;return(e=i?.muted)!=null?e:!1},set(t,e){let{media:i,options:{noMutedPref:a}={}}=e;if(i){i.muted=t;try{let r=l.localStorage.getItem("media-chrome-pref-muted")!==null,s=i.hasAttribute("muted");if(a){r&&l.localStorage.removeItem("media-chrome-pref-muted");return}if(s&&!r)return;l.localStorage.setItem("media-chrome-pref-muted",t?"true":"false")}catch(r){console.debug("Error setting muted pref",r)}}},mediaEvents:["volumechange"],stateOwnersUpdateHandlers:[(t,e)=>{let{options:{noMutedPref:i}}=e,{media:a}=e;if(!(!a||a.muted||i))try{let r=l.localStorage.getItem("media-chrome-pref-muted")==="true";Ai.mediaMuted.set(r,e),t(r)}catch(r){console.debug("Error getting muted pref",r)}}]},mediaLoop:{get(t){let{media:e}=t;return e?.loop},set(t,e){let{media:i}=e;i&&(i.loop=t)},mediaEvents:["medialooprequest"]},mediaVolume:{get(t){var e;let{media:i}=t;return(e=i?.volume)!=null?e:1},set(t,e){let{media:i,options:{noVolumePref:a}={}}=e;if(i){try{t==null?l.localStorage.removeItem("media-chrome-pref-volume"):!i.hasAttribute("muted")&&!a&&l.localStorage.setItem("media-chrome-pref-volume",t.toString())}catch(r){console.debug("Error setting volume pref",r)}Number.isFinite(+t)&&(i.volume=+t)}},mediaEvents:["volumechange"],stateOwnersUpdateHandlers:[(t,e)=>{let{options:{noVolumePref:i}}=e;if(!i)try{let{media:a}=e;if(!a)return;let r=l.localStorage.getItem("media-chrome-pref-volume");if(r==null)return;Ai.mediaVolume.set(+r,e),t(+r)}catch(a){console.debug("Error getting volume pref",a)}}]},mediaVolumeLevel:{get(t){let{media:e}=t;return typeof e?.volume>"u"?"high":e.muted||e.volume===0?"off":e.volume<.5?"low":e.volume<.75?"medium":"high"},mediaEvents:["volumechange"]},mediaCurrentTime:{get(t){var e;let{media:i}=t;return(e=i?.currentTime)!=null?e:0},set(t,e){let{media:i}=e;!i||!di(t)||(i.currentTime=t)},mediaEvents:["timeupdate","loadedmetadata","seeking"]},mediaDuration:{get(t){let{media:e,options:{defaultDuration:i}={}}=t;return i&&(!e||!e.duration||Number.isNaN(e.duration)||!Number.isFinite(e.duration))?i:Number.isFinite(e?.duration)?e.duration:Number.NaN},mediaEvents:["durationchange","loadedmetadata","emptied"]},mediaLoading:{get(t){let{media:e}=t;return e?.readyState<3},mediaEvents:["waiting","playing","emptied"]},mediaSeekable:{get(t){var e;let{media:i}=t;if(!((e=i?.seekable)!=null&&e.length))return;let a=i.seekable.start(0),r=i.seekable.end(i.seekable.length-1);if(!(!a&&!r))return[Number(a.toFixed(3)),Number(r.toFixed(3))]},mediaEvents:["loadedmetadata","emptied","progress","seekablechange"]},mediaBuffered:{get(t){var e;let{media:i}=t,a=(e=i?.buffered)!=null?e:[];return Array.from(a).map((r,s)=>[Number(a.start(s).toFixed(3)),Number(a.end(s).toFixed(3))])},mediaEvents:["progress","emptied"]},mediaStreamType:{get(t){let{media:e,options:{defaultStreamType:i}={}}=t,a=[_e.LIVE,_e.ON_DEMAND].includes(i)?i:void 0;if(!e)return a;let{streamType:r}=e;if(wh.includes(r))return r===_e.UNKNOWN?a:r;let s=e.duration;return s===1/0?_e.LIVE:Number.isFinite(s)?_e.ON_DEMAND:a},mediaEvents:["emptied","durationchange","loadedmetadata","streamtypechange"]},mediaTargetLiveWindow:{get(t){let{media:e}=t;if(!e)return Number.NaN;let{targetLiveWindow:i}=e,a=Ai.mediaStreamType.get(t);return(i==null||Number.isNaN(i))&&a===_e.LIVE?0:i},mediaEvents:["emptied","durationchange","loadedmetadata","streamtypechange","targetlivewindowchange"]},mediaTimeIsLive:{get(t){let{media:e,options:{liveEdgeOffset:i=10}={}}=t;if(!e)return!1;if(typeof e.liveEdgeStart=="number")return Number.isNaN(e.liveEdgeStart)?!1:e.currentTime>=e.liveEdgeStart;if(!(Ai.mediaStreamType.get(t)===_e.LIVE))return!1;let r=e.seekable;if(!r)return!0;if(!r.length)return!1;let s=r.end(r.length-1)-i;return e.currentTime>=s},mediaEvents:["playing","timeupdate","progress","waiting","emptied"]},mediaSubtitlesList:{get(t){return _i(t).map(({kind:e,label:i,language:a})=>({kind:e,label:i,language:a}))},mediaEvents:["loadstart"],textTracksEvents:["addtrack","removetrack"]},mediaSubtitlesShowing:{get(t){return Jo(t).map(({kind:e,label:i,language:a})=>({kind:e,label:i,language:a}))},mediaEvents:["loadstart"],textTracksEvents:["addtrack","removetrack","change"],stateOwnersUpdateHandlers:[(t,e)=>{var i,a;let{media:r,options:s}=e;if(!r)return;let n=d=>{var u;!s.defaultSubtitles||d&&![oe.CAPTIONS,oe.SUBTITLES].includes((u=d?.track)==null?void 0:u.kind)||Gr(e,!0)};return r.addEventListener("loadstart",n),(i=r.textTracks)==null||i.addEventListener("addtrack",n),(a=r.textTracks)==null||a.addEventListener("removetrack",n),()=>{var d,u;r.removeEventListener("loadstart",n),(d=r.textTracks)==null||d.removeEventListener("addtrack",n),(u=r.textTracks)==null||u.removeEventListener("removetrack",n)}}]},mediaChaptersCues:{get(t){var e;let{media:i}=t;if(!i)return[];let[a]=Bt(i,{kind:oe.CHAPTERS});return Array.from((e=a?.cues)!=null?e:[]).map(({text:r,startTime:s,endTime:n})=>({text:Dh(r),startTime:s,endTime:n}))},mediaEvents:["loadstart","loadedmetadata"],textTracksEvents:["addtrack","removetrack","change"],stateOwnersUpdateHandlers:[(t,e)=>{var i;let{media:a}=e;if(!a)return;let r=a.querySelector('track[kind="chapters"][default][src]'),s=(i=a.shadowRoot)==null?void 0:i.querySelector(':is(video,audio) > track[kind="chapters"][default][src]');return r?.addEventListener("load",t),s?.addEventListener("load",t),()=>{r?.removeEventListener("load",t),s?.removeEventListener("load",t)}}]},mediaIsPip:{get(t){var e,i;let{media:a,documentElement:r}=t;if(!a||!r||!r.pictureInPictureElement)return!1;if(r.pictureInPictureElement===a)return!0;if(r.pictureInPictureElement instanceof HTMLMediaElement)return(e=a.localName)!=null&&e.includes("-")?ae(a,r.pictureInPictureElement):!1;if(r.pictureInPictureElement.localName.includes("-")){let s=r.pictureInPictureElement.shadowRoot;for(;s?.pictureInPictureElement;){if(s.pictureInPictureElement===a)return!0;s=(i=s.pictureInPictureElement)==null?void 0:i.shadowRoot}}return!1},set(t,e){let{media:i}=e;if(i)if(t){if(!N.pictureInPictureEnabled){console.warn("MediaChrome: Picture-in-picture is not enabled");return}if(!i.requestPictureInPicture){console.warn("MediaChrome: The current media does not support picture-in-picture");return}let a=()=>{console.warn("MediaChrome: The media is not ready for picture-in-picture. It must have a readyState > 0.")};i.requestPictureInPicture().catch(r=>{if(r.code===11){if(!i.src){console.warn("MediaChrome: The media is not ready for picture-in-picture. It must have a src set.");return}if(i.readyState===0&&i.preload==="none"){let s=()=>{i.removeEventListener("loadedmetadata",n),i.preload="none"},n=()=>{i.requestPictureInPicture().catch(a),s()};i.addEventListener("loadedmetadata",n),i.preload="metadata",setTimeout(()=>{i.readyState===0&&a(),s()},1e3)}else throw r}else throw r})}else N.pictureInPictureElement&&N.exitPictureInPicture()},mediaEvents:["enterpictureinpicture","leavepictureinpicture"]},mediaRenditionList:{get(t){var e;let{media:i}=t;return[...(e=i?.videoRenditions)!=null?e:[]].map(a=>({...a}))},mediaEvents:["emptied","loadstart"],videoRenditionsEvents:["addrendition","removerendition"]},mediaRenditionSelected:{get(t){var e,i,a;let{media:r}=t;return(a=(i=r?.videoRenditions)==null?void 0:i[(e=r.videoRenditions)==null?void 0:e.selectedIndex])==null?void 0:a.id},set(t,e){let{media:i}=e;if(!i?.videoRenditions){console.warn("MediaController: Rendition selection not supported by this media.");return}let a=t,r=Array.prototype.findIndex.call(i.videoRenditions,s=>s.id==a);i.videoRenditions.selectedIndex!=r&&(i.videoRenditions.selectedIndex=r)},mediaEvents:["emptied"],videoRenditionsEvents:["addrendition","removerendition","change"]},mediaAudioTrackList:{get(t){var e;let{media:i}=t;return[...(e=i?.audioTracks)!=null?e:[]]},mediaEvents:["emptied","loadstart"],audioTracksEvents:["addtrack","removetrack"]},mediaAudioTrackEnabled:{get(t){var e,i;let{media:a}=t;return(i=[...(e=a?.audioTracks)!=null?e:[]].find(r=>r.enabled))==null?void 0:i.id},set(t,e){let{media:i}=e;if(!i?.audioTracks){console.warn("MediaChrome: Audio track selection not supported by this media.");return}let a=t;for(let r of i.audioTracks)r.enabled=a==r.id},mediaEvents:["emptied"],audioTracksEvents:["addtrack","removetrack","change"]},mediaIsFullscreen:{get(t){return Gd(t)},set(t,e,i){var a,r;t?(Vd(e),i.detail&&!((a=e.media)!=null&&a.inert)&&((r=e.media)==null||r.focus())):Kd(e)},rootEvents:["fullscreenchange","webkitfullscreenchange"],mediaEvents:["webkitbeginfullscreen","webkitendfullscreen","webkitpresentationmodechanged"]},mediaIsCasting:{get(t){var e;let{media:i}=t;return!i?.remote||((e=i.remote)==null?void 0:e.state)==="disconnected"?!1:i.remote.state==="connected"},set(t,e){var i,a;let{media:r}=e;if(r&&!(t&&((i=r.remote)==null?void 0:i.state)!=="disconnected")&&!(!t&&((a=r.remote)==null?void 0:a.state)!=="connected")){if(typeof r.remote.prompt!="function"){console.warn("MediaChrome: Casting is not supported in this environment");return}r.remote.prompt().catch(()=>{})}},remoteEvents:["connect","connecting","disconnect"]},mediaIsAirplaying:{get(){return!1},set(t,e){let{media:i}=e;if(i){if(!(i.webkitShowPlaybackTargetPicker&&l.WebKitPlaybackTargetAvailabilityEvent)){console.error("MediaChrome: received a request to select AirPlay but AirPlay is not supported in this environment");return}i.webkitShowPlaybackTargetPicker()}},mediaEvents:["webkitcurrentplaybacktargetiswirelesschanged"]},mediaFullscreenUnavailable:{get(t){let{media:e}=t;if(!zd||!Xo(e))return ne.UNSUPPORTED}},mediaPipUnavailable:{get(t){let{media:e}=t;if(!Qd||!Zo(e))return ne.UNSUPPORTED;if(e?.disablePictureInPicture)return ne.UNAVAILABLE}},mediaVolumeUnavailable:{get(t){let{media:e}=t;if(Yr===!1||e?.volume==null)return ne.UNSUPPORTED},stateOwnersUpdateHandlers:[t=>{Yr==null&&Lh.then(e=>t(e?void 0:ne.UNSUPPORTED))}]},mediaCastUnavailable:{get(t,{availability:e="not-available"}={}){var i;let{media:a}=t;if(!Xd||!((i=a?.remote)!=null&&i.state))return ne.UNSUPPORTED;if(!(e==null||e==="available"))return ne.UNAVAILABLE},stateOwnersUpdateHandlers:[(t,e)=>{var i;let{media:a}=e;return a?(a.disableRemotePlayback||a.hasAttribute("disableremoteplayback")||(i=a?.remote)==null||i.watchAvailability(s=>{t({availability:s?"available":"not-available"})}).catch(s=>{s.name==="NotSupportedError"?t({availability:null}):t({availability:"not-available"})}),()=>{var s;(s=a?.remote)==null||s.cancelWatchAvailability().catch(()=>{})}):void 0}]},mediaAirplayUnavailable:{get(t,e){if(!Zd)return ne.UNSUPPORTED;if(e?.availability==="not-available")return ne.UNAVAILABLE},mediaEvents:["webkitplaybacktargetavailabilitychanged"],stateOwnersUpdateHandlers:[(t,e)=>{var i;let{media:a}=e;return a?(a.disableRemotePlayback||a.hasAttribute("disableremoteplayback")||(i=a?.remote)==null||i.watchAvailability(s=>{t({availability:s?"available":"not-available"})}).catch(s=>{s.name==="NotSupportedError"?t({availability:null}):t({availability:"not-available"})}),()=>{var s;(s=a?.remote)==null||s.cancelWatchAvailability().catch(()=>{})}):void 0}]},mediaRenditionUnavailable:{get(t){var e;let{media:i}=t;if(!i?.videoRenditions)return ne.UNSUPPORTED;if(!((e=i.videoRenditions)!=null&&e.length))return ne.UNAVAILABLE},mediaEvents:["emptied","loadstart"],videoRenditionsEvents:["addrendition","removerendition"]},mediaAudioTrackUnavailable:{get(t){var e,i;let{media:a}=t;if(!a?.audioTracks)return ne.UNSUPPORTED;if(((i=(e=a.audioTracks)==null?void 0:e.length)!=null?i:0)<=1)return ne.UNAVAILABLE},mediaEvents:["emptied","loadstart"],audioTracksEvents:["addtrack","removetrack"]},mediaLang:{get(t){let{options:{mediaLang:e}={}}=t;return e??"en"}}};var jd={[h.MEDIA_PREVIEW_REQUEST](t,e,{detail:i}){var a,r,s;let{media:n}=e,d=i??void 0,u,p;if(n&&d!=null){let[v]=Bt(n,{kind:oe.METADATA,label:"thumbnails"}),y=Array.prototype.find.call((a=v?.cues)!=null?a:[],(g,C,w)=>C===0?g.endTime>d:C===w.length-1?g.startTime<=d:g.startTime<=d&&g.endTime>d);if(y){let g=/'^(?:[a-z]+:)?\/\//i.test(y.text)||(r=n?.querySelector('track[label="thumbnails"]'))==null?void 0:r.src,C=new URL(y.text,g);p=new URLSearchParams(C.hash).get("#xywh").split(",").map(ie=>+ie),u=C.href}}let _=t.mediaDuration.get(e),f=(s=t.mediaChaptersCues.get(e).find((v,y,g)=>y===g.length-1&&_===v.endTime?v.startTime<=d&&v.endTime>=d:v.startTime<=d&&v.endTime>d))==null?void 0:s.text;return i!=null&&f==null&&(f=""),{mediaPreviewTime:d,mediaPreviewImage:u,mediaPreviewCoords:p,mediaPreviewChapter:f}},[h.MEDIA_PAUSE_REQUEST](t,e){t["mediaPaused"].set(!0,e)},[h.MEDIA_PLAY_REQUEST](t,e){var i,a,r,s;let n="mediaPaused",u=t.mediaStreamType.get(e)===_e.LIVE,p=!((i=e.options)!=null&&i.noAutoSeekToLive),_=t.mediaTargetLiveWindow.get(e)>0;if(u&&p&&!_){let b=(a=t.mediaSeekable.get(e))==null?void 0:a[1];if(b){let f=(s=(r=e.options)==null?void 0:r.seekToLiveOffset)!=null?s:0,v=b-f;t.mediaCurrentTime.set(v,e)}}t[n].set(!1,e)},[h.MEDIA_PLAYBACK_RATE_REQUEST](t,e,{detail:i}){let a="mediaPlaybackRate",r=i;t[a].set(r,e)},[h.MEDIA_MUTE_REQUEST](t,e){t["mediaMuted"].set(!0,e)},[h.MEDIA_UNMUTE_REQUEST](t,e){let i="mediaMuted";t.mediaVolume.get(e)||t.mediaVolume.set(.25,e),t[i].set(!1,e)},[h.MEDIA_LOOP_REQUEST](t,e,{detail:i}){let a="mediaLoop",r=!!i;return t[a].set(r,e),{mediaLoop:r}},[h.MEDIA_VOLUME_REQUEST](t,e,{detail:i}){let a="mediaVolume",r=i;r&&t.mediaMuted.get(e)&&t.mediaMuted.set(!1,e),t[a].set(r,e)},[h.MEDIA_SEEK_REQUEST](t,e,{detail:i}){let a="mediaCurrentTime",r=i;t[a].set(r,e)},[h.MEDIA_SEEK_TO_LIVE_REQUEST](t,e){var i,a,r;let s="mediaCurrentTime",n=(i=t.mediaSeekable.get(e))==null?void 0:i[1];if(Number.isNaN(Number(n)))return;let d=(r=(a=e.options)==null?void 0:a.seekToLiveOffset)!=null?r:0,u=n-d;t[s].set(u,e)},[h.MEDIA_SHOW_SUBTITLES_REQUEST](t,e,{detail:i}){var a;let{options:r}=e,s=_i(e),n=zo(i),d=(a=n[0])==null?void 0:a.language;d&&!r.noSubtitlesLangPref&&l.localStorage.setItem("media-chrome-pref-subtitles-lang",d),Ft(pt.SHOWING,s,n)},[h.MEDIA_DISABLE_SUBTITLES_REQUEST](t,e,{detail:i}){let a=_i(e),r=i??[];Ft(pt.DISABLED,a,r)},[h.MEDIA_TOGGLE_SUBTITLES_REQUEST](t,e,{detail:i}){Gr(e,i)},[h.MEDIA_RENDITION_REQUEST](t,e,{detail:i}){let a="mediaRenditionSelected",r=i;t[a].set(r,e)},[h.MEDIA_AUDIO_TRACK_REQUEST](t,e,{detail:i}){let a="mediaAudioTrackEnabled",r=i;t[a].set(r,e)},[h.MEDIA_ENTER_PIP_REQUEST](t,e){let i="mediaIsPip";t.mediaIsFullscreen.get(e)&&t.mediaIsFullscreen.set(!1,e),t[i].set(!0,e)},[h.MEDIA_EXIT_PIP_REQUEST](t,e){t["mediaIsPip"].set(!1,e)},[h.MEDIA_ENTER_FULLSCREEN_REQUEST](t,e,i){let a="mediaIsFullscreen";t.mediaIsPip.get(e)&&t.mediaIsPip.set(!1,e),t[a].set(!0,e,i)},[h.MEDIA_EXIT_FULLSCREEN_REQUEST](t,e){t["mediaIsFullscreen"].set(!1,e)},[h.MEDIA_ENTER_CAST_REQUEST](t,e){let i="mediaIsCasting";t.mediaIsFullscreen.get(e)&&t.mediaIsFullscreen.set(!1,e),t[i].set(!0,e)},[h.MEDIA_EXIT_CAST_REQUEST](t,e){t["mediaIsCasting"].set(!1,e)},[h.MEDIA_AIRPLAY_REQUEST](t,e){t["mediaIsAirplaying"].set(!0,e)}};var eu=({media:t,fullscreenElement:e,documentElement:i,stateMediator:a=Ai,requestMap:r=jd,options:s={},monitorStateOwnersOnlyWithSubscriptions:n=!0})=>{let d=[],u={options:{...s}},p=Object.freeze({mediaPreviewTime:void 0,mediaPreviewImage:void 0,mediaPreviewCoords:void 0,mediaPreviewChapter:void 0}),_=g=>{g!=null&&(qr(g,p)||(p=Object.freeze({...p,...g}),d.forEach(C=>C(p))))},b=()=>{let g=Object.entries(a).reduce((C,[w,{get:ie}])=>(C[w]=ie(u),C),{});_(g)},f={},v,y=async(g,C)=>{var w,ie,da,ua,oi,tt,it,ca,xt,$l,Vl,Kl,Gl,ql,Yl,zl;let Yc=!!v;if(v={...u,...v??{},...g},Yc)return;await Jd(...Object.values(g));let ni=d.length>0&&C===0&&n,Ql=u.media!==v.media,Zl=((w=u.media)==null?void 0:w.textTracks)!==((ie=v.media)==null?void 0:ie.textTracks),Xl=((da=u.media)==null?void 0:da.videoRenditions)!==((ua=v.media)==null?void 0:ua.videoRenditions),Jl=((oi=u.media)==null?void 0:oi.audioTracks)!==((tt=v.media)==null?void 0:tt.audioTracks),jl=((it=u.media)==null?void 0:it.remote)!==((ca=v.media)==null?void 0:ca.remote),ed=u.documentElement!==v.documentElement,td=!!u.media&&(Ql||ni),id=!!((xt=u.media)!=null&&xt.textTracks)&&(Zl||ni),ad=!!(($l=u.media)!=null&&$l.videoRenditions)&&(Xl||ni),rd=!!((Vl=u.media)!=null&&Vl.audioTracks)&&(Jl||ni),sd=!!((Kl=u.media)!=null&&Kl.remote)&&(jl||ni),od=!!u.documentElement&&(ed||ni),Fo=td||id||ad||rd||sd||od,li=d.length===0&&C===1&&n,nd=!!v.media&&(Ql||li),ld=!!((Gl=v.media)!=null&&Gl.textTracks)&&(Zl||li),dd=!!((ql=v.media)!=null&&ql.videoRenditions)&&(Xl||li),ud=!!((Yl=v.media)!=null&&Yl.audioTracks)&&(Jl||li),cd=!!((zl=v.media)!=null&&zl.remote)&&(jl||li),hd=!!v.documentElement&&(ed||li),md=nd||ld||dd||ud||cd||hd;if(!(Fo||md)){Object.entries(v).forEach(([P,ha])=>{u[P]=ha}),b(),v=void 0;return}Object.entries(a).forEach(([P,{get:ha,mediaEvents:zc=[],textTracksEvents:Qc=[],videoRenditionsEvents:Zc=[],audioTracksEvents:Xc=[],remoteEvents:Jc=[],rootEvents:jc=[],stateOwnersUpdateHandlers:eh=[]}])=>{f[P]||(f[P]={});let ue=K=>{let z=ha(u,K);_({[P]:z})},X;X=f[P].mediaEvents,zc.forEach(K=>{X&&td&&(u.media.removeEventListener(K,X),f[P].mediaEvents=void 0),nd&&(v.media.addEventListener(K,ue),f[P].mediaEvents=ue)}),X=f[P].textTracksEvents,Qc.forEach(K=>{var z,be;X&&id&&((z=u.media.textTracks)==null||z.removeEventListener(K,X),f[P].textTracksEvents=void 0),ld&&((be=v.media.textTracks)==null||be.addEventListener(K,ue),f[P].textTracksEvents=ue)}),X=f[P].videoRenditionsEvents,Zc.forEach(K=>{var z,be;X&&ad&&((z=u.media.videoRenditions)==null||z.removeEventListener(K,X),f[P].videoRenditionsEvents=void 0),dd&&((be=v.media.videoRenditions)==null||be.addEventListener(K,ue),f[P].videoRenditionsEvents=ue)}),X=f[P].audioTracksEvents,Xc.forEach(K=>{var z,be;X&&rd&&((z=u.media.audioTracks)==null||z.removeEventListener(K,X),f[P].audioTracksEvents=void 0),ud&&((be=v.media.audioTracks)==null||be.addEventListener(K,ue),f[P].audioTracksEvents=ue)}),X=f[P].remoteEvents,Jc.forEach(K=>{var z,be;X&&sd&&((z=u.media.remote)==null||z.removeEventListener(K,X),f[P].remoteEvents=void 0),cd&&((be=v.media.remote)==null||be.addEventListener(K,ue),f[P].remoteEvents=ue)}),X=f[P].rootEvents,jc.forEach(K=>{X&&od&&(u.documentElement.removeEventListener(K,X),f[P].rootEvents=void 0),hd&&(v.documentElement.addEventListener(K,ue),f[P].rootEvents=ue)});let Tr=f[P].stateOwnersUpdateHandlers;if(Tr&&Fo&&(Array.isArray(Tr)?Tr:[Tr]).forEach(z=>{typeof z=="function"&&z()}),md){let K=eh.map(z=>z(ue,v)).filter(z=>typeof z=="function");f[P].stateOwnersUpdateHandlers=K.length===1?K[0]:K}else Fo&&(f[P].stateOwnersUpdateHandlers=void 0)}),Object.entries(v).forEach(([P,ha])=>{u[P]=ha}),b(),v=void 0};return y({media:t,fullscreenElement:e,documentElement:i,options:s}),{dispatch(g){let{type:C,detail:w}=g;if(r[C]&&p.mediaErrorCode==null){_(r[C](a,u,g));return}C==="mediaelementchangerequest"?y({media:w}):C==="fullscreenelementchangerequest"?y({fullscreenElement:w}):C==="documentelementchangerequest"?y({documentElement:w}):C==="optionschangerequest"&&(Object.entries(w??{}).forEach(([ie,da])=>{u.options[ie]=da}),b())},getState(){return p},subscribe(g){return y({},d.length+1),d.push(g),g(p),()=>{let C=d.indexOf(g);C>=0&&(y({},d.length-1),d.splice(C,1))}}}};var sn=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},E=(t,e,i)=>(sn(t,e,"read from private field"),i?i.call(t):e.get(t)),me=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Se=(t,e,i,a)=>(sn(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),Aa=(t,e,i)=>(sn(t,e,"access private method"),i),nt,Ta,x,Oe,ka,xe,zr,ya,Qr,jo,$t,Zr,en,tn,nu,lu=["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Enter"," ","f","m","k","c","l","j",">","<","p"],tu=10,iu=.025,au=.25,Rh=.25,xh=2,m={DEFAULT_SUBTITLES:"defaultsubtitles",DEFAULT_STREAM_TYPE:"defaultstreamtype",DEFAULT_DURATION:"defaultduration",FULLSCREEN_ELEMENT:"fullscreenelement",HOTKEYS:"hotkeys",KEYBOARD_BACKWARD_SEEK_OFFSET:"keyboardbackwardseekoffset",KEYBOARD_FORWARD_SEEK_OFFSET:"keyboardforwardseekoffset",KEYBOARD_DOWN_VOLUME_STEP:"keyboarddownvolumestep",KEYBOARD_UP_VOLUME_STEP:"keyboardupvolumestep",KEYS_USED:"keysused",LANG:"lang",LOOP:"loop",LIVE_EDGE_OFFSET:"liveedgeoffset",NO_AUTO_SEEK_TO_LIVE:"noautoseektolive",NO_DEFAULT_STORE:"nodefaultstore",NO_HOTKEYS:"nohotkeys",NO_MUTED_PREF:"nomutedpref",NO_SUBTITLES_LANG_PREF:"nosubtitleslangpref",NO_VOLUME_PREF:"novolumepref",SEEK_TO_LIVE_OFFSET:"seektoliveoffset"},an=class extends Pt{constructor(){super(),me(this,Qr),me(this,Zr),me(this,tn),this.mediaStateReceivers=[],this.associatedElementSubscriptions=new Map,me(this,nt,new Et(this,m.HOTKEYS)),me(this,Ta,void 0),me(this,x,void 0),me(this,Oe,null),me(this,ka,void 0),me(this,xe,void 0),me(this,zr,i=>{var a;(a=E(this,x))==null||a.dispatch(i)}),me(this,ya,void 0),me(this,$t,i=>{let{key:a,shiftKey:r}=i;if(!(r&&(a==="/"||a==="?")||lu.includes(a))){this.removeEventListener("keyup",E(this,$t));return}this.keyboardShortcutHandler(i)}),this.associateElement(this);let e={};Se(this,ka,i=>{Object.entries(i).forEach(([a,r])=>{if(a in e&&e[a]===r)return;this.propagateMediaState(a,r);let s=a.toLowerCase(),n=new l.CustomEvent(vd[s],{composed:!0,detail:r});this.dispatchEvent(n)}),e=i})}static get observedAttributes(){return super.observedAttributes.concat(m.NO_HOTKEYS,m.HOTKEYS,m.DEFAULT_STREAM_TYPE,m.DEFAULT_SUBTITLES,m.DEFAULT_DURATION,m.NO_MUTED_PREF,m.NO_VOLUME_PREF,m.LANG,m.LOOP,m.LIVE_EDGE_OFFSET,m.SEEK_TO_LIVE_OFFSET,m.NO_AUTO_SEEK_TO_LIVE)}get mediaStore(){return E(this,x)}set mediaStore(e){var i,a;if(E(this,x)&&((i=E(this,xe))==null||i.call(this),Se(this,xe,void 0)),Se(this,x,e),!E(this,x)&&!this.hasAttribute(m.NO_DEFAULT_STORE)){Aa(this,Qr,jo).call(this);return}Se(this,xe,(a=E(this,x))==null?void 0:a.subscribe(E(this,ka)))}get fullscreenElement(){var e;return(e=E(this,Ta))!=null?e:this}set fullscreenElement(e){var i;this.hasAttribute(m.FULLSCREEN_ELEMENT)&&this.removeAttribute(m.FULLSCREEN_ELEMENT),Se(this,Ta,e),(i=E(this,x))==null||i.dispatch({type:"fullscreenelementchangerequest",detail:this.fullscreenElement})}get defaultSubtitles(){return A(this,m.DEFAULT_SUBTITLES)}set defaultSubtitles(e){T(this,m.DEFAULT_SUBTITLES,e)}get defaultStreamType(){return I(this,m.DEFAULT_STREAM_TYPE)}set defaultStreamType(e){S(this,m.DEFAULT_STREAM_TYPE,e)}get defaultDuration(){return L(this,m.DEFAULT_DURATION)}set defaultDuration(e){R(this,m.DEFAULT_DURATION,e)}get noHotkeys(){return A(this,m.NO_HOTKEYS)}set noHotkeys(e){T(this,m.NO_HOTKEYS,e)}get keysUsed(){return I(this,m.KEYS_USED)}set keysUsed(e){S(this,m.KEYS_USED,e)}get liveEdgeOffset(){return L(this,m.LIVE_EDGE_OFFSET)}set liveEdgeOffset(e){R(this,m.LIVE_EDGE_OFFSET,e)}get noAutoSeekToLive(){return A(this,m.NO_AUTO_SEEK_TO_LIVE)}set noAutoSeekToLive(e){T(this,m.NO_AUTO_SEEK_TO_LIVE,e)}get noVolumePref(){return A(this,m.NO_VOLUME_PREF)}set noVolumePref(e){T(this,m.NO_VOLUME_PREF,e)}get noMutedPref(){return A(this,m.NO_MUTED_PREF)}set noMutedPref(e){T(this,m.NO_MUTED_PREF,e)}get noSubtitlesLangPref(){return A(this,m.NO_SUBTITLES_LANG_PREF)}set noSubtitlesLangPref(e){T(this,m.NO_SUBTITLES_LANG_PREF,e)}get noDefaultStore(){return A(this,m.NO_DEFAULT_STORE)}set noDefaultStore(e){T(this,m.NO_DEFAULT_STORE,e)}get resolvedLang(){return Id()}attributeChangedCallback(e,i,a){var r,s,n,d,u,p,_,b,f,v,y,g;if(super.attributeChangedCallback(e,i,a),e===m.NO_HOTKEYS)a!==i&&a===""?(this.hasAttribute(m.HOTKEYS)&&console.warn("Media Chrome: Both `hotkeys` and `nohotkeys` have been set. All hotkeys will be disabled."),this.disableHotkeys()):a!==i&&a===null&&this.enableHotkeys();else if(e===m.HOTKEYS)E(this,nt).value=a;else if(e===m.DEFAULT_SUBTITLES&&a!==i)(r=E(this,x))==null||r.dispatch({type:"optionschangerequest",detail:{defaultSubtitles:this.hasAttribute(m.DEFAULT_SUBTITLES)}});else if(e===m.DEFAULT_STREAM_TYPE)(n=E(this,x))==null||n.dispatch({type:"optionschangerequest",detail:{defaultStreamType:(s=this.getAttribute(m.DEFAULT_STREAM_TYPE))!=null?s:void 0}});else if(e===m.LIVE_EDGE_OFFSET&&a!==i)(d=E(this,x))==null||d.dispatch({type:"optionschangerequest",detail:{liveEdgeOffset:this.hasAttribute(m.LIVE_EDGE_OFFSET)?+this.getAttribute(m.LIVE_EDGE_OFFSET):void 0,seekToLiveOffset:this.hasAttribute(m.SEEK_TO_LIVE_OFFSET)?+this.getAttribute(m.SEEK_TO_LIVE_OFFSET):this.hasAttribute(m.LIVE_EDGE_OFFSET)?+this.getAttribute(m.LIVE_EDGE_OFFSET):void 0}});else if(e===m.SEEK_TO_LIVE_OFFSET&&a!==i)(u=E(this,x))==null||u.dispatch({type:"optionschangerequest",detail:{seekToLiveOffset:this.hasAttribute(m.SEEK_TO_LIVE_OFFSET)?+this.getAttribute(m.SEEK_TO_LIVE_OFFSET):this.hasAttribute(m.LIVE_EDGE_OFFSET)?+this.getAttribute(m.LIVE_EDGE_OFFSET):void 0}});else if(e===m.NO_AUTO_SEEK_TO_LIVE)(p=E(this,x))==null||p.dispatch({type:"optionschangerequest",detail:{noAutoSeekToLive:this.hasAttribute(m.NO_AUTO_SEEK_TO_LIVE)}});else if(e===m.FULLSCREEN_ELEMENT){let C=a?(_=this.getRootNode())==null?void 0:_.getElementById(a):void 0;Se(this,Ta,C),(b=E(this,x))==null||b.dispatch({type:"fullscreenelementchangerequest",detail:this.fullscreenElement})}else e===m.LANG&&a!==i?(yd(a),(f=E(this,x))==null||f.dispatch({type:"optionschangerequest",detail:{mediaLang:a}})):e===m.LOOP&&a!==i?(v=E(this,x))==null||v.dispatch({type:h.MEDIA_LOOP_REQUEST,detail:a!=null}):e===m.NO_VOLUME_PREF&&a!==i?(y=E(this,x))==null||y.dispatch({type:"optionschangerequest",detail:{noVolumePref:this.hasAttribute(m.NO_VOLUME_PREF)}}):e===m.NO_MUTED_PREF&&a!==i&&((g=E(this,x))==null||g.dispatch({type:"optionschangerequest",detail:{noMutedPref:this.hasAttribute(m.NO_MUTED_PREF)}}))}connectedCallback(){var e,i,a;this.associateElement(this),!E(this,x)&&!this.hasAttribute(m.NO_DEFAULT_STORE)&&Aa(this,Qr,jo).call(this),(e=E(this,x))==null||e.dispatch({type:"documentelementchangerequest",detail:N}),(i=E(this,x))==null||i.dispatch({type:"fullscreenelementchangerequest",detail:this.fullscreenElement}),super.connectedCallback(),E(this,x)&&!E(this,xe)&&Se(this,xe,(a=E(this,x))==null?void 0:a.subscribe(E(this,ka))),E(this,ya)!==void 0&&E(this,x)&&this.media&&setTimeout(()=>{var r,s,n;(s=(r=this.media)==null?void 0:r.textTracks)!=null&&s.length&&((n=E(this,x))==null||n.dispatch({type:h.MEDIA_TOGGLE_SUBTITLES_REQUEST,detail:E(this,ya)}))},0),this.hasAttribute(m.NO_HOTKEYS)?this.disableHotkeys():this.enableHotkeys()}disconnectedCallback(){var e,i,a,r,s,n;if((e=super.disconnectedCallback)==null||e.call(this),this.disableHotkeys(),E(this,x)){let d=E(this,x).getState();Se(this,ya,!!((i=d.mediaSubtitlesShowing)!=null&&i.length)),(a=E(this,x))==null||a.dispatch({type:"fullscreenelementchangerequest",detail:void 0}),(r=E(this,x))==null||r.dispatch({type:"documentelementchangerequest",detail:void 0}),(s=E(this,x))==null||s.dispatch({type:h.MEDIA_TOGGLE_SUBTITLES_REQUEST,detail:!1})}E(this,xe)&&((n=E(this,xe))==null||n.call(this),Se(this,xe,void 0)),this.unassociateElement(this),E(this,Oe)&&(E(this,Oe).remove(),Se(this,Oe,null))}mediaSetCallback(e){var i;super.mediaSetCallback(e),(i=E(this,x))==null||i.dispatch({type:"mediaelementchangerequest",detail:e}),e.hasAttribute("tabindex")||(e.tabIndex=-1)}mediaUnsetCallback(e){var i;super.mediaUnsetCallback(e),(i=E(this,x))==null||i.dispatch({type:"mediaelementchangerequest",detail:void 0})}propagateMediaState(e,i){ou(this.mediaStateReceivers,e,i)}associateElement(e){if(!e)return;let{associatedElementSubscriptions:i}=this;if(i.has(e))return;let a=this.registerMediaStateReceiver.bind(this),r=this.unregisterMediaStateReceiver.bind(this),s=Fh(e,a,r);Object.values(h).forEach(n=>{e.addEventListener(n,E(this,zr))}),i.set(e,s)}unassociateElement(e){if(!e)return;let{associatedElementSubscriptions:i}=this;if(!i.has(e))return;i.get(e)(),i.delete(e),Object.values(h).forEach(r=>{e.removeEventListener(r,E(this,zr))})}registerMediaStateReceiver(e){if(!e)return;let i=this.mediaStateReceivers;i.indexOf(e)>-1||(i.push(e),E(this,x)&&Object.entries(E(this,x).getState()).forEach(([r,s])=>{ou([e],r,s)}))}unregisterMediaStateReceiver(e){let i=this.mediaStateReceivers,a=i.indexOf(e);a<0||i.splice(a,1)}enableHotkeys(){this.addEventListener("keydown",Aa(this,Zr,en))}disableHotkeys(){this.removeEventListener("keydown",Aa(this,Zr,en)),this.removeEventListener("keyup",E(this,$t))}get hotkeys(){return E(this,nt)}set hotkeys(e){S(this,m.HOTKEYS,e)}keyboardShortcutHandler(e){var i,a,r,s,n,d,u,p,_;let b=e.target;if(((r=(a=(i=b.getAttribute(m.KEYS_USED))==null?void 0:i.split(" "))!=null?a:b?.keysUsed)!=null?r:[]).map(w=>w==="Space"?" ":w).filter(Boolean).includes(e.key))return;let v,y,g;if(!(E(this,nt).contains(`no${e.key.toLowerCase()}`)||e.key===" "&&E(this,nt).contains("nospace")||e.shiftKey&&(e.key==="/"||e.key==="?")&&E(this,nt).contains("noshift+/")))switch(e.key){case" ":case"k":v=E(this,x).getState().mediaPaused?h.MEDIA_PLAY_REQUEST:h.MEDIA_PAUSE_REQUEST,this.dispatchEvent(new l.CustomEvent(v,{composed:!0,bubbles:!0}));break;case"m":v=this.mediaStore.getState().mediaVolumeLevel==="off"?h.MEDIA_UNMUTE_REQUEST:h.MEDIA_MUTE_REQUEST,this.dispatchEvent(new l.CustomEvent(v,{composed:!0,bubbles:!0}));break;case"f":v=this.mediaStore.getState().mediaIsFullscreen?h.MEDIA_EXIT_FULLSCREEN_REQUEST:h.MEDIA_ENTER_FULLSCREEN_REQUEST,this.dispatchEvent(new l.CustomEvent(v,{composed:!0,bubbles:!0}));break;case"c":this.dispatchEvent(new l.CustomEvent(h.MEDIA_TOGGLE_SUBTITLES_REQUEST,{composed:!0,bubbles:!0}));break;case"ArrowLeft":case"j":{let w=this.hasAttribute(m.KEYBOARD_BACKWARD_SEEK_OFFSET)?+this.getAttribute(m.KEYBOARD_BACKWARD_SEEK_OFFSET):tu;y=Math.max(((s=this.mediaStore.getState().mediaCurrentTime)!=null?s:0)-w,0),g=new l.CustomEvent(h.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:y}),this.dispatchEvent(g);break}case"ArrowRight":case"l":{let w=this.hasAttribute(m.KEYBOARD_FORWARD_SEEK_OFFSET)?+this.getAttribute(m.KEYBOARD_FORWARD_SEEK_OFFSET):tu;y=Math.max(((n=this.mediaStore.getState().mediaCurrentTime)!=null?n:0)+w,0),g=new l.CustomEvent(h.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:y}),this.dispatchEvent(g);break}case"ArrowUp":{let w=this.hasAttribute(m.KEYBOARD_UP_VOLUME_STEP)?+this.getAttribute(m.KEYBOARD_UP_VOLUME_STEP):iu;y=Math.min(((d=this.mediaStore.getState().mediaVolume)!=null?d:1)+w,1),g=new l.CustomEvent(h.MEDIA_VOLUME_REQUEST,{composed:!0,bubbles:!0,detail:y}),this.dispatchEvent(g);break}case"ArrowDown":{let w=this.hasAttribute(m.KEYBOARD_DOWN_VOLUME_STEP)?+this.getAttribute(m.KEYBOARD_DOWN_VOLUME_STEP):iu;y=Math.max(((u=this.mediaStore.getState().mediaVolume)!=null?u:1)-w,0),g=new l.CustomEvent(h.MEDIA_VOLUME_REQUEST,{composed:!0,bubbles:!0,detail:y}),this.dispatchEvent(g);break}case"<":{let w=(p=this.mediaStore.getState().mediaPlaybackRate)!=null?p:1;y=Math.max(w-au,Rh).toFixed(2),g=new l.CustomEvent(h.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:y}),this.dispatchEvent(g);break}case">":{let w=(_=this.mediaStore.getState().mediaPlaybackRate)!=null?_:1;y=Math.min(w+au,xh).toFixed(2),g=new l.CustomEvent(h.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:y}),this.dispatchEvent(g);break}case"/":case"?":{e.shiftKey&&Aa(this,tn,nu).call(this);break}case"p":{v=this.mediaStore.getState().mediaIsPip?h.MEDIA_EXIT_PIP_REQUEST:h.MEDIA_ENTER_PIP_REQUEST,g=new l.CustomEvent(v,{composed:!0,bubbles:!0}),this.dispatchEvent(g);break}default:break}}};nt=new WeakMap;Ta=new WeakMap;x=new WeakMap;Oe=new WeakMap;ka=new WeakMap;xe=new WeakMap;zr=new WeakMap;ya=new WeakMap;Qr=new WeakSet;jo=function(){var t;this.mediaStore=eu({media:this.media,fullscreenElement:this.fullscreenElement,options:{defaultSubtitles:this.hasAttribute(m.DEFAULT_SUBTITLES),defaultDuration:this.hasAttribute(m.DEFAULT_DURATION)?+this.getAttribute(m.DEFAULT_DURATION):void 0,defaultStreamType:(t=this.getAttribute(m.DEFAULT_STREAM_TYPE))!=null?t:void 0,liveEdgeOffset:this.hasAttribute(m.LIVE_EDGE_OFFSET)?+this.getAttribute(m.LIVE_EDGE_OFFSET):void 0,seekToLiveOffset:this.hasAttribute(m.SEEK_TO_LIVE_OFFSET)?+this.getAttribute(m.SEEK_TO_LIVE_OFFSET):this.hasAttribute(m.LIVE_EDGE_OFFSET)?+this.getAttribute(m.LIVE_EDGE_OFFSET):void 0,noAutoSeekToLive:this.hasAttribute(m.NO_AUTO_SEEK_TO_LIVE),noVolumePref:this.hasAttribute(m.NO_VOLUME_PREF),noMutedPref:this.hasAttribute(m.NO_MUTED_PREF),noSubtitlesLangPref:this.hasAttribute(m.NO_SUBTITLES_LANG_PREF)}})};$t=new WeakMap;Zr=new WeakSet;en=function(t){var e;let{metaKey:i,altKey:a,key:r,shiftKey:s}=t,n=s&&(r==="/"||r==="?");if(n&&((e=E(this,Oe))!=null&&e.open)){this.removeEventListener("keyup",E(this,$t));return}if(i||a||!n&&!lu.includes(r)){this.removeEventListener("keyup",E(this,$t));return}let d=t.target,u=d instanceof HTMLElement&&(d.tagName.toLowerCase()==="media-volume-range"||d.tagName.toLowerCase()==="media-time-range");[" ","ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(r)&&!(E(this,nt).contains(`no${r.toLowerCase()}`)||r===" "&&E(this,nt).contains("nospace"))&&!u&&t.preventDefault(),this.addEventListener("keyup",E(this,$t),{once:!0})};tn=new WeakSet;nu=function(){E(this,Oe)||(Se(this,Oe,N.createElement("media-keyboard-shortcuts-dialog")),this.appendChild(E(this,Oe))),E(this,Oe).open=!0};var Oh=Object.values(o),Uh=Object.values(Bo),du=t=>{var e,i,a,r;let{observedAttributes:s}=t.constructor;!s&&((e=t.nodeName)!=null&&e.includes("-"))&&(l.customElements.upgrade(t),{observedAttributes:s}=t.constructor);let n=(r=(a=(i=t?.getAttribute)==null?void 0:i.call(t,M.MEDIA_CHROME_ATTRIBUTES))==null?void 0:a.split)==null?void 0:r.call(a,/\s+/);return Array.isArray(s||n)?(s||n).filter(d=>Oh.includes(d)):[]},Ph=t=>{var e,i;return(e=t.nodeName)!=null&&e.includes("-")&&l.customElements.get((i=t.nodeName)==null?void 0:i.toLowerCase())&&!(t instanceof l.customElements.get(t.nodeName.toLowerCase()))&&l.customElements.upgrade(t),Uh.some(a=>a in t)},rn=t=>Ph(t)||!!du(t).length,ru=t=>{var e;return(e=t?.join)==null?void 0:e.call(t,":")},su={[o.MEDIA_SUBTITLES_LIST]:ot,[o.MEDIA_SUBTITLES_SHOWING]:ot,[o.MEDIA_SEEKABLE]:ru,[o.MEDIA_BUFFERED]:t=>t?.map(ru).join(" "),[o.MEDIA_PREVIEW_COORDS]:t=>t?.join(" "),[o.MEDIA_RENDITION_LIST]:Ed,[o.MEDIA_AUDIO_TRACK_LIST]:bd},Nh=async(t,e,i)=>{var a,r;if(t.isConnected||await Sr(0),typeof i=="boolean"||i==null)return T(t,e,i);if(typeof i=="number")return R(t,e,i);if(typeof i=="string")return S(t,e,i);if(Array.isArray(i)&&!i.length)return t.removeAttribute(e);let s=(r=(a=su[e])==null?void 0:a.call(su,i))!=null?r:i;return t.setAttribute(e,s)},Hh=t=>{var e;return!!((e=t.closest)!=null&&e.call(t,'*[slot="media"]'))},Wt=(t,e)=>{if(Hh(t))return;let i=(r,s)=>{var n,d;rn(r)&&s(r);let{children:u=[]}=r??{},p=(d=(n=r?.shadowRoot)==null?void 0:n.children)!=null?d:[];[...u,...p].forEach(b=>Wt(b,s))},a=t?.nodeName.toLowerCase();if(a.includes("-")&&!rn(t)){l.customElements.whenDefined(a).then(()=>{i(t,e)});return}i(t,e)},ou=(t,e,i)=>{t.forEach(a=>{if(e in a){a[e]=i;return}let r=du(a),s=e.toLowerCase();r.includes(s)&&Nh(a,s,i)})},Fh=(t,e,i)=>{Wt(t,e);let a=_=>{var b;let f=(b=_?.composedPath()[0])!=null?b:_.target;e(f)},r=_=>{var b;let f=(b=_?.composedPath()[0])!=null?b:_.target;i(f)};t.addEventListener(h.REGISTER_MEDIA_STATE_RECEIVER,a),t.addEventListener(h.UNREGISTER_MEDIA_STATE_RECEIVER,r);let s=_=>{_.forEach(b=>{let{addedNodes:f=[],removedNodes:v=[],type:y,target:g,attributeName:C}=b;y==="childList"?(Array.prototype.forEach.call(f,w=>Wt(w,e)),Array.prototype.forEach.call(v,w=>Wt(w,i))):y==="attributes"&&C===M.MEDIA_CHROME_ATTRIBUTES&&(rn(g)?e(g):i(g))})},n=[],d=_=>{let b=_.target;b.name!=="media"&&(n.forEach(f=>Wt(f,i)),n=[...b.assignedElements({flatten:!0})],n.forEach(f=>Wt(f,e)))};t.addEventListener("slotchange",d);let u=new MutationObserver(s);return u.observe(t,{childList:!0,attributes:!0,subtree:!0}),()=>{Wt(t,i),t.removeEventListener("slotchange",d),u.disconnect(),t.removeEventListener(h.REGISTER_MEDIA_STATE_RECEIVER,a),t.removeEventListener(h.UNREGISTER_MEDIA_STATE_RECEIVER,r)}};l.customElements.get("media-controller")||l.customElements.define("media-controller",an);var Ti={PLACEMENT:"placement",BOUNDS:"bounds"};function Bh(t){return`
    <style>
      :host {
        --_tooltip-background-color: var(--media-tooltip-background-color, var(--media-secondary-color, rgba(20, 20, 30, .7)));
        --_tooltip-background: var(--media-tooltip-background, var(--_tooltip-background-color));
        --_tooltip-arrow-half-width: calc(var(--media-tooltip-arrow-width, 12px) / 2);
        --_tooltip-arrow-height: var(--media-tooltip-arrow-height, 5px);
        --_tooltip-arrow-background: var(--media-tooltip-arrow-color, var(--_tooltip-background-color));
        position: relative;
        pointer-events: none;
        display: var(--media-tooltip-display, inline-flex);
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        z-index: var(--media-tooltip-z-index, 1);
        background: var(--_tooltip-background);
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        font: var(--media-font,
          var(--media-font-weight, 400)
          var(--media-font-size, 13px) /
          var(--media-text-content-height, var(--media-control-height, 18px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        padding: var(--media-tooltip-padding, .35em .7em);
        border: var(--media-tooltip-border, none);
        border-radius: var(--media-tooltip-border-radius, 5px);
        filter: var(--media-tooltip-filter, drop-shadow(0 0 4px rgba(0, 0, 0, .2)));
        white-space: var(--media-tooltip-white-space, nowrap);
      }

      :host([hidden]) {
        display: none;
      }

      img, svg {
        display: inline-block;
      }

      #arrow {
        position: absolute;
        width: 0px;
        height: 0px;
        border-style: solid;
        display: var(--media-tooltip-arrow-display, block);
      }

      :host(:not([placement])),
      :host([placement="top"]) {
        position: absolute;
        bottom: calc(100% + var(--media-tooltip-distance, 12px));
        left: 50%;
        transform: translate(calc(-50% - var(--media-tooltip-offset-x, 0px)), 0);
      }
      :host(:not([placement])) #arrow,
      :host([placement="top"]) #arrow {
        top: 100%;
        left: 50%;
        border-width: var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width) 0 var(--_tooltip-arrow-half-width);
        border-color: var(--_tooltip-arrow-background) transparent transparent transparent;
        transform: translate(calc(-50% + var(--media-tooltip-offset-x, 0px)), 0);
      }

      :host([placement="right"]) {
        position: absolute;
        left: calc(100% + var(--media-tooltip-distance, 12px));
        top: 50%;
        transform: translate(0, -50%);
      }
      :host([placement="right"]) #arrow {
        top: 50%;
        right: 100%;
        border-width: var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width) 0;
        border-color: transparent var(--_tooltip-arrow-background) transparent transparent;
        transform: translate(0, -50%);
      }

      :host([placement="bottom"]) {
        position: absolute;
        top: calc(100% + var(--media-tooltip-distance, 12px));
        left: 50%;
        transform: translate(calc(-50% - var(--media-tooltip-offset-x, 0px)), 0);
      }
      :host([placement="bottom"]) #arrow {
        bottom: 100%;
        left: 50%;
        border-width: 0 var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width);
        border-color: transparent transparent var(--_tooltip-arrow-background) transparent;
        transform: translate(calc(-50% + var(--media-tooltip-offset-x, 0px)), 0);
      }

      :host([placement="left"]) {
        position: absolute;
        right: calc(100% + var(--media-tooltip-distance, 12px));
        top: 50%;
        transform: translate(0, -50%);
      }
      :host([placement="left"]) #arrow {
        top: 50%;
        left: 100%;
        border-width: var(--_tooltip-arrow-half-width) 0 var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height);
        border-color: transparent transparent transparent var(--_tooltip-arrow-background);
        transform: translate(0, -50%);
      }
      
      :host([placement="none"]) #arrow {
        display: none;
      }
    </style>
    <slot></slot>
    <div id="arrow"></div>
  `}var ki=class extends l.HTMLElement{constructor(){if(super(),this.updateXOffset=()=>{var e;if(!Rr(this,{checkOpacity:!1,checkVisibilityCSS:!1}))return;let i=this.placement;if(i==="left"||i==="right"){this.style.removeProperty("--media-tooltip-offset-x");return}let a=getComputedStyle(this),r=(e=Re(this,"#"+this.bounds))!=null?e:B(this);if(!r)return;let{x:s,width:n}=r.getBoundingClientRect(),{x:d,width:u}=this.getBoundingClientRect(),p=d+u,_=s+n,b=a.getPropertyValue("--media-tooltip-offset-x"),f=b?parseFloat(b.replace("px","")):0,v=a.getPropertyValue("--media-tooltip-container-margin"),y=v?parseFloat(v.replace("px","")):0,g=d-s+f-y,C=p-_+f+y;if(g<0){this.style.setProperty("--media-tooltip-offset-x",`${g}px`);return}if(C>0){this.style.setProperty("--media-tooltip-offset-x",`${C}px`);return}this.style.removeProperty("--media-tooltip-offset-x")},!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=$(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}if(this.arrowEl=this.shadowRoot.querySelector("#arrow"),Object.prototype.hasOwnProperty.call(this,"placement")){let e=this.placement;delete this.placement,this.placement=e}}static get observedAttributes(){return[Ti.PLACEMENT,Ti.BOUNDS]}get placement(){return I(this,Ti.PLACEMENT)}set placement(e){S(this,Ti.PLACEMENT,e)}get bounds(){return I(this,Ti.BOUNDS)}set bounds(e){S(this,Ti.BOUNDS,e)}};ki.shadowRootOptions={mode:"open"};ki.getTemplateHTML=Bh;l.customElements.get("media-tooltip")||l.customElements.define("media-tooltip",ki);var Xr=ki;var nn=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Q=(t,e,i)=>(nn(t,e,"read from private field"),i?i.call(t):e.get(t)),yi=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Jr=(t,e,i,a)=>(nn(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),Wh=(t,e,i)=>(nn(t,e,"access private method"),i),Ue,Ii,bt,Si,jr,on,uu,gt={TOOLTIP_PLACEMENT:"tooltipplacement",DISABLED:"disabled",NO_TOOLTIP:"notooltip"};function $h(t,e={}){return`
    <style>
      :host {
        position: relative;
        font: var(--media-font,
          var(--media-font-weight, bold)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        padding: var(--media-button-padding, var(--media-control-padding, 10px));
        justify-content: var(--media-button-justify-content, center);
        display: inline-flex;
        align-items: center;
        vertical-align: middle;
        box-sizing: border-box;
        transition: background .15s linear;
        pointer-events: auto;
        cursor: var(--media-cursor, pointer);
        -webkit-tap-highlight-color: transparent;
      }

      
      :host(:focus-visible) {
        box-shadow: var(--media-focus-box-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
        outline: 0;
      }
      
      :host(:where(:focus)) {
        box-shadow: none;
        outline: 0;
      }

      :host(:hover) {
        background: var(--media-control-hover-background, rgba(50 50 70 / .7));
      }

      slot[name="icon"] {
        display: inline-flex;
        align-items: center;
      }

      svg, img, ::slotted(svg), ::slotted(img) {
        width: var(--media-button-icon-width);
        height: var(--media-button-icon-height, var(--media-control-height, 24px));
        transform: var(--media-button-icon-transform);
        transition: var(--media-button-icon-transition);
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        vertical-align: middle;
        max-width: 100%;
        max-height: 100%;
        min-width: 100%;
      }

      media-tooltip {
        
        max-width: 0;
        overflow-x: clip;
        opacity: 0;
        transition: opacity .3s, max-width 0s 9s;
      }

      :host(:hover) media-tooltip,
      :host(:focus-visible) media-tooltip {
        max-width: 100vw;
        opacity: 1;
        transition: opacity .3s;
      }

      :host([notooltip]) slot[name="tooltip"] {
        display: none;
      }
    </style>

    ${this.getSlotTemplateHTML(t,e)}

    <slot name="tooltip">
      <media-tooltip part="tooltip" aria-hidden="true">
        <template shadowrootmode="${Xr.shadowRootOptions.mode}">
          ${Xr.getTemplateHTML({})}
        </template>
        <slot name="tooltip-content">
          ${this.getTooltipContentHTML(t)}
        </slot>
      </media-tooltip>
    </slot>
  `}function Vh(t,e){return`
    <slot></slot>
  `}function Kh(){return""}var O=class extends l.HTMLElement{constructor(){if(super(),yi(this,on),yi(this,Ue,void 0),this.preventClick=!1,this.tooltipEl=null,yi(this,Ii,e=>{this.preventClick||this.handleClick(e),setTimeout(Q(this,bt),0)}),yi(this,bt,()=>{var e,i;(i=(e=this.tooltipEl)==null?void 0:e.updateXOffset)==null||i.call(e)}),yi(this,Si,e=>{let{key:i}=e;if(!this.keysUsed.includes(i)){this.removeEventListener("keyup",Q(this,Si));return}this.preventClick||this.handleClick(e)}),yi(this,jr,e=>{let{metaKey:i,altKey:a,key:r}=e;if(i||a||!this.keysUsed.includes(r)){this.removeEventListener("keyup",Q(this,Si));return}this.addEventListener("keyup",Q(this,Si),{once:!0})}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=$(this.attributes),i=this.constructor.getTemplateHTML(e);this.shadowRoot.setHTMLUnsafe?this.shadowRoot.setHTMLUnsafe(i):this.shadowRoot.innerHTML=i}this.tooltipEl=this.shadowRoot.querySelector("media-tooltip")}static get observedAttributes(){return["disabled",gt.TOOLTIP_PLACEMENT,M.MEDIA_CONTROLLER,o.MEDIA_LANG]}enable(){this.addEventListener("click",Q(this,Ii)),this.addEventListener("keydown",Q(this,jr)),this.tabIndex=0}disable(){this.removeEventListener("click",Q(this,Ii)),this.removeEventListener("keydown",Q(this,jr)),this.removeEventListener("keyup",Q(this,Si)),this.tabIndex=-1}attributeChangedCallback(e,i,a){var r,s,n,d,u;e===M.MEDIA_CONTROLLER?(i&&((s=(r=Q(this,Ue))==null?void 0:r.unassociateElement)==null||s.call(r,this),Jr(this,Ue,null)),a&&this.isConnected&&(Jr(this,Ue,(n=this.getRootNode())==null?void 0:n.getElementById(a)),(u=(d=Q(this,Ue))==null?void 0:d.associateElement)==null||u.call(d,this))):e==="disabled"&&a!==i?a==null?this.enable():this.disable():e===gt.TOOLTIP_PLACEMENT&&this.tooltipEl&&a!==i?this.tooltipEl.placement=a:e===o.MEDIA_LANG&&(this.shadowRoot.querySelector('slot[name="tooltip-content"]').innerHTML=this.constructor.getTooltipContentHTML()),Q(this,bt).call(this)}connectedCallback(){var e,i,a;let{style:r}=W(this.shadowRoot,":host");r.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`),this.hasAttribute("disabled")?this.disable():this.enable(),this.setAttribute("role","button");let s=this.getAttribute(M.MEDIA_CONTROLLER);s&&(Jr(this,Ue,(e=this.getRootNode())==null?void 0:e.getElementById(s)),(a=(i=Q(this,Ue))==null?void 0:i.associateElement)==null||a.call(i,this)),l.customElements.whenDefined("media-tooltip").then(()=>Wh(this,on,uu).call(this))}disconnectedCallback(){var e,i;this.disable(),(i=(e=Q(this,Ue))==null?void 0:e.unassociateElement)==null||i.call(e,this),Jr(this,Ue,null),this.removeEventListener("mouseenter",Q(this,bt)),this.removeEventListener("focus",Q(this,bt)),this.removeEventListener("click",Q(this,Ii))}get keysUsed(){return["Enter"," "]}get tooltipPlacement(){return I(this,gt.TOOLTIP_PLACEMENT)}set tooltipPlacement(e){S(this,gt.TOOLTIP_PLACEMENT,e)}get mediaController(){return I(this,M.MEDIA_CONTROLLER)}set mediaController(e){S(this,M.MEDIA_CONTROLLER,e)}get disabled(){return A(this,gt.DISABLED)}set disabled(e){T(this,gt.DISABLED,e)}get noTooltip(){return A(this,gt.NO_TOOLTIP)}set noTooltip(e){T(this,gt.NO_TOOLTIP,e)}handleClick(e){}};Ue=new WeakMap;Ii=new WeakMap;bt=new WeakMap;Si=new WeakMap;jr=new WeakMap;on=new WeakSet;uu=function(){this.addEventListener("mouseenter",Q(this,bt)),this.addEventListener("focus",Q(this,bt)),this.addEventListener("click",Q(this,Ii));let t=this.tooltipPlacement;t&&this.tooltipEl&&(this.tooltipEl.placement=t)};O.shadowRootOptions={mode:"open"};O.getTemplateHTML=$h;O.getSlotTemplateHTML=Vh;O.getTooltipContentHTML=Kh;l.customElements.get("media-chrome-button")||l.customElements.define("media-chrome-button",O);var cu=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.13 3H3.87a.87.87 0 0 0-.87.87v13.26a.87.87 0 0 0 .87.87h3.4L9 16H5V5h16v11h-4l1.72 2h3.4a.87.87 0 0 0 .87-.87V3.87a.87.87 0 0 0-.86-.87Zm-8.75 11.44a.5.5 0 0 0-.76 0l-4.91 5.73a.5.5 0 0 0 .38.83h9.82a.501.501 0 0 0 .38-.83l-4.91-5.73Z"/>
</svg>
`;function Gh(t){return`
    <style>
      :host([${o.MEDIA_IS_AIRPLAYING}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      
      :host(:not([${o.MEDIA_IS_AIRPLAYING}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${o.MEDIA_IS_AIRPLAYING}]) slot[name=tooltip-enter],
      :host(:not([${o.MEDIA_IS_AIRPLAYING}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${cu}</slot>
      <slot name="exit">${cu}</slot>
    </slot>
  `}function qh(){return`
    <slot name="tooltip-enter">${c("start airplay")}</slot>
    <slot name="tooltip-exit">${c("stop airplay")}</slot>
  `}var hu=t=>{let e=t.mediaIsAirplaying?c("stop airplay"):c("start airplay");t.setAttribute("aria-label",e)},Sa=class extends O{static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_IS_AIRPLAYING,o.MEDIA_AIRPLAY_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),hu(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===o.MEDIA_IS_AIRPLAYING&&hu(this)}get mediaIsAirplaying(){return A(this,o.MEDIA_IS_AIRPLAYING)}set mediaIsAirplaying(e){T(this,o.MEDIA_IS_AIRPLAYING,e)}get mediaAirplayUnavailable(){return I(this,o.MEDIA_AIRPLAY_UNAVAILABLE)}set mediaAirplayUnavailable(e){S(this,o.MEDIA_AIRPLAY_UNAVAILABLE,e)}handleClick(){let e=new l.CustomEvent(h.MEDIA_AIRPLAY_REQUEST,{composed:!0,bubbles:!0});this.dispatchEvent(e)}};Sa.getSlotTemplateHTML=Gh;Sa.getTooltipContentHTML=qh;l.customElements.get("media-airplay-button")||l.customElements.define("media-airplay-button",Sa);var Yh=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.83 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.39 9.45a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.92 3.92 0 0 1 .92-2.77 3.18 3.18 0 0 1 2.43-1 2.94 2.94 0 0 1 2.13.78c.364.359.62.813.74 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.17 1.61 1.61 0 0 0-1.29.58 2.79 2.79 0 0 0-.5 1.89 3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.48 1.48 0 0 0 1-.37 2.1 2.1 0 0 0 .59-1.14l1.4.44a3.23 3.23 0 0 1-1.07 1.69Zm7.22 0a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.88 3.88 0 0 1 .93-2.77 3.14 3.14 0 0 1 2.42-1 3 3 0 0 1 2.16.82 2.8 2.8 0 0 1 .73 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.21 1.61 1.61 0 0 0-1.29.58A2.79 2.79 0 0 0 15 12a3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.44 1.44 0 0 0 1-.37 2.1 2.1 0 0 0 .6-1.15l1.4.44a3.17 3.17 0 0 1-1.1 1.7Z"/>
</svg>`,zh=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M17.73 14.09a1.4 1.4 0 0 1-1 .37 1.579 1.579 0 0 1-1.27-.58A3 3 0 0 1 15 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34A2.89 2.89 0 0 0 19 9.07a3 3 0 0 0-2.14-.78 3.14 3.14 0 0 0-2.42 1 3.91 3.91 0 0 0-.93 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.17 3.17 0 0 0 1.07-1.74l-1.4-.45c-.083.43-.3.822-.62 1.12Zm-7.22 0a1.43 1.43 0 0 1-1 .37 1.58 1.58 0 0 1-1.27-.58A3 3 0 0 1 7.76 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34a2.81 2.81 0 0 0-.74-1.32 2.94 2.94 0 0 0-2.13-.78 3.18 3.18 0 0 0-2.43 1 4 4 0 0 0-.92 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.23 3.23 0 0 0 1.07-1.74l-1.4-.45a2.06 2.06 0 0 1-.6 1.07Zm12.32-8.41a2.59 2.59 0 0 0-2.3-2.51C18.72 3.05 15.86 3 13 3c-2.86 0-5.72.05-7.53.17a2.59 2.59 0 0 0-2.3 2.51c-.23 4.207-.23 8.423 0 12.63a2.57 2.57 0 0 0 2.3 2.5c1.81.13 4.67.19 7.53.19 2.86 0 5.72-.06 7.53-.19a2.57 2.57 0 0 0 2.3-2.5c.23-4.207.23-8.423 0-12.63Zm-1.49 12.53a1.11 1.11 0 0 1-.91 1.11c-1.67.11-4.45.18-7.43.18-2.98 0-5.76-.07-7.43-.18a1.11 1.11 0 0 1-.91-1.11c-.21-4.14-.21-8.29 0-12.43a1.11 1.11 0 0 1 .91-1.11C7.24 4.56 10 4.49 13 4.49s5.76.07 7.43.18a1.11 1.11 0 0 1 .91 1.11c.21 4.14.21 8.29 0 12.43Z"/>
</svg>`;function Qh(t){return`
    <style>
      :host([aria-checked="true"]) slot[name=off] {
        display: none !important;
      }

      
      :host(:not([aria-checked="true"])) slot[name=on] {
        display: none !important;
      }

      :host([aria-checked="true"]) slot[name=tooltip-enable],
      :host(:not([aria-checked="true"])) slot[name=tooltip-disable] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="on">${Yh}</slot>
      <slot name="off">${zh}</slot>
    </slot>
  `}function Zh(){return`
    <slot name="tooltip-enable">${c("Enable captions")}</slot>
    <slot name="tooltip-disable">${c("Disable captions")}</slot>
  `}var mu=t=>{t.setAttribute("aria-checked",Vr(t).toString())},Ia=class extends O{static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_SUBTITLES_LIST,o.MEDIA_SUBTITLES_SHOWING]}connectedCallback(){super.connectedCallback(),this.setAttribute("role","button"),this.setAttribute("aria-label",c("closed captions")),mu(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===o.MEDIA_SUBTITLES_SHOWING&&mu(this)}get mediaSubtitlesList(){return pu(this,o.MEDIA_SUBTITLES_LIST)}set mediaSubtitlesList(e){vu(this,o.MEDIA_SUBTITLES_LIST,e)}get mediaSubtitlesShowing(){return pu(this,o.MEDIA_SUBTITLES_SHOWING)}set mediaSubtitlesShowing(e){vu(this,o.MEDIA_SUBTITLES_SHOWING,e)}handleClick(){this.dispatchEvent(new l.CustomEvent(h.MEDIA_TOGGLE_SUBTITLES_REQUEST,{composed:!0,bubbles:!0}))}};Ia.getSlotTemplateHTML=Qh;Ia.getTooltipContentHTML=Zh;var pu=(t,e)=>{let i=t.getAttribute(e);return i?Ht(i):[]},vu=(t,e,i)=>{if(!i?.length){t.removeAttribute(e);return}let a=ot(i);t.getAttribute(e)!==a&&t.setAttribute(e,a)};l.customElements.get("media-captions-button")||l.customElements.define("media-captions-button",Ia);var Xh='<svg aria-hidden="true" viewBox="0 0 24 24"><g><path class="cast_caf_icon_arch0" d="M1,18 L1,21 L4,21 C4,19.3 2.66,18 1,18 L1,18 Z"/><path class="cast_caf_icon_arch1" d="M1,14 L1,16 C3.76,16 6,18.2 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z"/><path class="cast_caf_icon_arch2" d="M1,10 L1,12 C5.97,12 10,16.0 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z"/><path class="cast_caf_icon_box" d="M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z"/></g></svg>',Jh='<svg aria-hidden="true" viewBox="0 0 24 24"><g><path class="cast_caf_icon_arch0" d="M1,18 L1,21 L4,21 C4,19.3 2.66,18 1,18 L1,18 Z"/><path class="cast_caf_icon_arch1" d="M1,14 L1,16 C3.76,16 6,18.2 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z"/><path class="cast_caf_icon_arch2" d="M1,10 L1,12 C5.97,12 10,16.0 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z"/><path class="cast_caf_icon_box" d="M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z"/><path class="cast_caf_icon_boxfill" d="M5,7 L5,8.63 C8,8.6 13.37,14 13.37,17 L19,17 L19,7 Z"/></g></svg>';function jh(t){return`
    <style>
      :host([${o.MEDIA_IS_CASTING}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      
      :host(:not([${o.MEDIA_IS_CASTING}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${o.MEDIA_IS_CASTING}]) slot[name=tooltip-enter],
      :host(:not([${o.MEDIA_IS_CASTING}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${Xh}</slot>
      <slot name="exit">${Jh}</slot>
    </slot>
  `}function em(){return`
    <slot name="tooltip-enter">${c("Start casting")}</slot>
    <slot name="tooltip-exit">${c("Stop casting")}</slot>
  `}var fu=t=>{let e=t.mediaIsCasting?c("stop casting"):c("start casting");t.setAttribute("aria-label",e)},Ma=class extends O{static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_IS_CASTING,o.MEDIA_CAST_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),fu(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===o.MEDIA_IS_CASTING&&fu(this)}get mediaIsCasting(){return A(this,o.MEDIA_IS_CASTING)}set mediaIsCasting(e){T(this,o.MEDIA_IS_CASTING,e)}get mediaCastUnavailable(){return I(this,o.MEDIA_CAST_UNAVAILABLE)}set mediaCastUnavailable(e){S(this,o.MEDIA_CAST_UNAVAILABLE,e)}handleClick(){let e=this.mediaIsCasting?h.MEDIA_EXIT_CAST_REQUEST:h.MEDIA_ENTER_CAST_REQUEST;this.dispatchEvent(new l.CustomEvent(e,{composed:!0,bubbles:!0}))}};Ma.getSlotTemplateHTML=jh;Ma.getTooltipContentHTML=em;l.customElements.get("media-cast-button")||l.customElements.define("media-cast-button",Ma);var pn=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Kt=(t,e,i)=>(pn(t,e,"read from private field"),i?i.call(t):e.get(t)),lt=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},vn=(t,e,i,a)=>(pn(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),Vt=(t,e,i)=>(pn(t,e,"access private method"),i),ts,La,Gt,es,ln,dn,Eu,un,gu,cn,bu,hn,_u,mn,Au;function tm(t){return`
    <style>
      :host {
        font: var(--media-font,
          var(--media-font-weight, normal)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        display: var(--media-dialog-display, inline-flex);
        justify-content: center;
        align-items: center;
        
        transition-behavior: allow-discrete;
        visibility: hidden;
        opacity: 0;
        transform: translateY(2px) scale(.99);
        pointer-events: none;
      }

      :host([open]) {
        transition: display .2s, visibility 0s, opacity .2s ease-out, transform .15s ease-out;
        visibility: visible;
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }

      #content {
        display: flex;
        position: relative;
        box-sizing: border-box;
        width: min(320px, 100%);
        word-wrap: break-word;
        max-height: 100%;
        overflow: auto;
        text-align: center;
        line-height: 1.4;
      }
    </style>
    ${this.getSlotTemplateHTML(t)}
  `}function im(t){return`
    <slot id="content"></slot>
  `}var wa={OPEN:"open",ANCHOR:"anchor"},Pe=class extends l.HTMLElement{constructor(){super(),lt(this,es),lt(this,dn),lt(this,un),lt(this,cn),lt(this,hn),lt(this,mn),lt(this,ts,!1),lt(this,La,null),lt(this,Gt,null)}static get observedAttributes(){return[wa.OPEN,wa.ANCHOR]}get open(){return A(this,wa.OPEN)}set open(e){T(this,wa.OPEN,e)}handleEvent(e){switch(e.type){case"invoke":Vt(this,cn,bu).call(this,e);break;case"focusout":Vt(this,hn,_u).call(this,e);break;case"keydown":Vt(this,mn,Au).call(this,e);break}}connectedCallback(){Vt(this,es,ln).call(this),this.role||(this.role="dialog"),this.addEventListener("invoke",this),this.addEventListener("focusout",this),this.addEventListener("keydown",this)}disconnectedCallback(){this.removeEventListener("invoke",this),this.removeEventListener("focusout",this),this.removeEventListener("keydown",this)}attributeChangedCallback(e,i,a){Vt(this,es,ln).call(this),e===wa.OPEN&&a!==i&&(this.open?Vt(this,dn,Eu).call(this):Vt(this,un,gu).call(this))}focus(){vn(this,La,pa());let e=!this.dispatchEvent(new Event("focus",{composed:!0,cancelable:!0})),i=!this.dispatchEvent(new Event("focusin",{composed:!0,bubbles:!0,cancelable:!0}));if(e||i)return;let a=this.querySelector('[autofocus], [tabindex]:not([tabindex="-1"]), [role="menu"]');a?.focus()}get keysUsed(){return["Escape","Tab"]}};ts=new WeakMap;La=new WeakMap;Gt=new WeakMap;es=new WeakSet;ln=function(){if(!Kt(this,ts)&&(vn(this,ts,!0),!this.shadowRoot)){this.attachShadow(this.constructor.shadowRootOptions);let t=$(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(t),queueMicrotask(()=>{let{style:e}=W(this.shadowRoot,":host");e.setProperty("transition","display .15s, visibility .15s, opacity .15s ease-in, transform .15s ease-in")})}};dn=new WeakSet;Eu=function(){var t;(t=Kt(this,Gt))==null||t.setAttribute("aria-expanded","true"),this.dispatchEvent(new Event("open",{composed:!0,bubbles:!0})),this.addEventListener("transitionend",()=>this.focus(),{once:!0})};un=new WeakSet;gu=function(){var t;(t=Kt(this,Gt))==null||t.setAttribute("aria-expanded","false"),this.dispatchEvent(new Event("close",{composed:!0,bubbles:!0}))};cn=new WeakSet;bu=function(t){vn(this,Gt,t.relatedTarget),ae(this,t.relatedTarget)||(this.open=!this.open)};hn=new WeakSet;_u=function(t){var e;ae(this,t.relatedTarget)||((e=Kt(this,La))==null||e.focus(),Kt(this,Gt)&&Kt(this,Gt)!==t.relatedTarget&&this.open&&(this.open=!1))};mn=new WeakSet;Au=function(t){var e,i,a,r,s;let{key:n,ctrlKey:d,altKey:u,metaKey:p}=t;d||u||p||this.keysUsed.includes(n)&&(t.preventDefault(),t.stopPropagation(),n==="Tab"?(t.shiftKey?(i=(e=this.previousElementSibling)==null?void 0:e.focus)==null||i.call(e):(r=(a=this.nextElementSibling)==null?void 0:a.focus)==null||r.call(a),this.blur()):n==="Escape"&&((s=Kt(this,La))==null||s.focus(),this.open=!1))};Pe.shadowRootOptions={mode:"open"};Pe.getTemplateHTML=tm;Pe.getSlotTemplateHTML=im;l.customElements.get("media-chrome-dialog")||l.customElements.define("media-chrome-dialog",Pe);var Tn=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},G=(t,e,i)=>(Tn(t,e,"read from private field"),i?i.call(t):e.get(t)),te=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},_t=(t,e,i,a)=>(Tn(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),Ie=(t,e,i)=>(Tn(t,e,"access private method"),i),Ne,cs,is,as,Me,ds,rs,ss,os,kn,Tu,ns,fn,ls,En,us,yn,gn,ku,bn,yu,_n,Su,An,Iu;function am(t){return`
    <style>
      :host {
        --_focus-box-shadow: var(--media-focus-box-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
        --_media-range-padding: var(--media-range-padding, var(--media-control-padding, 10px));

        box-shadow: var(--_focus-visible-box-shadow, none);
        background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        height: calc(var(--media-control-height, 24px) + 2 * var(--_media-range-padding));
        display: inline-flex;
        align-items: center;
        
        vertical-align: middle;
        box-sizing: border-box;
        position: relative;
        width: 100px;
        transition: background .15s linear;
        cursor: var(--media-cursor, pointer);
        pointer-events: auto;
        touch-action: none; 
      }

      
      input[type=range]:focus {
        outline: 0;
      }
      input[type=range]:focus::-webkit-slider-runnable-track {
        outline: 0;
      }

      :host(:hover) {
        background: var(--media-control-hover-background, rgb(50 50 70 / .7));
      }

      #leftgap {
        padding-left: var(--media-range-padding-left, var(--_media-range-padding));
      }

      #rightgap {
        padding-right: var(--media-range-padding-right, var(--_media-range-padding));
      }

      #startpoint,
      #endpoint {
        position: absolute;
      }

      #endpoint {
        right: 0;
      }

      #container {
        
        width: var(--media-range-track-width, 100%);
        transform: translate(var(--media-range-track-translate-x, 0px), var(--media-range-track-translate-y, 0px));
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
        min-width: 40px;
      }

      #range {
        
        display: var(--media-time-range-hover-display, block);
        bottom: var(--media-time-range-hover-bottom, 0);
        height: var(--media-time-range-hover-height, max(100% , 25px));
        width: 100%;
        position: absolute;
        cursor: var(--media-cursor, pointer);

        -webkit-appearance: none; 
        -webkit-tap-highlight-color: transparent;
        background: transparent; 
        margin: 0;
        z-index: 1;
      }

      @media (hover: hover) {
        #range {
          bottom: var(--media-time-range-hover-bottom, 0);
          height: var(--media-time-range-hover-height, max(100%, 20px));
        }
      }

      
      
      #range::-webkit-slider-thumb {
        -webkit-appearance: none;
        background: transparent;
        width: .1px;
        height: .1px;
      }

      
      #range::-moz-range-thumb {
        background: transparent;
        border: transparent;
        width: .1px;
        height: .1px;
      }

      #appearance {
        height: var(--media-range-track-height, 4px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        position: absolute;
        
        will-change: transform;
      }

      #track {
        background: var(--media-range-track-background, rgb(255 255 255 / .2));
        border-radius: var(--media-range-track-border-radius, 1px);
        border: var(--media-range-track-border, none);
        outline: var(--media-range-track-outline);
        outline-offset: var(--media-range-track-outline-offset);
        backdrop-filter: var(--media-range-track-backdrop-filter);
        -webkit-backdrop-filter: var(--media-range-track-backdrop-filter);
        box-shadow: var(--media-range-track-box-shadow, none);
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      #progress,
      #pointer {
        position: absolute;
        height: 100%;
        will-change: width;
      }

      #progress {
        background: var(--media-range-bar-color, var(--media-primary-color, rgb(238 238 238)));
        transition: var(--media-range-track-transition);
      }

      #pointer {
        background: var(--media-range-track-pointer-background);
        border-right: var(--media-range-track-pointer-border-right);
        transition: visibility .25s, opacity .25s;
        visibility: hidden;
        opacity: 0;
      }

      @media (hover: hover) {
        :host(:hover) #pointer {
          transition: visibility .5s, opacity .5s;
          visibility: visible;
          opacity: 1;
        }
      }

      #thumb,
      ::slotted([slot=thumb]) {
        width: var(--media-range-thumb-width, 10px);
        height: var(--media-range-thumb-height, 10px);
        transition: var(--media-range-thumb-transition);
        transform: var(--media-range-thumb-transform, none);
        opacity: var(--media-range-thumb-opacity, 1);
        translate: -50%;
        position: absolute;
        left: 0;
        cursor: var(--media-cursor, pointer);
      }

      #thumb {
        border-radius: var(--media-range-thumb-border-radius, 10px);
        background: var(--media-range-thumb-background, var(--media-primary-color, rgb(238 238 238)));
        box-shadow: var(--media-range-thumb-box-shadow, 1px 1px 1px transparent);
        border: var(--media-range-thumb-border, none);
      }

      :host([disabled]) #thumb {
        background-color: #777;
      }

      .segments #appearance {
        height: var(--media-range-segment-hover-height, 7px);
      }

      #track {
        clip-path: url(#segments-clipping);
      }

      #segments {
        --segments-gap: var(--media-range-segments-gap, 2px);
        position: absolute;
        width: 100%;
        height: 100%;
      }

      #segments-clipping {
        transform: translateX(calc(var(--segments-gap) / 2));
      }

      #segments-clipping:empty {
        display: none;
      }

      #segments-clipping rect {
        height: var(--media-range-track-height, 4px);
        y: calc((var(--media-range-segment-hover-height, 7px) - var(--media-range-track-height, 4px)) / 2);
        transition: var(--media-range-segment-transition, transform .1s ease-in-out);
        transform: var(--media-range-segment-transform, scaleY(1));
        transform-origin: center;
      }

      /* Visible label for accessibility - positioned off-screen but technically visible (Firefox requires visible labels) */
      #range-label {
        position: absolute;
        left: -10000px;
        background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        pointer-events: none;
      }
    </style>
    <div id="leftgap"></div>
    <div id="container">
      <div id="startpoint"></div>
      <div id="endpoint"></div>
      <div id="appearance">
        <div id="track" part="track">
          <div id="pointer"></div>
          <div id="progress" part="progress"></div>
        </div>
        <slot name="thumb">
          <div id="thumb" part="thumb"></div>
        </slot>
        <svg id="segments" aria-hidden="true"><clipPath id="segments-clipping"></clipPath></svg>
      </div>
        <input id="range" type="range" min="0" max="1" step="any" value="0">
        <label for="range" id="range-label"></label>

      ${this.getContainerTemplateHTML(t)}
    </div>
    <div id="rightgap"></div>
  `}function rm(t){return""}var He=class extends l.HTMLElement{constructor(){if(super(),te(this,kn),te(this,ns),te(this,ls),te(this,us),te(this,gn),te(this,bn),te(this,_n),te(this,An),te(this,Ne,void 0),te(this,cs,void 0),te(this,is,void 0),te(this,as,void 0),te(this,Me,{}),te(this,ds,[]),te(this,rs,()=>{if(this.range.matches(":focus-visible")){let{style:e}=W(this.shadowRoot,":host");e.setProperty("--_focus-visible-box-shadow","var(--_focus-box-shadow)")}}),te(this,ss,()=>{let{style:e}=W(this.shadowRoot,":host");e.removeProperty("--_focus-visible-box-shadow")}),te(this,os,()=>{let e=this.shadowRoot.querySelector("#segments-clipping");e&&e.parentNode.append(e)}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=$(this.attributes),i=this.constructor.getTemplateHTML(e);this.shadowRoot.setHTMLUnsafe?this.shadowRoot.setHTMLUnsafe(i):this.shadowRoot.innerHTML=i}this.container=this.shadowRoot.querySelector("#container"),_t(this,is,this.shadowRoot.querySelector("#startpoint")),_t(this,as,this.shadowRoot.querySelector("#endpoint")),this.range=this.shadowRoot.querySelector("#range"),this.appearance=this.shadowRoot.querySelector("#appearance")}static get observedAttributes(){return["disabled","aria-disabled",M.MEDIA_CONTROLLER]}attributeChangedCallback(e,i,a){var r,s,n,d,u;e===M.MEDIA_CONTROLLER?(i&&((s=(r=G(this,Ne))==null?void 0:r.unassociateElement)==null||s.call(r,this),_t(this,Ne,null)),a&&this.isConnected&&(_t(this,Ne,(n=this.getRootNode())==null?void 0:n.getElementById(a)),(u=(d=G(this,Ne))==null?void 0:d.associateElement)==null||u.call(d,this))):(e==="disabled"||e==="aria-disabled"&&i!==a)&&(a==null?(this.range.removeAttribute(e),Ie(this,ns,fn).call(this)):(this.range.setAttribute(e,a),Ie(this,ls,En).call(this)))}connectedCallback(){var e,i,a;let{style:r}=W(this.shadowRoot,":host");r.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`),G(this,Me).pointer=W(this.shadowRoot,"#pointer"),G(this,Me).progress=W(this.shadowRoot,"#progress"),G(this,Me).thumb=W(this.shadowRoot,'#thumb, ::slotted([slot="thumb"])'),G(this,Me).activeSegment=W(this.shadowRoot,"#segments-clipping rect:nth-child(0)");let s=this.getAttribute(M.MEDIA_CONTROLLER);s&&(_t(this,Ne,(e=this.getRootNode())==null?void 0:e.getElementById(s)),(a=(i=G(this,Ne))==null?void 0:i.associateElement)==null||a.call(i,this)),this.updateBar(),this.shadowRoot.addEventListener("focusin",G(this,rs)),this.shadowRoot.addEventListener("focusout",G(this,ss)),Ie(this,ns,fn).call(this),at(this.container,G(this,os))}disconnectedCallback(){var e,i;Ie(this,ls,En).call(this),(i=(e=G(this,Ne))==null?void 0:e.unassociateElement)==null||i.call(e,this),_t(this,Ne,null),this.shadowRoot.removeEventListener("focusin",G(this,rs)),this.shadowRoot.removeEventListener("focusout",G(this,ss)),rt(this.container,G(this,os))}updatePointerBar(e){var i;(i=G(this,Me).pointer)==null||i.style.setProperty("width",`${this.getPointerRatio(e)*100}%`)}updateBar(){var e,i;let a=this.range.valueAsNumber*100;(e=G(this,Me).progress)==null||e.style.setProperty("width",`${a}%`),(i=G(this,Me).thumb)==null||i.style.setProperty("left",`${a}%`)}updateSegments(e){let i=this.shadowRoot.querySelector("#segments-clipping");if(i.textContent="",this.container.classList.toggle("segments",!!e?.length),!e?.length)return;let a=[...new Set([+this.range.min,...e.flatMap(s=>[s.start,s.end]),+this.range.max])];_t(this,ds,[...a]);let r=a.pop();for(let[s,n]of a.entries()){let[d,u]=[s===0,s===a.length-1],p=d?"calc(var(--segments-gap) / -1)":`${n*100}%`,b=`calc(${((u?r:a[s+1])-n)*100}%${d||u?"":" - var(--segments-gap)"})`,f=N.createElementNS("http://www.w3.org/2000/svg","rect"),v=va(this.shadowRoot,`#segments-clipping rect:nth-child(${s+1})`);v.style.setProperty("x",p),v.style.setProperty("width",b),i.append(f)}}getPointerRatio(e){return Od(e.clientX,e.clientY,G(this,is).getBoundingClientRect(),G(this,as).getBoundingClientRect())}get dragging(){return this.hasAttribute("dragging")}handleEvent(e){switch(e.type){case"pointermove":Ie(this,An,Iu).call(this,e);break;case"input":this.updateBar();break;case"pointerenter":Ie(this,gn,ku).call(this,e);break;case"pointerdown":Ie(this,us,yn).call(this,e);break;case"pointerup":Ie(this,bn,yu).call(this);break;case"pointerleave":Ie(this,_n,Su).call(this);break}}get keysUsed(){return["ArrowUp","ArrowRight","ArrowDown","ArrowLeft"]}};Ne=new WeakMap;cs=new WeakMap;is=new WeakMap;as=new WeakMap;Me=new WeakMap;ds=new WeakMap;rs=new WeakMap;ss=new WeakMap;os=new WeakMap;kn=new WeakSet;Tu=function(t){let e=G(this,Me).activeSegment;if(!e)return;let i=this.getPointerRatio(t),r=`#segments-clipping rect:nth-child(${G(this,ds).findIndex((s,n,d)=>{let u=d[n+1];return u!=null&&i>=s&&i<=u})+1})`;(e.selectorText!=r||!e.style.transform)&&(e.selectorText=r,e.style.setProperty("transform","var(--media-range-segment-hover-transform, scaleY(2))"))};ns=new WeakSet;fn=function(){this.hasAttribute("disabled")||!this.isConnected||(this.addEventListener("input",this),this.addEventListener("pointerdown",this),this.addEventListener("pointerenter",this))};ls=new WeakSet;En=function(){var t,e;this.removeEventListener("input",this),this.removeEventListener("pointerdown",this),this.removeEventListener("pointerenter",this),this.removeEventListener("pointerleave",this),(t=l.window)==null||t.removeEventListener("pointerup",this),(e=l.window)==null||e.removeEventListener("pointermove",this)};us=new WeakSet;yn=function(t){var e;_t(this,cs,t.composedPath().includes(this.range)),(e=l.window)==null||e.addEventListener("pointerup",this,{once:!0})};gn=new WeakSet;ku=function(t){var e;t.pointerType!=="mouse"&&Ie(this,us,yn).call(this,t),this.addEventListener("pointerleave",this,{once:!0}),(e=l.window)==null||e.addEventListener("pointermove",this)};bn=new WeakSet;yu=function(){var t;(t=l.window)==null||t.removeEventListener("pointerup",this),this.toggleAttribute("dragging",!1),this.range.disabled=this.hasAttribute("disabled")};_n=new WeakSet;Su=function(){var t,e;this.removeEventListener("pointerleave",this),(t=l.window)==null||t.removeEventListener("pointermove",this),this.toggleAttribute("dragging",!1),this.range.disabled=this.hasAttribute("disabled"),(e=G(this,Me).activeSegment)==null||e.style.removeProperty("transform")};An=new WeakSet;Iu=function(t){t.pointerType==="pen"&&t.buttons===0||(this.toggleAttribute("dragging",t.buttons===1||t.pointerType!=="mouse"),this.updatePointerBar(t),Ie(this,kn,Tu).call(this,t),this.dragging&&(t.pointerType!=="mouse"||!G(this,cs))&&(this.range.disabled=!0,this.range.valueAsNumber=this.getPointerRatio(t),this.range.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))))};He.shadowRootOptions={mode:"open"};He.getTemplateHTML=am;He.getContainerTemplateHTML=rm;l.customElements.get("media-chrome-range")||l.customElements.define("media-chrome-range",He);var Mu=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},hs=(t,e,i)=>(Mu(t,e,"read from private field"),i?i.call(t):e.get(t)),sm=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},ms=(t,e,i,a)=>(Mu(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),Fe;function om(t){return`
    <style>
      :host {
        
        box-sizing: border-box;
        display: var(--media-control-display, var(--media-control-bar-display, inline-flex));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        --media-loading-indicator-icon-height: 44px;
      }

      ::slotted(media-time-range),
      ::slotted(media-volume-range) {
        min-height: 100%;
      }

      ::slotted(media-time-range),
      ::slotted(media-clip-selector) {
        flex-grow: 1;
      }

      ::slotted([role="menu"]) {
        position: absolute;
      }
    </style>

    <slot></slot>
  `}var Ca=class extends l.HTMLElement{constructor(){if(super(),sm(this,Fe,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=$(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[M.MEDIA_CONTROLLER]}attributeChangedCallback(e,i,a){var r,s,n,d,u;e===M.MEDIA_CONTROLLER&&(i&&((s=(r=hs(this,Fe))==null?void 0:r.unassociateElement)==null||s.call(r,this),ms(this,Fe,null)),a&&this.isConnected&&(ms(this,Fe,(n=this.getRootNode())==null?void 0:n.getElementById(a)),(u=(d=hs(this,Fe))==null?void 0:d.associateElement)==null||u.call(d,this)))}connectedCallback(){var e,i,a;let r=this.getAttribute(M.MEDIA_CONTROLLER);r&&(ms(this,Fe,(e=this.getRootNode())==null?void 0:e.getElementById(r)),(a=(i=hs(this,Fe))==null?void 0:i.associateElement)==null||a.call(i,this))}disconnectedCallback(){var e,i;(i=(e=hs(this,Fe))==null?void 0:e.unassociateElement)==null||i.call(e,this),ms(this,Fe,null)}};Fe=new WeakMap;Ca.shadowRootOptions={mode:"open"};Ca.getTemplateHTML=om;l.customElements.get("media-control-bar")||l.customElements.define("media-control-bar",Ca);var wu=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},ps=(t,e,i)=>(wu(t,e,"read from private field"),i?i.call(t):e.get(t)),nm=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},vs=(t,e,i,a)=>(wu(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),Be;function lm(t,e={}){return`
    <style>
      :host {
        font: var(--media-font,
          var(--media-font-weight, normal)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        background: var(--media-text-background, var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7))));
        padding: var(--media-control-padding, 10px);
        display: inline-flex;
        justify-content: center;
        align-items: center;
        vertical-align: middle;
        box-sizing: border-box;
        text-align: center;
        pointer-events: auto;
      }

      
      :host(:focus-visible) {
        box-shadow: var(--media-focus-box-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
        outline: 0;
      }

      
      :host(:where(:focus)) {
        box-shadow: none;
        outline: 0;
      }
    </style>

    ${this.getSlotTemplateHTML(t,e)}
  `}function dm(t,e){return`
    <slot></slot>
  `}var le=class extends l.HTMLElement{constructor(){if(super(),nm(this,Be,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=$(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[M.MEDIA_CONTROLLER]}attributeChangedCallback(e,i,a){var r,s,n,d,u;e===M.MEDIA_CONTROLLER&&(i&&((s=(r=ps(this,Be))==null?void 0:r.unassociateElement)==null||s.call(r,this),vs(this,Be,null)),a&&this.isConnected&&(vs(this,Be,(n=this.getRootNode())==null?void 0:n.getElementById(a)),(u=(d=ps(this,Be))==null?void 0:d.associateElement)==null||u.call(d,this)))}connectedCallback(){var e,i,a;let{style:r}=W(this.shadowRoot,":host");r.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`);let s=this.getAttribute(M.MEDIA_CONTROLLER);s&&(vs(this,Be,(e=this.getRootNode())==null?void 0:e.getElementById(s)),(a=(i=ps(this,Be))==null?void 0:i.associateElement)==null||a.call(i,this))}disconnectedCallback(){var e,i;(i=(e=ps(this,Be))==null?void 0:e.unassociateElement)==null||i.call(e,this),vs(this,Be,null)}};Be=new WeakMap;le.shadowRootOptions={mode:"open"};le.getTemplateHTML=lm;le.getSlotTemplateHTML=dm;l.customElements.get("media-text-display")||l.customElements.define("media-text-display",le);var Cu=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Lu=(t,e,i)=>(Cu(t,e,"read from private field"),i?i.call(t):e.get(t)),um=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},cm=(t,e,i,a)=>(Cu(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),Da;function hm(t,e){return`
    <slot>${Ae(e.mediaDuration)}</slot>
  `}var fs=class extends le{constructor(){var e;super(),um(this,Da,void 0),cm(this,Da,this.shadowRoot.querySelector("slot")),Lu(this,Da).textContent=Ae((e=this.mediaDuration)!=null?e:0)}static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_DURATION]}attributeChangedCallback(e,i,a){e===o.MEDIA_DURATION&&(Lu(this,Da).textContent=Ae(+a)),super.attributeChangedCallback(e,i,a)}get mediaDuration(){return L(this,o.MEDIA_DURATION)}set mediaDuration(e){R(this,o.MEDIA_DURATION,e)}};Da=new WeakMap;fs.getSlotTemplateHTML=hm;l.customElements.get("media-duration-display")||l.customElements.define("media-duration-display",fs);var mm={2:c("Network Error"),3:c("Decode Error"),4:c("Source Not Supported"),5:c("Encryption Error")},pm={2:c("A network error caused the media download to fail."),3:c("A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format."),4:c("An unsupported error occurred. The server or network failed, or your browser does not support this format."),5:c("The media is encrypted and there are no keys to decrypt it.")},Es=t=>{var e,i;return t.code===1?null:{title:(e=mm[t.code])!=null?e:`Error ${t.code}`,message:(i=pm[t.code])!=null?i:t.message}};var Ru=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},vm=(t,e,i)=>(Ru(t,e,"read from private field"),i?i.call(t):e.get(t)),fm=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Em=(t,e,i,a)=>(Ru(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),gs;function gm(t){return`
    <style>
      :host {
        background: rgb(20 20 30 / .8);
      }

      #content {
        display: block;
        padding: 1.2em 1.5em;
      }

      h3,
      p {
        margin-block: 0 .3em;
      }
    </style>
    <slot name="error-${t.mediaerrorcode}" id="content">
      ${xu({code:+t.mediaerrorcode,message:t.mediaerrormessage})}
    </slot>
  `}function bm(t){return t.code&&Es(t)!==null}function xu(t){var e;let{title:i,message:a}=(e=Es(t))!=null?e:{},r="";return i&&(r+=`<slot name="error-${t.code}-title"><h3>${i}</h3></slot>`),a&&(r+=`<slot name="error-${t.code}-message"><p>${a}</p></slot>`),r}var Du=[o.MEDIA_ERROR_CODE,o.MEDIA_ERROR_MESSAGE],Ra=class extends Pe{constructor(){super(...arguments),fm(this,gs,null)}static get observedAttributes(){return[...super.observedAttributes,...Du]}formatErrorMessage(e){return this.constructor.formatErrorMessage(e)}attributeChangedCallback(e,i,a){var r;if(super.attributeChangedCallback(e,i,a),!Du.includes(e))return;let s=(r=this.mediaError)!=null?r:{code:this.mediaErrorCode,message:this.mediaErrorMessage};if(this.open=bm(s),this.open&&(this.shadowRoot.querySelector("slot").name=`error-${this.mediaErrorCode}`,this.shadowRoot.querySelector("#content").innerHTML=this.formatErrorMessage(s),!this.hasAttribute("aria-label"))){let{title:n}=Es(s);n&&this.setAttribute("aria-label",n)}}get mediaError(){return vm(this,gs)}set mediaError(e){Em(this,gs,e)}get mediaErrorCode(){return L(this,"mediaerrorcode")}set mediaErrorCode(e){R(this,"mediaerrorcode",e)}get mediaErrorMessage(){return I(this,"mediaerrormessage")}set mediaErrorMessage(e){S(this,"mediaerrormessage",e)}};gs=new WeakMap;Ra.getSlotTemplateHTML=gm;Ra.formatErrorMessage=xu;l.customElements.get("media-error-dialog")||l.customElements.define("media-error-dialog",Ra);var _m=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},At=(t,e,i)=>(_m(t,e,"read from private field"),i?i.call(t):e.get(t)),Ou=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Mi,wi;function Am(t){return`
    <style>
      :host {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
        background: rgb(20 20 30 / .8);
        backdrop-filter: blur(10px);
      }

      #content {
        display: block;
        width: clamp(400px, 40vw, 700px);
        max-width: 90vw;
        text-align: left;
      }

      h2 {
        margin: 0 0 1.5rem 0;
        font-size: 1.5rem;
        font-weight: 500;
        text-align: center;
      }

      .shortcuts-table {
        width: 100%;
        border-collapse: collapse;
      }

      .shortcuts-table tr {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .shortcuts-table tr:last-child {
        border-bottom: none;
      }

      .shortcuts-table td {
        padding: 0.75rem 0.5rem;
      }

      .shortcuts-table td:first-child {
        text-align: right;
        padding-right: 1rem;
        width: 40%;
        min-width: 120px;
      }

      .shortcuts-table td:last-child {
        padding-left: 1rem;
      }

      .key {
        display: inline-block;
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        padding: 0.25rem 0.5rem;
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
        font-weight: 500;
        min-width: 1.5rem;
        text-align: center;
        margin: 0 0.2rem;
      }

      .description {
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.95rem;
      }

      .key-combo {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.3rem;
      }

      .key-separator {
        color: rgba(255, 255, 255, 0.5);
        font-size: 0.9rem;
      }
    </style>
    <slot id="content">
      ${Tm()}
    </slot>
  `}function Tm(){return`
    <h2>Keyboard Shortcuts</h2>
    <table class="shortcuts-table">${[{keys:["Space","k"],description:"Toggle Playback"},{keys:["m"],description:"Toggle mute"},{keys:["f"],description:"Toggle fullscreen"},{keys:["c"],description:"Toggle captions or subtitles, if available"},{keys:["p"],description:"Toggle Picture in Picture"},{keys:["\u2190","j"],description:"Seek back 10s"},{keys:["\u2192","l"],description:"Seek forward 10s"},{keys:["\u2191"],description:"Turn volume up"},{keys:["\u2193"],description:"Turn volume down"},{keys:["< (SHIFT+,)"],description:"Decrease playback rate"},{keys:["> (SHIFT+.)"],description:"Increase playback rate"}].map(({keys:i,description:a})=>`
      <tr>
        <td>
          <div class="key-combo">${i.map((s,n)=>n>0?`<span class="key-separator">or</span><span class="key">${s}</span>`:`<span class="key">${s}</span>`).join("")}</div>
        </td>
        <td class="description">${a}</td>
      </tr>
    `).join("")}</table>
  `}var bs=class extends Pe{constructor(){super(...arguments),Ou(this,Mi,e=>{var i;if(!this.open)return;let a=(i=this.shadowRoot)==null?void 0:i.querySelector("#content");if(!a)return;let r=e.composedPath(),s=r[0]===this||r.includes(this),n=r.includes(a);s&&!n&&(this.open=!1)}),Ou(this,wi,e=>{if(!this.open)return;let i=e.shiftKey&&(e.key==="/"||e.key==="?");(e.key==="Escape"||i)&&!e.ctrlKey&&!e.altKey&&!e.metaKey&&(this.open=!1,e.preventDefault(),e.stopPropagation())})}connectedCallback(){super.connectedCallback(),this.open&&(this.addEventListener("click",At(this,Mi)),document.addEventListener("keydown",At(this,wi)))}disconnectedCallback(){this.removeEventListener("click",At(this,Mi)),document.removeEventListener("keydown",At(this,wi))}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e==="open"&&(this.open?(this.addEventListener("click",At(this,Mi)),document.addEventListener("keydown",At(this,wi))):(this.removeEventListener("click",At(this,Mi)),document.removeEventListener("keydown",At(this,wi))))}};Mi=new WeakMap;wi=new WeakMap;bs.getSlotTemplateHTML=Am;l.customElements.get("media-keyboard-shortcuts-dialog")||l.customElements.define("media-keyboard-shortcuts-dialog",bs);var Pu=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},km=(t,e,i)=>(Pu(t,e,"read from private field"),i?i.call(t):e.get(t)),ym=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Sm=(t,e,i,a)=>(Pu(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),_s,Im=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M16 3v2.5h3.5V9H22V3h-6ZM4 9h2.5V5.5H10V3H4v6Zm15.5 9.5H16V21h6v-6h-2.5v3.5ZM6.5 15H4v6h6v-2.5H6.5V15Z"/>
</svg>`,Mm=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M18.5 6.5V3H16v6h6V6.5h-3.5ZM16 21h2.5v-3.5H22V15h-6v6ZM4 17.5h3.5V21H10v-6H4v2.5Zm3.5-11H4V9h6V3H7.5v3.5Z"/>
</svg>`;function wm(t){return`
    <style>
      :host([${o.MEDIA_IS_FULLSCREEN}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      
      :host(:not([${o.MEDIA_IS_FULLSCREEN}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${o.MEDIA_IS_FULLSCREEN}]) slot[name=tooltip-enter],
      :host(:not([${o.MEDIA_IS_FULLSCREEN}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${Im}</slot>
      <slot name="exit">${Mm}</slot>
    </slot>
  `}function Lm(){return`
    <slot name="tooltip-enter">${c("Enter fullscreen mode")}</slot>
    <slot name="tooltip-exit">${c("Exit fullscreen mode")}</slot>
  `}var Uu=t=>{let e=t.mediaIsFullscreen?c("exit fullscreen mode"):c("enter fullscreen mode");t.setAttribute("aria-label",e)},xa=class extends O{constructor(){super(...arguments),ym(this,_s,null)}static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_IS_FULLSCREEN,o.MEDIA_FULLSCREEN_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),Uu(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===o.MEDIA_IS_FULLSCREEN&&Uu(this)}get mediaFullscreenUnavailable(){return I(this,o.MEDIA_FULLSCREEN_UNAVAILABLE)}set mediaFullscreenUnavailable(e){S(this,o.MEDIA_FULLSCREEN_UNAVAILABLE,e)}get mediaIsFullscreen(){return A(this,o.MEDIA_IS_FULLSCREEN)}set mediaIsFullscreen(e){T(this,o.MEDIA_IS_FULLSCREEN,e)}handleClick(e){Sm(this,_s,e);let i=km(this,_s)instanceof PointerEvent,a=this.mediaIsFullscreen?new l.CustomEvent(h.MEDIA_EXIT_FULLSCREEN_REQUEST,{composed:!0,bubbles:!0}):new l.CustomEvent(h.MEDIA_ENTER_FULLSCREEN_REQUEST,{composed:!0,bubbles:!0,detail:i});this.dispatchEvent(a)}};_s=new WeakMap;xa.getSlotTemplateHTML=wm;xa.getTooltipContentHTML=Lm;l.customElements.get("media-fullscreen-button")||l.customElements.define("media-fullscreen-button",xa);var{MEDIA_TIME_IS_LIVE:As,MEDIA_PAUSED:Oa}=o,{MEDIA_SEEK_TO_LIVE_REQUEST:Cm,MEDIA_PLAY_REQUEST:Dm}=h,Rm='<svg viewBox="0 0 6 12" aria-hidden="true"><circle cx="3" cy="6" r="2"></circle></svg>';function xm(t){return`
    <style>
      :host { --media-tooltip-display: none; }
      
      slot[name=indicator] > *,
      :host ::slotted([slot=indicator]) {
        
        min-width: auto;
        fill: var(--media-live-button-icon-color, rgb(140, 140, 140));
        color: var(--media-live-button-icon-color, rgb(140, 140, 140));
      }

      :host([${As}]:not([${Oa}])) slot[name=indicator] > *,
      :host([${As}]:not([${Oa}])) ::slotted([slot=indicator]) {
        fill: var(--media-live-button-indicator-color, rgb(255, 0, 0));
        color: var(--media-live-button-indicator-color, rgb(255, 0, 0));
      }

      :host([${As}]:not([${Oa}])) {
        cursor: var(--media-cursor, not-allowed);
      }

      slot[name=text]{
        text-transform: uppercase;
      }

    </style>

    <slot name="indicator">${Rm}</slot>
    
    <slot name="spacer">&nbsp;</slot><slot name="text">${c("live")}</slot>
  `}var Nu=t=>{var e;let i=t.mediaPaused||!t.mediaTimeIsLive,a=i?c("seek to live"):c("playing live");t.setAttribute("aria-label",a);let r=(e=t.shadowRoot)==null?void 0:e.querySelector('slot[name="text"]');r&&(r.textContent=c("live")),i?t.removeAttribute("aria-disabled"):t.setAttribute("aria-disabled","true")},Ts=class extends O{static get observedAttributes(){return[...super.observedAttributes,As,Oa]}connectedCallback(){super.connectedCallback(),Nu(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),Nu(this)}get mediaPaused(){return A(this,o.MEDIA_PAUSED)}set mediaPaused(e){T(this,o.MEDIA_PAUSED,e)}get mediaTimeIsLive(){return A(this,o.MEDIA_TIME_IS_LIVE)}set mediaTimeIsLive(e){T(this,o.MEDIA_TIME_IS_LIVE,e)}handleClick(){!this.mediaPaused&&this.mediaTimeIsLive||(this.dispatchEvent(new l.CustomEvent(Cm,{composed:!0,bubbles:!0})),this.hasAttribute(Oa)&&this.dispatchEvent(new l.CustomEvent(Dm,{composed:!0,bubbles:!0})))}};Ts.getSlotTemplateHTML=xm;l.customElements.get("media-live-button")||l.customElements.define("media-live-button",Ts);var Fu=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Ua=(t,e,i)=>(Fu(t,e,"read from private field"),i?i.call(t):e.get(t)),Hu=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Pa=(t,e,i,a)=>(Fu(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),We,ys,ks={LOADING_DELAY:"loadingdelay",NO_AUTOHIDE:"noautohide"},Bu=500,Om=`
<svg aria-hidden="true" viewBox="0 0 100 100">
  <path d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
    <animateTransform
       attributeName="transform"
       attributeType="XML"
       type="rotate"
       dur="1s"
       from="0 50 50"
       to="360 50 50"
       repeatCount="indefinite" />
  </path>
</svg>
`;function Um(t){return`
    <style>
      :host {
        display: var(--media-control-display, var(--media-loading-indicator-display, inline-block));
        vertical-align: middle;
        box-sizing: border-box;
        --_loading-indicator-delay: var(--media-loading-indicator-transition-delay, ${Bu}ms);
      }

      #status {
        color: rgba(0,0,0,0);
        width: 0px;
        height: 0px;
      }

      :host slot[name=icon] > *,
      :host ::slotted([slot=icon]) {
        opacity: var(--media-loading-indicator-opacity, 0);
        transition: opacity 0.15s;
      }

      :host([${o.MEDIA_LOADING}]:not([${o.MEDIA_PAUSED}])) slot[name=icon] > *,
      :host([${o.MEDIA_LOADING}]:not([${o.MEDIA_PAUSED}])) ::slotted([slot=icon]) {
        opacity: var(--media-loading-indicator-opacity, 1);
        transition: opacity 0.15s var(--_loading-indicator-delay);
      }

      :host #status {
        visibility: var(--media-loading-indicator-opacity, hidden);
        transition: visibility 0.15s;
      }

      :host([${o.MEDIA_LOADING}]:not([${o.MEDIA_PAUSED}])) #status {
        visibility: var(--media-loading-indicator-opacity, visible);
        transition: visibility 0.15s var(--_loading-indicator-delay);
      }

      svg, img, ::slotted(svg), ::slotted(img) {
        width: var(--media-loading-indicator-icon-width);
        height: var(--media-loading-indicator-icon-height, 100px);
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        vertical-align: middle;
      }
    </style>

    <slot name="icon">${Om}</slot>
    <div id="status" role="status" aria-live="polite">${c("media loading")}</div>
  `}var Na=class extends l.HTMLElement{constructor(){if(super(),Hu(this,We,void 0),Hu(this,ys,Bu),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=$(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[M.MEDIA_CONTROLLER,o.MEDIA_PAUSED,o.MEDIA_LOADING,ks.LOADING_DELAY]}attributeChangedCallback(e,i,a){var r,s,n,d,u;e===ks.LOADING_DELAY&&i!==a?this.loadingDelay=Number(a):e===M.MEDIA_CONTROLLER&&(i&&((s=(r=Ua(this,We))==null?void 0:r.unassociateElement)==null||s.call(r,this),Pa(this,We,null)),a&&this.isConnected&&(Pa(this,We,(n=this.getRootNode())==null?void 0:n.getElementById(a)),(u=(d=Ua(this,We))==null?void 0:d.associateElement)==null||u.call(d,this)))}connectedCallback(){var e,i,a;let r=this.getAttribute(M.MEDIA_CONTROLLER);r&&(Pa(this,We,(e=this.getRootNode())==null?void 0:e.getElementById(r)),(a=(i=Ua(this,We))==null?void 0:i.associateElement)==null||a.call(i,this))}disconnectedCallback(){var e,i;(i=(e=Ua(this,We))==null?void 0:e.unassociateElement)==null||i.call(e,this),Pa(this,We,null)}get loadingDelay(){return Ua(this,ys)}set loadingDelay(e){Pa(this,ys,e);let{style:i}=W(this.shadowRoot,":host");i.setProperty("--_loading-indicator-delay",`var(--media-loading-indicator-transition-delay, ${e}ms)`)}get mediaPaused(){return A(this,o.MEDIA_PAUSED)}set mediaPaused(e){T(this,o.MEDIA_PAUSED,e)}get mediaLoading(){return A(this,o.MEDIA_LOADING)}set mediaLoading(e){T(this,o.MEDIA_LOADING,e)}get mediaController(){return I(this,M.MEDIA_CONTROLLER)}set mediaController(e){S(this,M.MEDIA_CONTROLLER,e)}get noAutohide(){return A(this,ks.NO_AUTOHIDE)}set noAutohide(e){T(this,ks.NO_AUTOHIDE,e)}};We=new WeakMap;ys=new WeakMap;Na.shadowRootOptions={mode:"open"};Na.getTemplateHTML=Um;l.customElements.get("media-loading-indicator")||l.customElements.define("media-loading-indicator",Na);var Pm=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M16.5 12A4.5 4.5 0 0 0 14 8v2.18l2.45 2.45a4.22 4.22 0 0 0 .05-.63Zm2.5 0a6.84 6.84 0 0 1-.54 2.64L20 16.15A8.8 8.8 0 0 0 21 12a9 9 0 0 0-7-8.77v2.06A7 7 0 0 1 19 12ZM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25A6.92 6.92 0 0 1 14 18.7v2.06A9 9 0 0 0 17.69 19l2 2.05L21 19.73l-9-9L4.27 3ZM12 4 9.91 6.09 12 8.18V4Z"/>
</svg>`,Wu=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4Z"/>
</svg>`,Nm=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4ZM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06a9 9 0 0 0 0-17.54Z"/>
</svg>`;function Hm(t){return`
    <style>
      :host(:not([${o.MEDIA_VOLUME_LEVEL}])) slot[name=icon] slot:not([name=high]),
      :host([${o.MEDIA_VOLUME_LEVEL}=high]) slot[name=icon] slot:not([name=high]) {
        display: none !important;
      }

      :host([${o.MEDIA_VOLUME_LEVEL}=off]) slot[name=icon] slot:not([name=off]) {
        display: none !important;
      }

      :host([${o.MEDIA_VOLUME_LEVEL}=low]) slot[name=icon] slot:not([name=low]) {
        display: none !important;
      }

      :host([${o.MEDIA_VOLUME_LEVEL}=medium]) slot[name=icon] slot:not([name=medium]) {
        display: none !important;
      }

      :host(:not([${o.MEDIA_VOLUME_LEVEL}=off])) slot[name=tooltip-unmute],
      :host([${o.MEDIA_VOLUME_LEVEL}=off]) slot[name=tooltip-mute] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="off">${Pm}</slot>
      <slot name="low">${Wu}</slot>
      <slot name="medium">${Wu}</slot>
      <slot name="high">${Nm}</slot>
    </slot>
  `}function Fm(){return`
    <slot name="tooltip-mute">${c("Mute")}</slot>
    <slot name="tooltip-unmute">${c("Unmute")}</slot>
  `}var $u=t=>{let i=t.mediaVolumeLevel==="off"?c("unmute"):c("mute");t.setAttribute("aria-label",i)},Ha=class extends O{static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_VOLUME_LEVEL]}connectedCallback(){super.connectedCallback(),$u(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===o.MEDIA_VOLUME_LEVEL&&$u(this)}get mediaVolumeLevel(){return I(this,o.MEDIA_VOLUME_LEVEL)}set mediaVolumeLevel(e){S(this,o.MEDIA_VOLUME_LEVEL,e)}handleClick(){let e=this.mediaVolumeLevel==="off"?h.MEDIA_UNMUTE_REQUEST:h.MEDIA_MUTE_REQUEST;this.dispatchEvent(new l.CustomEvent(e,{composed:!0,bubbles:!0}))}};Ha.getSlotTemplateHTML=Hm;Ha.getTooltipContentHTML=Fm;l.customElements.get("media-mute-button")||l.customElements.define("media-mute-button",Ha);var Vu=`<svg aria-hidden="true" viewBox="0 0 28 24">
  <path d="M24 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Zm-1 16H5V5h18v14Zm-3-8h-7v5h7v-5Z"/>
</svg>`;function Bm(t){return`
    <style>
      :host([${o.MEDIA_IS_PIP}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      :host(:not([${o.MEDIA_IS_PIP}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${o.MEDIA_IS_PIP}]) slot[name=tooltip-enter],
      :host(:not([${o.MEDIA_IS_PIP}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${Vu}</slot>
      <slot name="exit">${Vu}</slot>
    </slot>
  `}function Wm(){return`
    <slot name="tooltip-enter">${c("Enter picture in picture mode")}</slot>
    <slot name="tooltip-exit">${c("Exit picture in picture mode")}</slot>
  `}var Ku=t=>{let e=t.mediaIsPip?c("exit picture in picture mode"):c("enter picture in picture mode");t.setAttribute("aria-label",e)},Fa=class extends O{static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_IS_PIP,o.MEDIA_PIP_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),Ku(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===o.MEDIA_IS_PIP&&Ku(this)}get mediaPipUnavailable(){return I(this,o.MEDIA_PIP_UNAVAILABLE)}set mediaPipUnavailable(e){S(this,o.MEDIA_PIP_UNAVAILABLE,e)}get mediaIsPip(){return A(this,o.MEDIA_IS_PIP)}set mediaIsPip(e){T(this,o.MEDIA_IS_PIP,e)}handleClick(){let e=this.mediaIsPip?h.MEDIA_EXIT_PIP_REQUEST:h.MEDIA_ENTER_PIP_REQUEST;this.dispatchEvent(new l.CustomEvent(e,{composed:!0,bubbles:!0}))}};Fa.getSlotTemplateHTML=Bm;Fa.getTooltipContentHTML=Wm;l.customElements.get("media-pip-button")||l.customElements.define("media-pip-button",Fa);var $m=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Li=(t,e,i)=>($m(t,e,"read from private field"),i?i.call(t):e.get(t)),Vm=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Tt,Sn={RATES:"rates"},In=[1,1.2,1.5,1.7,2],qt=1;function $e(t){return Math.round(t*100)/100}function Km(t){return`
    <style>
      :host {
        min-width: 5ch;
        padding: var(--media-button-padding, var(--media-control-padding, 10px 5px));
      }
    </style>
    <slot name="icon">${t.mediaplaybackrate?$e(+t.mediaplaybackrate):qt}x</slot>
  `}function Gm(){return c("Playback rate")}var Ba=class extends O{constructor(){var e;super(),Vm(this,Tt,new Et(this,Sn.RATES,{defaultValue:In})),this.container=this.shadowRoot.querySelector('slot[name="icon"]'),this.container.innerHTML=`${$e((e=this.mediaPlaybackRate)!=null?e:qt)}x`}static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_PLAYBACK_RATE,Sn.RATES]}attributeChangedCallback(e,i,a){if(super.attributeChangedCallback(e,i,a),e===Sn.RATES&&(Li(this,Tt).value=a),e===o.MEDIA_PLAYBACK_RATE){let r=a?+a:Number.NaN,s=$e(Number.isNaN(r)?qt:r);this.container.innerHTML=`${s}x`,this.setAttribute("aria-label",c("Playback rate {playbackRate}",{playbackRate:s}))}}get rates(){return Li(this,Tt)}set rates(e){e?Array.isArray(e)?Li(this,Tt).value=e.join(" "):typeof e=="string"&&(Li(this,Tt).value=e):Li(this,Tt).value=""}get mediaPlaybackRate(){return L(this,o.MEDIA_PLAYBACK_RATE,qt)}set mediaPlaybackRate(e){R(this,o.MEDIA_PLAYBACK_RATE,e)}handleClick(){var e,i;let a=Array.from(Li(this,Tt).values(),n=>+n).sort((n,d)=>n-d),r=(i=(e=a.find(n=>n>this.mediaPlaybackRate))!=null?e:a[0])!=null?i:qt,s=new l.CustomEvent(h.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:r});this.dispatchEvent(s)}};Tt=new WeakMap;Ba.getSlotTemplateHTML=Km;Ba.getTooltipContentHTML=Gm;l.customElements.get("media-playback-rate-button")||l.customElements.define("media-playback-rate-button",Ba);var qm=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="m6 21 15-9L6 3v18Z"/>
</svg>`,Ym=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M6 20h4V4H6v16Zm8-16v16h4V4h-4Z"/>
</svg>`;function zm(t){return`
    <style>
      :host([${o.MEDIA_PAUSED}]) slot[name=pause],
      :host(:not([${o.MEDIA_PAUSED}])) slot[name=play] {
        display: none !important;
      }

      :host([${o.MEDIA_PAUSED}]) slot[name=tooltip-pause],
      :host(:not([${o.MEDIA_PAUSED}])) slot[name=tooltip-play] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="play">${qm}</slot>
      <slot name="pause">${Ym}</slot>
    </slot>
  `}function Qm(){return`
    <slot name="tooltip-play">${c("Play")}</slot>
    <slot name="tooltip-pause">${c("Pause")}</slot>
  `}var Gu=t=>{let e=t.mediaPaused?c("play"):c("pause");t.setAttribute("aria-label",e)},Wa=class extends O{static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_PAUSED,o.MEDIA_ENDED]}connectedCallback(){super.connectedCallback(),Gu(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),(e===o.MEDIA_PAUSED||e===o.MEDIA_LANG)&&Gu(this)}get mediaPaused(){return A(this,o.MEDIA_PAUSED)}set mediaPaused(e){T(this,o.MEDIA_PAUSED,e)}handleClick(){let e=this.mediaPaused?h.MEDIA_PLAY_REQUEST:h.MEDIA_PAUSE_REQUEST;this.dispatchEvent(new l.CustomEvent(e,{composed:!0,bubbles:!0}))}};Wa.getSlotTemplateHTML=zm;Wa.getTooltipContentHTML=Qm;l.customElements.get("media-play-button")||l.customElements.define("media-play-button",Wa);var Ve={PLACEHOLDER_SRC:"placeholdersrc",SRC:"src"};function Zm(t){return`
    <style>
      :host {
        pointer-events: none;
        display: var(--media-poster-image-display, inline-block);
        box-sizing: border-box;
      }

      img {
        max-width: 100%;
        max-height: 100%;
        min-width: 100%;
        min-height: 100%;
        background-repeat: no-repeat;
        background-position: var(--media-poster-image-background-position, var(--media-object-position, center));
        background-size: var(--media-poster-image-background-size, var(--media-object-fit, contain));
        object-fit: var(--media-object-fit, contain);
        object-position: var(--media-object-position, center);
      }
    </style>

    <img part="poster img" aria-hidden="true" id="image"/>
  `}var Xm=t=>{t.style.removeProperty("background-image")},Jm=(t,e)=>{t.style["background-image"]=`url('${e}')`},$a=class extends l.HTMLElement{static get observedAttributes(){return[Ve.PLACEHOLDER_SRC,Ve.SRC]}constructor(){if(super(),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=$(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}this.image=this.shadowRoot.querySelector("#image")}attributeChangedCallback(e,i,a){e===Ve.SRC&&(a==null?this.image.removeAttribute(Ve.SRC):this.image.setAttribute(Ve.SRC,a)),e===Ve.PLACEHOLDER_SRC&&(a==null?Xm(this.image):Jm(this.image,a))}get placeholderSrc(){return I(this,Ve.PLACEHOLDER_SRC)}set placeholderSrc(e){S(this,Ve.SRC,e)}get src(){return I(this,Ve.SRC)}set src(e){S(this,Ve.SRC,e)}};$a.shadowRootOptions={mode:"open"};$a.getTemplateHTML=Zm;l.customElements.get("media-poster-image")||l.customElements.define("media-poster-image",$a);var qu=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},jm=(t,e,i)=>(qu(t,e,"read from private field"),i?i.call(t):e.get(t)),ep=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},tp=(t,e,i,a)=>(qu(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),Ss,Mn=class extends le{constructor(){super(),ep(this,Ss,void 0),tp(this,Ss,this.shadowRoot.querySelector("slot"))}static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_PREVIEW_CHAPTER,o.MEDIA_LANG]}attributeChangedCallback(e,i,a){if(super.attributeChangedCallback(e,i,a),(e===o.MEDIA_PREVIEW_CHAPTER||e===o.MEDIA_LANG)&&a!==i&&a!=null)if(jm(this,Ss).textContent=a,a!==""){let r=c("chapter: {chapterName}",{chapterName:a});this.setAttribute("aria-valuetext",r)}else this.removeAttribute("aria-valuetext")}get mediaPreviewChapter(){return I(this,o.MEDIA_PREVIEW_CHAPTER)}set mediaPreviewChapter(e){S(this,o.MEDIA_PREVIEW_CHAPTER,e)}};Ss=new WeakMap;l.customElements.get("media-preview-chapter-display")||l.customElements.define("media-preview-chapter-display",Mn);var Yu=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Is=(t,e,i)=>(Yu(t,e,"read from private field"),i?i.call(t):e.get(t)),ip=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Ms=(t,e,i,a)=>(Yu(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),Ke;function ap(t){return`
    <style>
      :host {
        box-sizing: border-box;
        display: var(--media-control-display, var(--media-preview-thumbnail-display, inline-block));
        overflow: hidden;
      }

      img {
        display: none;
        position: relative;
      }
    </style>
    <img crossorigin loading="eager" decoding="async">
  `}var Ci=class extends l.HTMLElement{constructor(){if(super(),ip(this,Ke,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=$(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[M.MEDIA_CONTROLLER,o.MEDIA_PREVIEW_IMAGE,o.MEDIA_PREVIEW_COORDS]}connectedCallback(){var e,i,a;let r=this.getAttribute(M.MEDIA_CONTROLLER);r&&(Ms(this,Ke,(e=this.getRootNode())==null?void 0:e.getElementById(r)),(a=(i=Is(this,Ke))==null?void 0:i.associateElement)==null||a.call(i,this))}disconnectedCallback(){var e,i;(i=(e=Is(this,Ke))==null?void 0:e.unassociateElement)==null||i.call(e,this),Ms(this,Ke,null)}attributeChangedCallback(e,i,a){var r,s,n,d,u;[o.MEDIA_PREVIEW_IMAGE,o.MEDIA_PREVIEW_COORDS].includes(e)&&this.update(),e===M.MEDIA_CONTROLLER&&(i&&((s=(r=Is(this,Ke))==null?void 0:r.unassociateElement)==null||s.call(r,this),Ms(this,Ke,null)),a&&this.isConnected&&(Ms(this,Ke,(n=this.getRootNode())==null?void 0:n.getElementById(a)),(u=(d=Is(this,Ke))==null?void 0:d.associateElement)==null||u.call(d,this)))}get mediaPreviewImage(){return I(this,o.MEDIA_PREVIEW_IMAGE)}set mediaPreviewImage(e){S(this,o.MEDIA_PREVIEW_IMAGE,e)}get mediaPreviewCoords(){let e=this.getAttribute(o.MEDIA_PREVIEW_COORDS);if(e)return e.split(/\s+/).map(i=>+i)}set mediaPreviewCoords(e){if(!e){this.removeAttribute(o.MEDIA_PREVIEW_COORDS);return}this.setAttribute(o.MEDIA_PREVIEW_COORDS,e.join(" "))}update(){let e=this.mediaPreviewCoords,i=this.mediaPreviewImage;if(!(e&&i))return;let[a,r,s,n]=e,d=i.split("#")[0],u=getComputedStyle(this),{maxWidth:p,maxHeight:_,minWidth:b,minHeight:f}=u,v=u.getPropertyValue("--media-preview-thumbnail-object-fit").trim()||"contain",y,g;if(v==="fill"){let tt=parseInt(p)/s,it=parseInt(_)/n,ca=parseInt(b)/s,xt=parseInt(f)/n;y=tt<1?tt:Math.max(tt,ca),g=it<1?it:Math.max(it,xt)}else{let tt=Math.min(parseInt(p)/s,parseInt(_)/n),it=Math.max(parseInt(b)/s,parseInt(f)/n),xt=tt<1?tt:it>1?it:1;y=xt,g=xt}let{style:C}=W(this.shadowRoot,":host"),w=W(this.shadowRoot,"img").style,ie=this.shadowRoot.querySelector("img"),ua=Math.min(y,g)<1?"min":"max";C.setProperty(`${ua}-width`,"initial","important"),C.setProperty(`${ua}-height`,"initial","important"),C.width=`${s*y}px`,C.height=`${n*g}px`;let oi=()=>{w.width=`${this.imgWidth*y}px`,w.height=`${this.imgHeight*g}px`,w.display="block"};ie.src!==d&&(ie.onload=()=>{this.imgWidth=ie.naturalWidth,this.imgHeight=ie.naturalHeight,oi(),ie.onload=null},ie.src=d,oi()),oi(),w.transform=`translate(-${a*y}px, -${r*g}px)`}};Ke=new WeakMap;Ci.shadowRootOptions={mode:"open"};Ci.getTemplateHTML=ap;l.customElements.get("media-preview-thumbnail")||l.customElements.define("media-preview-thumbnail",Ci);var ws=Ci;var Qu=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},zu=(t,e,i)=>(Qu(t,e,"read from private field"),i?i.call(t):e.get(t)),rp=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},sp=(t,e,i,a)=>(Qu(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),Va,wn=class extends le{constructor(){super(),rp(this,Va,void 0),sp(this,Va,this.shadowRoot.querySelector("slot")),zu(this,Va).textContent=Ae(0)}static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_PREVIEW_TIME]}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===o.MEDIA_PREVIEW_TIME&&a!=null&&(zu(this,Va).textContent=Ae(parseFloat(a)))}get mediaPreviewTime(){return L(this,o.MEDIA_PREVIEW_TIME)}set mediaPreviewTime(e){R(this,o.MEDIA_PREVIEW_TIME,e)}};Va=new WeakMap;l.customElements.get("media-preview-time-display")||l.customElements.define("media-preview-time-display",wn);var Di={SEEK_OFFSET:"seekoffset"},Ln=30,op=t=>`
  <svg aria-hidden="true" viewBox="0 0 20 24">
    <defs>
      <style>.text{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style>
    </defs>
    <text class="text value" transform="translate(2.18 19.87)">${t}</text>
    <path d="M10 6V3L4.37 7 10 10.94V8a5.54 5.54 0 0 1 1.9 10.48v2.12A7.5 7.5 0 0 0 10 6Z"/>
  </svg>`;function np(t,e){return`
    <slot name="icon">${op(e.seekOffset)}</slot>
  `}var lp=(t,e)=>{t.setAttribute("aria-label",c("seek back {seekOffset} seconds",{seekOffset:e}))};function dp(){return c("Seek backward")}var up=0,Ka=class extends O{static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_CURRENT_TIME,Di.SEEK_OFFSET]}connectedCallback(){super.connectedCallback(),this.seekOffset=L(this,Di.SEEK_OFFSET,Ln)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),lp(this,this.seekOffset),e===Di.SEEK_OFFSET&&(this.seekOffset=L(this,Di.SEEK_OFFSET,Ln))}get seekOffset(){return L(this,Di.SEEK_OFFSET,Ln)}set seekOffset(e){R(this,Di.SEEK_OFFSET,e),this.setAttribute("aria-label",c("seek back {seekOffset} seconds",{seekOffset:this.seekOffset})),Cr(Dr(this,"icon"),this.seekOffset)}get mediaCurrentTime(){return L(this,o.MEDIA_CURRENT_TIME,up)}set mediaCurrentTime(e){R(this,o.MEDIA_CURRENT_TIME,e)}handleClick(){let e=Math.max(this.mediaCurrentTime-this.seekOffset,0),i=new l.CustomEvent(h.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(i)}};Ka.getSlotTemplateHTML=np;Ka.getTooltipContentHTML=dp;l.customElements.get("media-seek-backward-button")||l.customElements.define("media-seek-backward-button",Ka);var Ri={SEEK_OFFSET:"seekoffset"},Cn=30,cp=t=>`
  <svg aria-hidden="true" viewBox="0 0 20 24">
    <defs>
      <style>.text{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style>
    </defs>
    <text class="text value" transform="translate(8.9 19.87)">${t}</text>
    <path d="M10 6V3l5.61 4L10 10.94V8a5.54 5.54 0 0 0-1.9 10.48v2.12A7.5 7.5 0 0 1 10 6Z"/>
  </svg>`;function hp(t,e){return`
    <slot name="icon">${cp(e.seekOffset)}</slot>
  `}var mp=(t,e)=>{t.setAttribute("aria-label",c("seek forward {seekOffset} seconds",{seekOffset:e}))};function pp(){return c("Seek forward")}var vp=0,Ga=class extends O{static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_CURRENT_TIME,Ri.SEEK_OFFSET]}connectedCallback(){super.connectedCallback(),this.seekOffset=L(this,Ri.SEEK_OFFSET,Cn)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),mp(this,this.seekOffset),e===Ri.SEEK_OFFSET&&(this.seekOffset=L(this,Ri.SEEK_OFFSET,Cn))}get seekOffset(){return L(this,Ri.SEEK_OFFSET,Cn)}set seekOffset(e){R(this,Ri.SEEK_OFFSET,e),this.setAttribute("aria-label",c("seek forward {seekOffset} seconds",{seekOffset:this.seekOffset})),Cr(Dr(this,"icon"),this.seekOffset)}get mediaCurrentTime(){return L(this,o.MEDIA_CURRENT_TIME,vp)}set mediaCurrentTime(e){R(this,o.MEDIA_CURRENT_TIME,e)}handleClick(){let e=this.mediaCurrentTime+this.seekOffset,i=new l.CustomEvent(h.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(i)}};Ga.getSlotTemplateHTML=hp;Ga.getTooltipContentHTML=pp;l.customElements.get("media-seek-forward-button")||l.customElements.define("media-seek-forward-button",Ga);var xn=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},we=(t,e,i)=>(xn(t,e,"read from private field"),i?i.call(t):e.get(t)),Yt=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},On=(t,e,i,a)=>(xn(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),yt=(t,e,i)=>(xn(t,e,"access private method"),i),xi,Ge,xs,Un,Xu,Ds,Pn,qa,Ls,Cs,Dn,kt={REMAINING:"remaining",SHOW_DURATION:"showduration",NO_TOGGLE:"notoggle"},Zu=[...Object.values(kt),o.MEDIA_CURRENT_TIME,o.MEDIA_DURATION,o.MEDIA_SEEKABLE],Ju=["Enter"," "],fp="&nbsp;/&nbsp;",Rn=(t,{timesSep:e=fp}={})=>{var i,a;let r=(i=t.mediaCurrentTime)!=null?i:0,[,s]=(a=t.mediaSeekable)!=null?a:[],n=0;Number.isFinite(t.mediaDuration)?n=t.mediaDuration:Number.isFinite(s)&&(n=s);let d=t.remaining?Ae(0-(n-r)):Ae(r);return t.showDuration?`${d}${e}${Ae(n)}`:d},Ep=t=>{var e;let i=t.mediaCurrentTime,[,a]=(e=t.mediaSeekable)!=null?e:[],r=null;if(Number.isFinite(t.mediaDuration)?r=t.mediaDuration:Number.isFinite(a)&&(r=a),i==null||r===null){t.setAttribute("aria-description",c("video not loaded, unknown time."));return}let s=t.remaining?Ot(0-(r-i)):Ot(i);if(!t.showDuration){t.setAttribute("aria-description",s);return}let n=Ot(r),d=c("{currentTime} of {totalTime}",{currentTime:s,totalTime:n});t.setAttribute("aria-description",d)};function gp(t,e){return`
    <slot>${Rn(e)}</slot>
  `}var bp=t=>{t.setAttribute("aria-label",c("playback time"))},Rs=class extends le{constructor(){super(),Yt(this,Un),Yt(this,Ds),Yt(this,qa),Yt(this,Cs),Yt(this,xi,void 0),Yt(this,Ge,null),Yt(this,xs,e=>{let{metaKey:i,altKey:a,key:r}=e;if(i||a||!Ju.includes(r)){this.removeEventListener("keyup",we(this,Ge));return}this.addEventListener("keyup",we(this,Ge))}),On(this,xi,this.shadowRoot.querySelector("slot")),we(this,xi).innerHTML=`${Rn(this)}`}static get observedAttributes(){return[...super.observedAttributes,...Zu,"disabled"]}connectedCallback(){let{style:e}=W(this.shadowRoot,":host(:hover:not([notoggle]))");e.setProperty("cursor","var(--media-cursor, pointer)"),e.setProperty("background","var(--media-control-hover-background, rgba(50 50 70 / .7))"),this.setAttribute("aria-label",c("playback time")),yt(this,qa,Ls).call(this),super.connectedCallback()}toggleTimeDisplay(){this.noToggle||(this.hasAttribute("remaining")?this.removeAttribute("remaining"):this.setAttribute("remaining",""))}disconnectedCallback(){this.disable(),yt(this,Ds,Pn).call(this),super.disconnectedCallback()}attributeChangedCallback(e,i,a){bp(this),Zu.includes(e)?this.update():e==="disabled"&&a!==i?a==null?yt(this,qa,Ls).call(this):yt(this,Cs,Dn).call(this):e===kt.NO_TOGGLE&&a!==i&&(this.noToggle?yt(this,Cs,Dn).call(this):yt(this,qa,Ls).call(this)),super.attributeChangedCallback(e,i,a)}enable(){this.noToggle||(this.tabIndex=0)}disable(){this.tabIndex=-1}get remaining(){return A(this,kt.REMAINING)}set remaining(e){T(this,kt.REMAINING,e)}get showDuration(){return A(this,kt.SHOW_DURATION)}set showDuration(e){T(this,kt.SHOW_DURATION,e)}get noToggle(){return A(this,kt.NO_TOGGLE)}set noToggle(e){T(this,kt.NO_TOGGLE,e)}get mediaDuration(){return L(this,o.MEDIA_DURATION)}set mediaDuration(e){R(this,o.MEDIA_DURATION,e)}get mediaCurrentTime(){return L(this,o.MEDIA_CURRENT_TIME)}set mediaCurrentTime(e){R(this,o.MEDIA_CURRENT_TIME,e)}get mediaSeekable(){let e=this.getAttribute(o.MEDIA_SEEKABLE);if(e)return e.split(":").map(i=>+i)}set mediaSeekable(e){if(e==null){this.removeAttribute(o.MEDIA_SEEKABLE);return}this.setAttribute(o.MEDIA_SEEKABLE,e.join(":"))}update(){let e=Rn(this);Ep(this),e!==we(this,xi).innerHTML&&(we(this,xi).innerHTML=e)}};xi=new WeakMap;Ge=new WeakMap;xs=new WeakMap;Un=new WeakSet;Xu=function(){we(this,Ge)||(On(this,Ge,t=>{let{key:e}=t;if(!Ju.includes(e)){this.removeEventListener("keyup",we(this,Ge));return}this.toggleTimeDisplay()}),this.addEventListener("keydown",we(this,xs)),this.addEventListener("click",this.toggleTimeDisplay))};Ds=new WeakSet;Pn=function(){we(this,Ge)&&(this.removeEventListener("keyup",we(this,Ge)),this.removeEventListener("keydown",we(this,xs)),this.removeEventListener("click",this.toggleTimeDisplay),On(this,Ge,null))};qa=new WeakSet;Ls=function(){!this.noToggle&&!this.hasAttribute("disabled")&&(this.setAttribute("role","button"),this.enable(),yt(this,Un,Xu).call(this))};Cs=new WeakSet;Dn=function(){this.removeAttribute("role"),this.disable(),yt(this,Ds,Pn).call(this)};Rs.getSlotTemplateHTML=gp;l.customElements.get("media-time-display")||l.customElements.define("media-time-display",Rs);var ju=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},j=(t,e,i)=>(ju(t,e,"read from private field"),i?i.call(t):e.get(t)),qe=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},ce=(t,e,i,a)=>(ju(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),_p=(t,e,i,a)=>({set _(r){ce(t,e,r,i)},get _(){return j(t,e,a)}}),Oi,Os,Ui,Ya,Us,Ps,Ns,Pi,zt,Hs,Fs=class{constructor(e,i,a){qe(this,Oi,void 0),qe(this,Os,void 0),qe(this,Ui,void 0),qe(this,Ya,void 0),qe(this,Us,void 0),qe(this,Ps,void 0),qe(this,Ns,void 0),qe(this,Pi,void 0),qe(this,zt,0),qe(this,Hs,(r=performance.now())=>{ce(this,zt,requestAnimationFrame(j(this,Hs))),ce(this,Ya,performance.now()-j(this,Ui));let s=1e3/this.fps;if(j(this,Ya)>s){ce(this,Ui,r-j(this,Ya)%s);let n=1e3/((r-j(this,Os))/++_p(this,Us)._),d=(r-j(this,Ps))/1e3/this.duration,u=j(this,Ns)+d*this.playbackRate;u-j(this,Oi).valueAsNumber>0?ce(this,Pi,this.playbackRate/this.duration/n):(ce(this,Pi,.995*j(this,Pi)),u=j(this,Oi).valueAsNumber+j(this,Pi)),this.callback(u)}}),ce(this,Oi,e),this.callback=i,this.fps=a}start(){j(this,zt)===0&&(ce(this,Ui,performance.now()),ce(this,Os,j(this,Ui)),ce(this,Us,0),j(this,Hs).call(this))}stop(){j(this,zt)!==0&&(cancelAnimationFrame(j(this,zt)),ce(this,zt,0))}update({start:e,duration:i,playbackRate:a}){let r=e-j(this,Oi).valueAsNumber,s=Math.abs(i-this.duration);(r>0||r<-.5/i||s>=.5)&&this.callback(e),ce(this,Ns,e),ce(this,Ps,performance.now()),this.duration=i,this.playbackRate=a}};Oi=new WeakMap;Os=new WeakMap;Ui=new WeakMap;Ya=new WeakMap;Us=new WeakMap;Ps=new WeakMap;Ns=new WeakMap;Pi=new WeakMap;zt=new WeakMap;Hs=new WeakMap;var Wn=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},V=(t,e,i)=>(Wn(t,e,"read from private field"),i?i.call(t):e.get(t)),Z=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},pe=(t,e,i,a)=>(Wn(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),ve=(t,e,i)=>(Wn(t,e,"access private method"),i),Ni,St,$s,Qa,Vs,Ws,Za,Xa,Hi,Fi,za,Nn,ec,Hn,Ks,$n,Gs,Vn,qs,Kn,Fn,tc,Ja,Ys,Bn,ic,Ap=t=>{let e=t.range,i=Ot(+ac(t)),a=Ot(+t.mediaSeekableEnd),r=i&&a?c("{currentTime} of {totalTime}",{currentTime:i,totalTime:a}):c("video not loaded, unknown time.");e.setAttribute("aria-valuetext",r)};function Tp(t){return`
    <style>
      :host {
        --media-box-border-radius: 4px;
        --media-box-padding-left: 10px;
        --media-box-padding-right: 10px;
        --media-preview-border-radius: var(--media-box-border-radius);
        --media-box-arrow-offset: var(--media-box-border-radius);
        --_control-background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        --_preview-background: var(--media-preview-background, var(--_control-background));

        
        contain: layout;
      }

      #buffered {
        background: var(--media-time-range-buffered-color, rgb(255 255 255 / .4));
        position: absolute;
        height: 100%;
        will-change: width;
      }

      #preview-rail,
      #current-rail {
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 100%;
        pointer-events: none;
        will-change: transform;
      }

      [part~="box"] {
        width: min-content;
        
        position: absolute;
        bottom: 100%;
        flex-direction: column;
        align-items: center;
        transform: translateX(-50%);
      }

      [part~="current-box"] {
        display: var(--media-current-box-display, var(--media-box-display, flex));
        margin: var(--media-current-box-margin, var(--media-box-margin, 0 0 5px));
        visibility: hidden;
      }

      [part~="preview-box"] {
        display: var(--media-preview-box-display, var(--media-box-display, flex));
        margin: var(--media-preview-box-margin, var(--media-box-margin, 0 0 5px));
        transition-property: var(--media-preview-transition-property, visibility, opacity);
        transition-duration: var(--media-preview-transition-duration-out, .25s);
        transition-delay: var(--media-preview-transition-delay-out, 0s);
        visibility: hidden;
        opacity: 0;
      }

      :host(:is([${o.MEDIA_PREVIEW_IMAGE}], [${o.MEDIA_PREVIEW_TIME}])[dragging]) [part~="preview-box"] {
        transition-duration: var(--media-preview-transition-duration-in, .5s);
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        visibility: visible;
        opacity: 1;
      }

      @media (hover: hover) {
        :host(:is([${o.MEDIA_PREVIEW_IMAGE}], [${o.MEDIA_PREVIEW_TIME}]):hover) [part~="preview-box"] {
          transition-duration: var(--media-preview-transition-duration-in, .5s);
          transition-delay: var(--media-preview-transition-delay-in, .25s);
          visibility: visible;
          opacity: 1;
        }
      }

      media-preview-thumbnail,
      ::slotted(media-preview-thumbnail) {
        visibility: hidden;
        
        transition: visibility 0s .25s;
        transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
        background: var(--media-preview-thumbnail-background, var(--_preview-background));
        box-shadow: var(--media-preview-thumbnail-box-shadow, 0 0 4px rgb(0 0 0 / .2));
        max-width: var(--media-preview-thumbnail-max-width, 180px);
        max-height: var(--media-preview-thumbnail-max-height, 160px);
        min-width: var(--media-preview-thumbnail-min-width, 120px);
        min-height: var(--media-preview-thumbnail-min-height, 80px);
        border: var(--media-preview-thumbnail-border);
        border-radius: var(--media-preview-thumbnail-border-radius,
          var(--media-preview-border-radius) var(--media-preview-border-radius) 0 0);
      }

      :host([${o.MEDIA_PREVIEW_IMAGE}][dragging]) media-preview-thumbnail,
      :host([${o.MEDIA_PREVIEW_IMAGE}][dragging]) ::slotted(media-preview-thumbnail) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        visibility: visible;
      }

      @media (hover: hover) {
        :host([${o.MEDIA_PREVIEW_IMAGE}]:hover) media-preview-thumbnail,
        :host([${o.MEDIA_PREVIEW_IMAGE}]:hover) ::slotted(media-preview-thumbnail) {
          transition-delay: var(--media-preview-transition-delay-in, .25s);
          visibility: visible;
        }

        :host([${o.MEDIA_PREVIEW_TIME}]:hover) {
          --media-time-range-hover-display: block;
        }
      }

      media-preview-chapter-display,
      ::slotted(media-preview-chapter-display) {
        font-size: var(--media-font-size, 13px);
        line-height: 17px;
        min-width: 0;
        visibility: hidden;
        
        transition: min-width 0s, border-radius 0s, margin 0s, padding 0s, visibility 0s;
        transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
        background: var(--media-preview-chapter-background, var(--_preview-background));
        border-radius: var(--media-preview-chapter-border-radius,
          var(--media-preview-border-radius) var(--media-preview-border-radius)
          var(--media-preview-border-radius) var(--media-preview-border-radius));
        padding: var(--media-preview-chapter-padding, 3.5px 9px);
        margin: var(--media-preview-chapter-margin, 0 0 5px);
        text-shadow: var(--media-preview-chapter-text-shadow, 0 0 4px rgb(0 0 0 / .75));
      }

      :host([${o.MEDIA_PREVIEW_IMAGE}]) media-preview-chapter-display,
      :host([${o.MEDIA_PREVIEW_IMAGE}]) ::slotted(media-preview-chapter-display) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        border-radius: var(--media-preview-chapter-border-radius, 0);
        padding: var(--media-preview-chapter-padding, 3.5px 9px 0);
        margin: var(--media-preview-chapter-margin, 0);
        min-width: 100%;
      }

      media-preview-chapter-display[${o.MEDIA_PREVIEW_CHAPTER}],
      ::slotted(media-preview-chapter-display[${o.MEDIA_PREVIEW_CHAPTER}]) {
        visibility: visible;
      }

      media-preview-chapter-display:not([aria-valuetext]),
      ::slotted(media-preview-chapter-display:not([aria-valuetext])) {
        display: none;
      }

      media-preview-time-display,
      ::slotted(media-preview-time-display),
      media-time-display,
      ::slotted(media-time-display) {
        font-size: var(--media-font-size, 13px);
        line-height: 17px;
        min-width: 0;
        
        transition: min-width 0s, border-radius 0s;
        transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
        background: var(--media-preview-time-background, var(--_preview-background));
        border-radius: var(--media-preview-time-border-radius,
          var(--media-preview-border-radius) var(--media-preview-border-radius)
          var(--media-preview-border-radius) var(--media-preview-border-radius));
        padding: var(--media-preview-time-padding, 3.5px 9px);
        margin: var(--media-preview-time-margin, 0);
        text-shadow: var(--media-preview-time-text-shadow, 0 0 4px rgb(0 0 0 / .75));
        transform: translateX(min(
          max(calc(50% - var(--_box-width) / 2),
          calc(var(--_box-shift, 0))),
          calc(var(--_box-width) / 2 - 50%)
        ));
      }

      :host([${o.MEDIA_PREVIEW_IMAGE}]) media-preview-time-display,
      :host([${o.MEDIA_PREVIEW_IMAGE}]) ::slotted(media-preview-time-display) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        border-radius: var(--media-preview-time-border-radius,
          0 0 var(--media-preview-border-radius) var(--media-preview-border-radius));
        min-width: 100%;
      }

      :host([${o.MEDIA_PREVIEW_TIME}]:hover) {
        --media-time-range-hover-display: block;
      }

      [part~="arrow"],
      ::slotted([part~="arrow"]) {
        display: var(--media-box-arrow-display, inline-block);
        transform: translateX(min(
          max(calc(50% - var(--_box-width) / 2 + var(--media-box-arrow-offset)),
          calc(var(--_box-shift, 0))),
          calc(var(--_box-width) / 2 - 50% - var(--media-box-arrow-offset))
        ));
        
        border-color: transparent;
        border-top-color: var(--media-box-arrow-background, var(--_control-background));
        border-width: var(--media-box-arrow-border-width,
          var(--media-box-arrow-height, 5px) var(--media-box-arrow-width, 6px) 0);
        border-style: solid;
        justify-content: center;
        height: 0;
      }
    </style>
    <div id="preview-rail">
      <slot name="preview" part="box preview-box">
        <media-preview-thumbnail>
          <template shadowrootmode="${ws.shadowRootOptions.mode}">
            ${ws.getTemplateHTML({})}
          </template>
        </media-preview-thumbnail>
        <media-preview-chapter-display></media-preview-chapter-display>
        <media-preview-time-display></media-preview-time-display>
        <slot name="preview-arrow"><div part="arrow"></div></slot>
      </slot>
    </div>
    <div id="current-rail">
      <slot name="current" part="box current-box">
        
      </slot>
    </div>
  `}var Bs=(t,e=t.mediaCurrentTime)=>{let i=Number.isFinite(t.mediaSeekableStart)?t.mediaSeekableStart:0,a=Number.isFinite(t.mediaDuration)?t.mediaDuration:t.mediaSeekableEnd;if(Number.isNaN(a))return 0;let r=(e-i)/(a-i);return Math.max(0,Math.min(r,1))},ac=(t,e=t.range.valueAsNumber)=>{let i=Number.isFinite(t.mediaSeekableStart)?t.mediaSeekableStart:0,a=Number.isFinite(t.mediaDuration)?t.mediaDuration:t.mediaSeekableEnd;return Number.isNaN(a)?0:e*(a-i)+i},ja=class extends He{constructor(){super(),Z(this,Nn),Z(this,Ks),Z(this,Gs),Z(this,qs),Z(this,Fn),Z(this,Ja),Z(this,Bn),Z(this,Ni,null),Z(this,St,void 0),Z(this,$s,void 0),Z(this,Qa,void 0),Z(this,Vs,void 0),Z(this,Ws,void 0),Z(this,Za,void 0),Z(this,Xa,void 0),Z(this,Hi,void 0),Z(this,Fi,void 0),Z(this,za,()=>{ve(this,Nn,ec).call(this)?V(this,St).start():V(this,St).stop()}),Z(this,Hn,a=>{this.dragging||(di(a)&&(this.range.valueAsNumber=a),V(this,Fi)||this.updateBar())}),this.shadowRoot.querySelector("#track").insertAdjacentHTML("afterbegin",'<div id="buffered" part="buffered"></div>'),pe(this,$s,this.shadowRoot.querySelectorAll('[part~="box"]')),pe(this,Vs,this.shadowRoot.querySelector('[part~="preview-box"]')),pe(this,Ws,this.shadowRoot.querySelector('[part~="current-box"]'));let i=getComputedStyle(this);pe(this,Za,parseInt(i.getPropertyValue("--media-box-padding-left"))),pe(this,Xa,parseInt(i.getPropertyValue("--media-box-padding-right"))),pe(this,St,new Fs(this.range,V(this,Hn),60))}static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_PAUSED,o.MEDIA_DURATION,o.MEDIA_SEEKABLE,o.MEDIA_CURRENT_TIME,o.MEDIA_PREVIEW_IMAGE,o.MEDIA_PREVIEW_TIME,o.MEDIA_PREVIEW_CHAPTER,o.MEDIA_BUFFERED,o.MEDIA_PLAYBACK_RATE,o.MEDIA_LOADING,o.MEDIA_ENDED]}connectedCallback(){var e;super.connectedCallback(),this.range.setAttribute("aria-label",c("seek")),V(this,za).call(this),pe(this,Ni,this.getRootNode()),(e=V(this,Ni))==null||e.addEventListener("transitionstart",this)}disconnectedCallback(){var e;super.disconnectedCallback(),V(this,St).stop(),(e=V(this,Ni))==null||e.removeEventListener("transitionstart",this),pe(this,Ni,null)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),i!=a&&(e===o.MEDIA_CURRENT_TIME||e===o.MEDIA_PAUSED||e===o.MEDIA_ENDED||e===o.MEDIA_LOADING||e===o.MEDIA_DURATION||e===o.MEDIA_SEEKABLE?(V(this,St).update({start:Bs(this),duration:this.mediaSeekableEnd-this.mediaSeekableStart,playbackRate:this.mediaPlaybackRate}),V(this,za).call(this),Ap(this)):e===o.MEDIA_BUFFERED&&this.updateBufferedBar(),(e===o.MEDIA_DURATION||e===o.MEDIA_SEEKABLE)&&(this.mediaChaptersCues=V(this,Hi),this.updateBar()))}get mediaChaptersCues(){return V(this,Hi)}set mediaChaptersCues(e){var i;pe(this,Hi,e),this.updateSegments((i=V(this,Hi))==null?void 0:i.map(a=>({start:Bs(this,a.startTime),end:Bs(this,a.endTime)})))}get mediaPaused(){return A(this,o.MEDIA_PAUSED)}set mediaPaused(e){T(this,o.MEDIA_PAUSED,e)}get mediaLoading(){return A(this,o.MEDIA_LOADING)}set mediaLoading(e){T(this,o.MEDIA_LOADING,e)}get mediaDuration(){return L(this,o.MEDIA_DURATION)}set mediaDuration(e){R(this,o.MEDIA_DURATION,e)}get mediaCurrentTime(){return L(this,o.MEDIA_CURRENT_TIME)}set mediaCurrentTime(e){R(this,o.MEDIA_CURRENT_TIME,e)}get mediaPlaybackRate(){return L(this,o.MEDIA_PLAYBACK_RATE,1)}set mediaPlaybackRate(e){R(this,o.MEDIA_PLAYBACK_RATE,e)}get mediaBuffered(){let e=this.getAttribute(o.MEDIA_BUFFERED);return e?e.split(" ").map(i=>i.split(":").map(a=>+a)):[]}set mediaBuffered(e){if(!e){this.removeAttribute(o.MEDIA_BUFFERED);return}let i=e.map(a=>a.join(":")).join(" ");this.setAttribute(o.MEDIA_BUFFERED,i)}get mediaSeekable(){let e=this.getAttribute(o.MEDIA_SEEKABLE);if(e)return e.split(":").map(i=>+i)}set mediaSeekable(e){if(e==null){this.removeAttribute(o.MEDIA_SEEKABLE);return}this.setAttribute(o.MEDIA_SEEKABLE,e.join(":"))}get mediaSeekableEnd(){var e;let[,i=this.mediaDuration]=(e=this.mediaSeekable)!=null?e:[];return i}get mediaSeekableStart(){var e;let[i=0]=(e=this.mediaSeekable)!=null?e:[];return i}get mediaPreviewImage(){return I(this,o.MEDIA_PREVIEW_IMAGE)}set mediaPreviewImage(e){S(this,o.MEDIA_PREVIEW_IMAGE,e)}get mediaPreviewTime(){return L(this,o.MEDIA_PREVIEW_TIME)}set mediaPreviewTime(e){R(this,o.MEDIA_PREVIEW_TIME,e)}get mediaEnded(){return A(this,o.MEDIA_ENDED)}set mediaEnded(e){T(this,o.MEDIA_ENDED,e)}updateBar(){super.updateBar(),this.updateBufferedBar(),this.updateCurrentBox()}updateBufferedBar(){var e;let i=this.mediaBuffered;if(!i.length)return;let a;if(this.mediaEnded)a=1;else{let s=this.mediaCurrentTime,[,n=this.mediaSeekableStart]=(e=i.find(([d,u])=>d<=s&&s<=u))!=null?e:[];a=Bs(this,n)}let{style:r}=W(this.shadowRoot,"#buffered");r.setProperty("width",`${a*100}%`)}updateCurrentBox(){if(!this.shadowRoot.querySelector('slot[name="current"]').assignedElements().length)return;let i=W(this.shadowRoot,"#current-rail"),a=W(this.shadowRoot,'[part~="current-box"]'),r=ve(this,Ks,$n).call(this,V(this,Ws)),s=ve(this,Gs,Vn).call(this,r,this.range.valueAsNumber),n=ve(this,qs,Kn).call(this,r,this.range.valueAsNumber);i.style.transform=`translateX(${s})`,i.style.setProperty("--_range-width",`${r.range.width}`),a.style.setProperty("--_box-shift",`${n}`),a.style.setProperty("--_box-width",`${r.box.width}px`),a.style.setProperty("visibility","initial")}handleEvent(e){switch(super.handleEvent(e),e.type){case"input":ve(this,Bn,ic).call(this);break;case"pointermove":ve(this,Fn,tc).call(this,e);break;case"pointerup":V(this,Fi)&&pe(this,Fi,!1);break;case"pointerdown":pe(this,Fi,!0);break;case"pointerleave":ve(this,Ja,Ys).call(this,null);break;case"transitionstart":ae(e.target,this)&&setTimeout(()=>V(this,za).call(this),0);break}}};Ni=new WeakMap;St=new WeakMap;$s=new WeakMap;Qa=new WeakMap;Vs=new WeakMap;Ws=new WeakMap;Za=new WeakMap;Xa=new WeakMap;Hi=new WeakMap;Fi=new WeakMap;za=new WeakMap;Nn=new WeakSet;ec=function(){return this.isConnected&&!this.mediaPaused&&!this.mediaLoading&&!this.mediaEnded&&this.mediaSeekableEnd>0&&Rr(this)};Hn=new WeakMap;Ks=new WeakSet;$n=function(t){var e;let a=((e=this.getAttribute("bounds")?Re(this,`#${this.getAttribute("bounds")}`):this.parentElement)!=null?e:this).getBoundingClientRect(),r=this.range.getBoundingClientRect(),s=t.offsetWidth,n=-(r.left-a.left-s/2),d=a.right-r.left-s/2;return{box:{width:s,min:n,max:d},bounds:a,range:r}};Gs=new WeakSet;Vn=function(t,e){let i=`${e*100}%`,{width:a,min:r,max:s}=t.box;if(!a)return i;if(Number.isNaN(r)||(i=`max(${`calc(1 / var(--_range-width) * 100 * ${r}% + var(--media-box-padding-left))`}, ${i})`),!Number.isNaN(s)){let d=`calc(1 / var(--_range-width) * 100 * ${s}% - var(--media-box-padding-right))`;i=`min(${i}, ${d})`}return i};qs=new WeakSet;Kn=function(t,e){let{width:i,min:a,max:r}=t.box,s=e*t.range.width;if(s<a+V(this,Za)){let n=t.range.left-t.bounds.left-V(this,Za);return`${s-i/2+n}px`}if(s>r-V(this,Xa)){let n=t.bounds.right-t.range.right-V(this,Xa);return`${s+i/2-n-t.range.width}px`}return 0};Fn=new WeakSet;tc=function(t){let e=[...V(this,$s)].some(_=>t.composedPath().includes(_));if(!this.dragging&&(e||!t.composedPath().includes(this))){ve(this,Ja,Ys).call(this,null);return}let i=this.mediaSeekableEnd;if(!i)return;let a=W(this.shadowRoot,"#preview-rail"),r=W(this.shadowRoot,'[part~="preview-box"]'),s=ve(this,Ks,$n).call(this,V(this,Vs)),n=(t.clientX-s.range.left)/s.range.width;n=Math.max(0,Math.min(1,n));let d=ve(this,Gs,Vn).call(this,s,n),u=ve(this,qs,Kn).call(this,s,n);a.style.transform=`translateX(${d})`,a.style.setProperty("--_range-width",`${s.range.width}`),r.style.setProperty("--_box-shift",`${u}`),r.style.setProperty("--_box-width",`${s.box.width}px`);let p=Math.round(V(this,Qa))-Math.round(n*i);Math.abs(p)<1&&n>.01&&n<.99||(pe(this,Qa,n*i),ve(this,Ja,Ys).call(this,V(this,Qa)))};Ja=new WeakSet;Ys=function(t){this.dispatchEvent(new l.CustomEvent(h.MEDIA_PREVIEW_REQUEST,{composed:!0,bubbles:!0,detail:t}))};Bn=new WeakSet;ic=function(){V(this,St).stop();let t=ac(this);this.dispatchEvent(new l.CustomEvent(h.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:t}))};ja.shadowRootOptions={mode:"open"};ja.getContainerTemplateHTML=Tp;l.customElements.get("media-time-range")||l.customElements.define("media-time-range",ja);var kp=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},rc=(t,e,i)=>(kp(t,e,"read from private field"),i?i.call(t):e.get(t)),yp=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},zs,Sp=1,Ip=t=>t.mediaMuted?0:t.mediaVolume,Mp=t=>`${Math.round(t*100)}%`,Gn=class extends He{constructor(){super(...arguments),yp(this,zs,()=>{let e=this.range.value,i=new l.CustomEvent(h.MEDIA_VOLUME_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(i)})}static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_VOLUME,o.MEDIA_MUTED,o.MEDIA_VOLUME_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),this.range.setAttribute("aria-label",c("volume")),this.range.addEventListener("input",rc(this,zs))}disconnectedCallback(){this.range.removeEventListener("input",rc(this,zs)),super.disconnectedCallback()}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),(e===o.MEDIA_VOLUME||e===o.MEDIA_MUTED)&&(this.range.valueAsNumber=Ip(this),this.range.setAttribute("aria-valuetext",Mp(this.range.valueAsNumber)),this.updateBar())}get mediaVolume(){return L(this,o.MEDIA_VOLUME,Sp)}set mediaVolume(e){R(this,o.MEDIA_VOLUME,e)}get mediaMuted(){return A(this,o.MEDIA_MUTED)}set mediaMuted(e){T(this,o.MEDIA_MUTED,e)}get mediaVolumeUnavailable(){return I(this,o.MEDIA_VOLUME_UNAVAILABLE)}set mediaVolumeUnavailable(e){S(this,o.MEDIA_VOLUME_UNAVAILABLE,e)}};zs=new WeakMap;l.customElements.get("media-volume-range")||l.customElements.define("media-volume-range",Gn);function wp(t){return`
      <style>
        :host {
          min-width: 4ch;
          padding: var(--media-button-padding, var(--media-control-padding, 10px 5px));
          width: 100%;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 1rem;
          font-weight: var(--media-button-font-weight, normal);
        }

        #checked-indicator {
          display: none;
        }

        :host([${o.MEDIA_LOOP}]) #checked-indicator {
          display: block;
        }
      </style>
      
      <span id="icon">
     </span>

      <div id="checked-indicator">
        <svg aria-hidden="true" viewBox="0 1 24 24" part="checked-indicator indicator">
          <path d="m10 15.17 9.193-9.191 1.414 1.414-10.606 10.606-6.364-6.364 1.414-1.414 4.95 4.95Z"/>
        </svg>
      </div>
    `}function Lp(){return c("Loop")}var er=class extends O{constructor(){super(...arguments),this.container=null}static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_LOOP]}connectedCallback(){var e;super.connectedCallback(),this.container=((e=this.shadowRoot)==null?void 0:e.querySelector("#icon"))||null,this.container&&(this.container.textContent=c("Loop"))}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===o.MEDIA_LOOP&&this.container&&this.setAttribute("aria-checked",this.mediaLoop?"true":"false")}get mediaLoop(){return A(this,o.MEDIA_LOOP)}set mediaLoop(e){T(this,o.MEDIA_LOOP,e)}handleClick(){let e=!this.mediaLoop,i=new l.CustomEvent(h.MEDIA_LOOP_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(i)}};er.getSlotTemplateHTML=wp;er.getTooltipContentHTML=Lp;l.customElements.get("media-loop-button")||l.customElements.define("media-loop-button",er);var dc=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},D=(t,e,i)=>(dc(t,e,"read from private field"),i?i.call(t):e.get(t)),Ye=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},dt=(t,e,i,a)=>(dc(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),Bi,Qs,Qt,tr,It,Mt,wt,Zt,Wi,Zs,Le,sc=1,oc=0,Cp=1,Dp={processCallback(t,e,i){if(i){for(let[a,r]of e)if(a in i){let s=i[a];typeof s=="boolean"&&r instanceof ze&&typeof r.element[r.attributeName]=="boolean"?r.booleanValue=s:typeof s=="function"&&r instanceof ze?r.element[r.attributeName]=s:r.value=s}}}},Xt=class extends l.DocumentFragment{constructor(e,i,a=Dp){var r;super(),Ye(this,Bi,void 0),Ye(this,Qs,void 0),this.append(e.content.cloneNode(!0)),dt(this,Bi,uc(this)),dt(this,Qs,a),(r=a.createCallback)==null||r.call(a,this,D(this,Bi),i),a.processCallback(this,D(this,Bi),i)}update(e){D(this,Qs).processCallback(this,D(this,Bi),e)}};Bi=new WeakMap;Qs=new WeakMap;var uc=(t,e=[])=>{let i,a;for(let r of t.attributes||[])if(r.value.includes("{{")){let s=new qn;for([i,a]of lc(r.value))if(!i)s.append(a);else{let n=new ze(t,r.name,r.namespaceURI);s.append(n),e.push([a,n])}r.value=s.toString()}for(let r of t.childNodes)if(r.nodeType===sc&&!(r instanceof HTMLTemplateElement))uc(r,e);else{let s=r.data;if(r.nodeType===sc||s.includes("{{")){let n=[];if(s)for([i,a]of lc(s))if(!i)n.push(new Text(a));else{let d=new Js(t);n.push(d),e.push([a,d])}else if(r instanceof HTMLTemplateElement){let d=new ir(t,r);n.push(d),e.push([d.expression,d])}r.replaceWith(...n.flatMap(d=>d.replacementNodes||[d]))}}return e},nc={},lc=t=>{let e="",i=0,a=nc[t],r=0,s;if(a)return a;for(a=[];s=t[r];r++)s==="{"&&t[r+1]==="{"&&t[r-1]!=="\\"&&t[r+2]&&++i==1?(e&&a.push([oc,e]),e="",r++):s==="}"&&t[r+1]==="}"&&t[r-1]!=="\\"&&!--i?(a.push([Cp,e.trim()]),e="",r++):e+=s||"";return e&&a.push([oc,(i>0?"{{":"")+e]),nc[t]=a},Rp=11,Xs=class{get value(){return""}set value(e){}toString(){return this.value}},cc=new WeakMap,qn=class{constructor(){Ye(this,Qt,[])}[Symbol.iterator](){return D(this,Qt).values()}get length(){return D(this,Qt).length}item(e){return D(this,Qt)[e]}append(...e){for(let i of e)i instanceof ze&&cc.set(i,this),D(this,Qt).push(i)}toString(){return D(this,Qt).join("")}};Qt=new WeakMap;var ze=class extends Xs{constructor(e,i,a){super(),Ye(this,Zt),Ye(this,tr,""),Ye(this,It,void 0),Ye(this,Mt,void 0),Ye(this,wt,void 0),dt(this,It,e),dt(this,Mt,i),dt(this,wt,a)}get attributeName(){return D(this,Mt)}get attributeNamespace(){return D(this,wt)}get element(){return D(this,It)}get value(){return D(this,tr)}set value(e){D(this,tr)!==e&&(dt(this,tr,e),!D(this,Zt,Wi)||D(this,Zt,Wi).length===1?e==null?D(this,It).removeAttributeNS(D(this,wt),D(this,Mt)):D(this,It).setAttributeNS(D(this,wt),D(this,Mt),e):D(this,It).setAttributeNS(D(this,wt),D(this,Mt),D(this,Zt,Wi).toString()))}get booleanValue(){return D(this,It).hasAttributeNS(D(this,wt),D(this,Mt))}set booleanValue(e){if(!D(this,Zt,Wi)||D(this,Zt,Wi).length===1)this.value=e?"":null;else throw new DOMException("Value is not fully templatized")}};tr=new WeakMap;It=new WeakMap;Mt=new WeakMap;wt=new WeakMap;Zt=new WeakSet;Wi=function(){return cc.get(this)};var Js=class extends Xs{constructor(e,i){super(),Ye(this,Zs,void 0),Ye(this,Le,void 0),dt(this,Zs,e),dt(this,Le,i?[...i]:[new Text])}get replacementNodes(){return D(this,Le)}get parentNode(){return D(this,Zs)}get nextSibling(){return D(this,Le)[D(this,Le).length-1].nextSibling}get previousSibling(){return D(this,Le)[0].previousSibling}get value(){return D(this,Le).map(e=>e.textContent).join("")}set value(e){this.replace(e)}replace(...e){let i=e.flat().flatMap(a=>a==null?[new Text]:a.forEach?[...a]:a.nodeType===Rp?[...a.childNodes]:a.nodeType?[a]:[new Text(a)]);i.length||i.push(new Text),dt(this,Le,xp(D(this,Le)[0].parentNode,D(this,Le),i,this.nextSibling))}};Zs=new WeakMap;Le=new WeakMap;var ir=class extends Js{constructor(e,i){let a=i.getAttribute("directive")||i.getAttribute("type"),r=i.getAttribute("expression")||i.getAttribute(a)||"";r.startsWith("{{")&&(r=r.trim().slice(2,-2).trim()),super(e),this.expression=r,this.template=i,this.directive=a}};function xp(t,e,i,a=null){let r=0,s,n,d,u=i.length,p=e.length;for(;r<u&&r<p&&e[r]==i[r];)r++;for(;r<u&&r<p&&i[u-1]==e[p-1];)a=i[--p,--u];if(r==p)for(;r<u;)t.insertBefore(i[r++],a);if(r==u)for(;r<p;)t.removeChild(e[r++]);else{for(s=e[r];r<u;)d=i[r++],n=s?s.nextSibling:a,s==d?s=n:r<u&&i[r]==n?(t.replaceChild(d,s),s=n):t.insertBefore(d,s);for(;s!=a;)n=s.nextSibling,t.removeChild(s),s=n}return i}var hc={string:t=>String(t)},eo=class{constructor(e){this.template=e,this.state=void 0}},Jt=new WeakMap,jt=new WeakMap,Yn={partial:(t,e)=>{e[t.expression]=new eo(t.template)},if:(t,e)=>{var i;if(pc(t.expression,e))if(Jt.get(t)!==t.template){Jt.set(t,t.template);let a=new Xt(t.template,e,to);t.replace(a),jt.set(t,a)}else(i=jt.get(t))==null||i.update(e);else t.replace(""),Jt.delete(t),jt.delete(t)}},Op=Object.keys(Yn),to={processCallback(t,e,i){var a,r;if(i)for(let[s,n]of e){if(n instanceof ir){if(!n.directive){let u=Op.find(p=>n.template.hasAttribute(p));u&&(n.directive=u,n.expression=n.template.getAttribute(u))}(a=Yn[n.directive])==null||a.call(Yn,n,i);continue}let d=pc(s,i);if(d instanceof eo){Jt.get(n)!==d.template?(Jt.set(n,d.template),d=new Xt(d.template,d.state,to),n.value=d,jt.set(n,d)):(r=jt.get(n))==null||r.update(d.state);continue}d?(n instanceof ze&&n.attributeName.startsWith("aria-")&&(d=String(d)),n instanceof ze?typeof d=="boolean"?n.booleanValue=d:typeof d=="function"?n.element[n.attributeName]=d:n.value=d:(n.value=d,Jt.delete(n),jt.delete(n))):n instanceof ze?n.value=void 0:(n.value=void 0,Jt.delete(n),jt.delete(n))}}},mc={"!":t=>!t,"!!":t=>!!t,"==":(t,e)=>t==e,"!=":(t,e)=>t!=e,">":(t,e)=>t>e,">=":(t,e)=>t>=e,"<":(t,e)=>t<e,"<=":(t,e)=>t<=e,"??":(t,e)=>t??e,"|":(t,e)=>{var i;return(i=hc[e])==null?void 0:i.call(hc,t)}};function Up(t){return Pp(t,{boolean:/true|false/,number:/-?\d+\.?\d*/,string:/(["'])((?:\\.|[^\\])*?)\1/,operator:/[!=><][=!]?|\?\?|\|/,ws:/\s+/,param:/[$a-z_][$\w]*/i}).filter(({type:e})=>e!=="ws")}function pc(t,e={}){var i,a,r,s,n,d,u;let p=Up(t);if(p.length===0||p.some(({type:_})=>!_))return ar(t);if(((i=p[0])==null?void 0:i.token)===">"){let _=e[(a=p[1])==null?void 0:a.token];if(!_)return ar(t);let b={...e};_.state=b;let f=p.slice(2);for(let v=0;v<f.length;v+=3){let y=(r=f[v])==null?void 0:r.token,g=(s=f[v+1])==null?void 0:s.token,C=(n=f[v+2])==null?void 0:n.token;y&&g==="="&&(b[y]=rr(C,e))}return _}if(p.length===1)return js(p[0])?rr(p[0].token,e):ar(t);if(p.length===2){let _=(d=p[0])==null?void 0:d.token,b=mc[_];if(!b||!js(p[1]))return ar(t);let f=rr(p[1].token,e);return b(f)}if(p.length===3){let _=(u=p[1])==null?void 0:u.token,b=mc[_];if(!b||!js(p[0])||!js(p[2]))return ar(t);let f=rr(p[0].token,e);if(_==="|")return b(f,p[2].token);let v=rr(p[2].token,e);return b(f,v)}}function ar(t){return console.warn(`Warning: invalid expression \`${t}\``),!1}function js({type:t}){return["number","boolean","string","param"].includes(t)}function rr(t,e){let i=t[0],a=t.slice(-1);return t==="true"||t==="false"?t==="true":i===a&&["'",'"'].includes(i)?t.slice(1,-1):yr(t)?parseFloat(t):e[t]}function Pp(t,e){let i,a,r,s=[];for(;t;){r=null,i=t.length;for(let n in e)a=e[n].exec(t),a&&a.index<i&&(r={token:a[0],type:n,matches:a.slice(1)},i=a.index);i&&s.push({token:t.substr(0,i),type:void 0}),r&&s.push(r),t=t.substr(i+(r?r.token.length:0))}return s}var Jn=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Lt=(t,e,i)=>(Jn(t,e,"read from private field"),i?i.call(t):e.get(t)),ei=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},ut=(t,e,i,a)=>(Jn(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),zn=(t,e,i)=>(Jn(t,e,"access private method"),i),Vi,io,Ki,$i,Zn,vc,ao,Xn,sr,Qn={mediatargetlivewindow:"targetlivewindow",mediastreamtype:"streamtype"},fc=N.createElement("template");fc.innerHTML=`
  <style>
    :host {
      display: inline-block;
      line-height: 0;
    }

    media-controller {
      width: 100%;
      height: 100%;
    }

    media-captions-button:not([mediasubtitleslist]),
    media-captions-menu:not([mediasubtitleslist]),
    media-captions-menu-button:not([mediasubtitleslist]),
    media-audio-track-menu[mediaaudiotrackunavailable],
    media-audio-track-menu-button[mediaaudiotrackunavailable],
    media-rendition-menu[mediarenditionunavailable],
    media-rendition-menu-button[mediarenditionunavailable],
    media-volume-range[mediavolumeunavailable],
    media-airplay-button[mediaairplayunavailable],
    media-fullscreen-button[mediafullscreenunavailable],
    media-cast-button[mediacastunavailable],
    media-pip-button[mediapipunavailable] {
      display: none;
    }
  </style>
`;var ti=class extends l.HTMLElement{constructor(){super(),ei(this,Zn),ei(this,ao),ei(this,Vi,void 0),ei(this,io,void 0),ei(this,Ki,void 0),ei(this,$i,void 0),ei(this,sr,void 0),this.shadowRoot?this.renderRoot=this.shadowRoot:(this.renderRoot=this.attachShadow({mode:"open"}),this.createRenderer()),ut(this,$i,new MutationObserver(e=>{var i;this.mediaController&&!((i=this.mediaController)!=null&&i.breakpointsComputed)||e.some(a=>{let r=a.target;return r===this?!0:r.localName!=="media-controller"?!1:!!(Qn[a.attributeName]||a.attributeName.startsWith("breakpoint"))})&&this.render()})),ut(this,sr,this.render.bind(this)),zn(this,Zn,vc).call(this,"template")}get mediaController(){return this.renderRoot.querySelector("media-controller")}get template(){var e;return(e=Lt(this,Vi))!=null?e:this.constructor.template}set template(e){if(e===null){this.removeAttribute("template");return}typeof e=="string"?this.setAttribute("template",e):e instanceof HTMLTemplateElement&&(ut(this,Vi,e),ut(this,Ki,null),this.createRenderer())}get props(){var e,i,a;let r=[...Array.from((i=(e=this.mediaController)==null?void 0:e.attributes)!=null?i:[]).filter(({name:n})=>Qn[n]||n.startsWith("breakpoint")),...Array.from(this.attributes)],s={};for(let n of r){let d=(a=Qn[n.name])!=null?a:Ad(n.name),{value:u}=n;u!=null?(yr(u)&&(u=parseFloat(u)),s[d]=u===""?!0:u):s[d]=!1}return s}attributeChangedCallback(e,i,a){e==="template"&&i!=a&&zn(this,ao,Xn).call(this)}connectedCallback(){this.addEventListener(De.BREAKPOINTS_COMPUTED,Lt(this,sr)),Lt(this,$i).observe(this,{attributes:!0}),Lt(this,$i).observe(this.renderRoot,{attributes:!0,subtree:!0}),zn(this,ao,Xn).call(this)}disconnectedCallback(){this.removeEventListener(De.BREAKPOINTS_COMPUTED,Lt(this,sr)),Lt(this,$i).disconnect()}createRenderer(){this.template instanceof HTMLTemplateElement&&this.template!==Lt(this,io)&&(ut(this,io,this.template),this.renderer=new Xt(this.template,this.props,this.constructor.processor),this.renderRoot.textContent="",this.renderRoot.append(fc.content.cloneNode(!0),this.renderer))}render(){var e;(e=this.renderer)==null||e.update(this.props)}};Vi=new WeakMap;io=new WeakMap;Ki=new WeakMap;$i=new WeakMap;Zn=new WeakSet;vc=function(t){if(Object.prototype.hasOwnProperty.call(this,t)){let e=this[t];delete this[t],this[t]=e}};ao=new WeakSet;Xn=function(){var t;let e=this.getAttribute("template");if(!e||e===Lt(this,Ki))return;let i=this.getRootNode(),a=(t=i?.getElementById)==null?void 0:t.call(i,e);if(a){ut(this,Ki,e),ut(this,Vi,a),this.createRenderer();return}Np(e)&&(ut(this,Ki,e),Hp(e).then(r=>{let s=N.createElement("template");s.innerHTML=r,ut(this,Vi,s),this.createRenderer()}).catch(console.error))};sr=new WeakMap;ti.observedAttributes=["template"];ti.processor=to;function Np(t){if(!/^(\/|\.\/|https?:\/\/)/.test(t))return!1;let e=/^https?:\/\//.test(t)?void 0:location.origin;try{new URL(t,e)}catch{return!1}return!0}async function Hp(t){let e=await fetch(t);if(e.status!==200)throw new Error(`Failed to load resource: the server responded with a status of ${e.status}`);return e.text()}l.customElements.get("media-theme")||l.customElements.define("media-theme",ti);function Ec({anchor:t,floating:e,placement:i}){let a=Fp({anchor:t,floating:e}),{x:r,y:s}=Wp(a,i);return{x:r,y:s}}function Fp({anchor:t,floating:e}){return{anchor:Bp(t,e.offsetParent),floating:{x:0,y:0,width:e.offsetWidth,height:e.offsetHeight}}}function Bp(t,e){var i;let a=t.getBoundingClientRect(),r=(i=e?.getBoundingClientRect())!=null?i:{x:0,y:0};return{x:a.x-r.x,y:a.y-r.y,width:a.width,height:a.height}}function Wp({anchor:t,floating:e},i){let a=$p(i)==="x"?"y":"x",r=a==="y"?"height":"width",s=gc(i),n=t.x+t.width/2-e.width/2,d=t.y+t.height/2-e.height/2,u=t[r]/2-e[r]/2,p;switch(s){case"top":p={x:n,y:t.y-e.height};break;case"bottom":p={x:n,y:t.y+t.height};break;case"right":p={x:t.x+t.width,y:d};break;case"left":p={x:t.x-e.width,y:d};break;default:p={x:t.x,y:t.y}}switch(i.split("-")[1]){case"start":p[a]-=u;break;case"end":p[a]+=u;break}return p}function gc(t){return t.split("-")[0]}function $p(t){return["top","bottom"].includes(gc(t))?"y":"x"}var Ct=class extends Event{constructor({action:e="auto",relatedTarget:i,...a}){super("invoke",a),this.action=e,this.relatedTarget=i}},ro=class extends Event{constructor({newState:e,oldState:i,...a}){super("toggle",a),this.newState=e,this.oldState=i}};var ul=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},U=(t,e,i)=>(ul(t,e,"read from private field"),i?i.call(t):e.get(t)),H=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},fe=(t,e,i,a)=>(ul(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),F=(t,e,i)=>(ul(t,e,"access private method"),i),Qe,Dt,ct,so,or,ai,dr,jn,bc,lo,cl,uo,oo,el,tl,_c,il,Ac,al,Tc,Gi,qi,Yi,ur,co,hl,rl,kc,ml,yc,sl,Sc,pl,Ic,ol,Mc,nl,wc,nr,ho,ll,Lc,lr,mo,no,dl;function Ze({type:t,text:e,value:i,checked:a}){let r=N.createElement("media-chrome-menu-item");r.type=t??"",r.part.add("menu-item"),t&&r.part.add(t),r.value=i,r.checked=a;let s=N.createElement("span");return s.textContent=e,r.append(s),r}function Ce(t,e){let i=t.querySelector(`:scope > [slot="${e}"]`);if(i?.nodeName=="SLOT"&&(i=i.assignedElements({flatten:!0})[0]),i)return i=i.cloneNode(!0),i;let a=t.shadowRoot.querySelector(`[name="${e}"] > svg`);return a?a.cloneNode(!0):""}function Vp(t){return`
    <style>
      :host {
        font: var(--media-font,
          var(--media-font-weight, normal)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        --_menu-bg: rgb(20 20 30 / .8);
        background: var(--media-menu-background, var(--media-control-background, var(--media-secondary-color, var(--_menu-bg))));
        border-radius: var(--media-menu-border-radius);
        border: var(--media-menu-border, none);
        display: var(--media-menu-display, inline-flex) !important;
        
        transition: var(--media-menu-transition-in,
          visibility 0s,
          opacity .2s ease-out,
          transform .15s ease-out,
          left .2s ease-in-out,
          min-width .2s ease-in-out,
          min-height .2s ease-in-out
        ) !important;
        
        visibility: var(--media-menu-visibility, visible);
        opacity: var(--media-menu-opacity, 1);
        max-height: var(--media-menu-max-height, var(--_menu-max-height, 300px));
        transform: var(--media-menu-transform-in, translateY(0) scale(1));
        flex-direction: column;
        
        min-height: 0;
        position: relative;
        bottom: var(--_menu-bottom);
        box-sizing: border-box;
      } 

      @-moz-document url-prefix() {
        :host{
          --_menu-bg: rgb(20 20 30);
        }
      }

      :host([hidden]) {
        transition: var(--media-menu-transition-out,
          visibility .15s ease-in,
          opacity .15s ease-in,
          transform .15s ease-in
        ) !important;
        visibility: var(--media-menu-hidden-visibility, hidden);
        opacity: var(--media-menu-hidden-opacity, 0);
        max-height: var(--media-menu-hidden-max-height,
          var(--media-menu-max-height, var(--_menu-max-height, 300px)));
        transform: var(--media-menu-transform-out, translateY(2px) scale(.99));
        pointer-events: none;
      }

      :host([slot="submenu"]) {
        background: none;
        width: 100%;
        min-height: 100%;
        position: absolute;
        bottom: 0;
        right: -100%;
      }

      #container {
        display: flex;
        flex-direction: column;
        min-height: 0;
        transition: transform .2s ease-out;
        transform: translate(0, 0);
      }

      #container.has-expanded {
        transition: transform .2s ease-in;
        transform: translate(-100%, 0);
      }

      button {
        background: none;
        color: inherit;
        border: none;
        padding: 0;
        font: inherit;
        outline: inherit;
        display: inline-flex;
        align-items: center;
      }

      slot[name="header"][hidden] {
        display: none;
      }

      slot[name="header"] > *,
      slot[name="header"]::slotted(*) {
        padding: .4em .7em;
        border-bottom: 1px solid rgb(255 255 255 / .25);
        cursor: var(--media-cursor, default);
      }

      slot[name="header"] > button[part~="back"],
      slot[name="header"]::slotted(button[part~="back"]) {
        cursor: var(--media-cursor, pointer);
      }

      svg[part~="back"] {
        height: var(--media-menu-icon-height, var(--media-control-height, 24px));
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        display: block;
        margin-right: .5ch;
      }

      slot:not([name]) {
        gap: var(--media-menu-gap);
        flex-direction: var(--media-menu-flex-direction, column);
        overflow: var(--media-menu-overflow, hidden auto);
        display: flex;
        min-height: 0;
      }

      :host([role="menu"]) slot:not([name]) {
        padding-block: .4em;
      }

      slot:not([name])::slotted([role="menu"]) {
        background: none;
      }

      media-chrome-menu-item > span {
        margin-right: .5ch;
        max-width: var(--media-menu-item-max-width);
        text-overflow: ellipsis;
        overflow: hidden;
      }
    </style>
    <style id="layout-row" media="width:0">

      slot[name="header"] > *,
      slot[name="header"]::slotted(*) {
        padding: .4em .5em;
      }

      slot:not([name]) {
        gap: var(--media-menu-gap, .25em);
        flex-direction: var(--media-menu-flex-direction, row);
        padding-inline: .5em;
      }

      media-chrome-menu-item {
        padding: .3em .5em;
      }

      media-chrome-menu-item[aria-checked="true"] {
        background: var(--media-menu-item-checked-background, rgb(255 255 255 / .2));
      }

      
      media-chrome-menu-item::part(checked-indicator) {
        display: var(--media-menu-item-checked-indicator-display, none);
      }
    </style>
    <div id="container" part="container">
      <slot name="header" hidden>
        <button part="back button" aria-label="Back to previous menu">
          <slot name="back-icon">
            <svg aria-hidden="true" viewBox="0 0 20 24" part="back indicator">
              <path d="m11.88 17.585.742-.669-4.2-4.665 4.2-4.666-.743-.669-4.803 5.335 4.803 5.334Z"/>
            </svg>
          </slot>
          <slot name="title"></slot>
        </button>
      </slot>
      <slot></slot>
    </div>
    <slot name="checked-indicator" hidden></slot>
  `}var ii={STYLE:"style",HIDDEN:"hidden",DISABLED:"disabled",ANCHOR:"anchor"},Y=class extends l.HTMLElement{constructor(){if(super(),H(this,jn),H(this,lo),H(this,oo),H(this,tl),H(this,il),H(this,al),H(this,Yi),H(this,co),H(this,rl),H(this,ml),H(this,sl),H(this,pl),H(this,ol),H(this,nl),H(this,nr),H(this,ll),H(this,lr),H(this,no),H(this,Qe,null),H(this,Dt,null),H(this,ct,null),H(this,so,new Set),H(this,or,void 0),H(this,ai,!1),H(this,dr,null),H(this,uo,()=>{let e=U(this,so),i=new Set(this.items);for(let a of e)i.has(a)||this.dispatchEvent(new CustomEvent("removemenuitem",{detail:a}));for(let a of i)e.has(a)||this.dispatchEvent(new CustomEvent("addmenuitem",{detail:a}));fe(this,so,i)}),H(this,Gi,()=>{F(this,Yi,ur).call(this),F(this,co,hl).call(this,!1)}),H(this,qi,()=>{F(this,Yi,ur).call(this)}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=$(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}this.container=this.shadowRoot.querySelector("#container"),this.defaultSlot=this.shadowRoot.querySelector("slot:not([name])"),fe(this,or,new MutationObserver(U(this,uo)))}static get observedAttributes(){return[ii.DISABLED,ii.HIDDEN,ii.STYLE,ii.ANCHOR,M.MEDIA_CONTROLLER]}static formatMenuItemText(e,i){return e}enable(){this.addEventListener("click",this),this.addEventListener("focusout",this),this.addEventListener("keydown",this),this.addEventListener("invoke",this),this.addEventListener("toggle",this)}disable(){this.removeEventListener("click",this),this.removeEventListener("focusout",this),this.removeEventListener("keyup",this),this.removeEventListener("invoke",this),this.removeEventListener("toggle",this)}handleEvent(e){switch(e.type){case"slotchange":F(this,jn,bc).call(this,e);break;case"invoke":F(this,tl,_c).call(this,e);break;case"click":F(this,rl,kc).call(this,e);break;case"toggle":F(this,sl,Sc).call(this,e);break;case"focusout":F(this,ol,Mc).call(this,e);break;case"keydown":F(this,nl,wc).call(this,e);break}}connectedCallback(){var e,i;U(this,or).observe(this.defaultSlot,{childList:!0}),fe(this,dr,va(this.shadowRoot,":host")),F(this,oo,el).call(this),this.hasAttribute("disabled")||this.enable(),this.role||(this.role="menu"),fe(this,Qe,Lr(this)),(i=(e=U(this,Qe))==null?void 0:e.associateElement)==null||i.call(e,this),this.hidden||(at(cr(this),U(this,Gi)),at(this,U(this,qi))),F(this,lo,cl).call(this),this.shadowRoot.addEventListener("slotchange",this)}disconnectedCallback(){var e,i;U(this,or).disconnect(),rt(cr(this),U(this,Gi)),rt(this,U(this,qi)),this.disable(),(i=(e=U(this,Qe))==null?void 0:e.unassociateElement)==null||i.call(e,this),fe(this,Qe,null),fe(this,Dt,null),fe(this,ct,null),this.shadowRoot.removeEventListener("slotchange",this)}attributeChangedCallback(e,i,a){var r,s,n,d;e===ii.HIDDEN&&a!==i?(U(this,ai)||fe(this,ai,!0),this.hidden?F(this,al,Tc).call(this):F(this,il,Ac).call(this),this.dispatchEvent(new ro({oldState:this.hidden?"open":"closed",newState:this.hidden?"closed":"open",bubbles:!0}))):e===M.MEDIA_CONTROLLER?(i&&((s=(r=U(this,Qe))==null?void 0:r.unassociateElement)==null||s.call(r,this),fe(this,Qe,null)),a&&this.isConnected&&(fe(this,Qe,Lr(this)),(d=(n=U(this,Qe))==null?void 0:n.associateElement)==null||d.call(n,this))):e===ii.DISABLED&&a!==i?a==null?this.enable():this.disable():e===ii.STYLE&&a!==i&&F(this,oo,el).call(this)}formatMenuItemText(e,i){return this.constructor.formatMenuItemText(e,i)}get anchor(){return this.getAttribute("anchor")}set anchor(e){this.setAttribute("anchor",`${e}`)}get anchorElement(){var e;return this.anchor?(e=Ut(this))==null?void 0:e.querySelector(`#${this.anchor}`):null}get items(){return this.defaultSlot.assignedElements({flatten:!0}).filter(Kp)}get radioGroupItems(){return this.items.filter(e=>e.role==="menuitemradio")}get checkedItems(){return this.items.filter(e=>e.checked)}get value(){var e,i;return(i=(e=this.checkedItems[0])==null?void 0:e.value)!=null?i:""}set value(e){let i=this.items.find(a=>a.value===e);i&&F(this,no,dl).call(this,i)}focus(){if(fe(this,Dt,pa()),this.items.length){F(this,lr,mo).call(this,this.items[0]),this.items[0].focus();return}let e=this.querySelector('[autofocus], [tabindex]:not([tabindex="-1"]), [role="menu"]');e?.focus()}handleSelect(e){var i;let a=F(this,nr,ho).call(this,e);a&&(F(this,no,dl).call(this,a,a.type==="checkbox"),U(this,ct)&&!this.hidden&&((i=U(this,Dt))==null||i.focus(),this.hidden=!0))}get keysUsed(){return["Enter","Escape","Tab"," ","ArrowDown","ArrowUp","Home","End"]}handleMove(e){var i,a;let{key:r}=e,s=this.items,n=(a=(i=F(this,nr,ho).call(this,e))!=null?i:F(this,ll,Lc).call(this))!=null?a:s[0],d=s.indexOf(n),u=Math.max(0,d);r==="ArrowDown"?u++:r==="ArrowUp"?u--:e.key==="Home"?u=0:e.key==="End"&&(u=s.length-1),u<0&&(u=s.length-1),u>s.length-1&&(u=0),F(this,lr,mo).call(this,s[u]),s[u].focus()}};Qe=new WeakMap;Dt=new WeakMap;ct=new WeakMap;so=new WeakMap;or=new WeakMap;ai=new WeakMap;dr=new WeakMap;jn=new WeakSet;bc=function(t){let e=t.target;for(let i of e.assignedNodes({flatten:!0}))i.nodeType===3&&i.textContent.trim()===""&&i.remove();["header","title"].includes(e.name)&&F(this,lo,cl).call(this),e.name||U(this,uo).call(this)};lo=new WeakSet;cl=function(){let t=this.shadowRoot.querySelector('slot[name="header"]'),e=this.shadowRoot.querySelector('slot[name="title"]');t.hidden=e.assignedNodes().length===0&&t.assignedNodes().length===0};uo=new WeakMap;oo=new WeakSet;el=function(){var t;let e=this.shadowRoot.querySelector("#layout-row"),i=(t=getComputedStyle(this).getPropertyValue("--media-menu-layout"))==null?void 0:t.trim();e.setAttribute("media",i==="row"?"":"width:0")};tl=new WeakSet;_c=function(t){fe(this,ct,t.relatedTarget),ae(this,t.relatedTarget)||(this.hidden=!this.hidden)};il=new WeakSet;Ac=function(){var t;(t=U(this,ct))==null||t.setAttribute("aria-expanded","true"),this.addEventListener("transitionend",()=>this.focus(),{once:!0}),at(cr(this),U(this,Gi)),at(this,U(this,qi))};al=new WeakSet;Tc=function(){var t;(t=U(this,ct))==null||t.setAttribute("aria-expanded","false"),rt(cr(this),U(this,Gi)),rt(this,U(this,qi))};Gi=new WeakMap;qi=new WeakMap;Yi=new WeakSet;ur=function(t){if(this.hasAttribute("mediacontroller")&&!this.anchor||this.hidden||!this.anchorElement)return;let{x:e,y:i}=Ec({anchor:this.anchorElement,floating:this,placement:"top-start"});t??(t=this.offsetWidth);let r=cr(this).getBoundingClientRect(),s=r.width-e-t,n=r.height-i-this.offsetHeight,{style:d}=U(this,dr);d.setProperty("position","absolute"),d.setProperty("right",`${Math.max(0,s)}px`),d.setProperty("--_menu-bottom",`${n}px`);let u=getComputedStyle(this),_=d.getPropertyValue("--_menu-bottom")===u.bottom?n:parseFloat(u.bottom),b=r.height-_-parseFloat(u.marginBottom);this.style.setProperty("--_menu-max-height",`${b}px`)};co=new WeakSet;hl=function(t){let e=this.querySelector('[role="menuitem"][aria-haspopup][aria-expanded="true"]'),i=e?.querySelector('[role="menu"]'),{style:a}=U(this,dr);if(t||a.setProperty("--media-menu-transition-in","none"),i){let r=i.offsetHeight,s=Math.max(i.offsetWidth,e.offsetWidth);this.style.setProperty("min-width",`${s}px`),this.style.setProperty("min-height",`${r}px`),F(this,Yi,ur).call(this,s)}else this.style.removeProperty("min-width"),this.style.removeProperty("min-height"),F(this,Yi,ur).call(this);a.removeProperty("--media-menu-transition-in")};rl=new WeakSet;kc=function(t){var e;if(t.stopPropagation(),t.composedPath().includes(U(this,ml,yc))){(e=U(this,Dt))==null||e.focus(),this.hidden=!0;return}let i=F(this,nr,ho).call(this,t);!i||i.hasAttribute("disabled")||(F(this,lr,mo).call(this,i),this.handleSelect(t))};ml=new WeakSet;yc=function(){var t;return(t=this.shadowRoot.querySelector('slot[name="header"]').assignedElements({flatten:!0}))==null?void 0:t.find(i=>i.matches('button[part~="back"]'))};sl=new WeakSet;Sc=function(t){if(t.target===this)return;F(this,pl,Ic).call(this);let e=Array.from(this.querySelectorAll('[role="menuitem"][aria-haspopup]'));for(let i of e)i.invokeTargetElement!=t.target&&t.newState=="open"&&i.getAttribute("aria-expanded")=="true"&&!i.invokeTargetElement.hidden&&i.invokeTargetElement.dispatchEvent(new Ct({relatedTarget:i}));for(let i of e)i.setAttribute("aria-expanded",`${!i.submenuElement.hidden}`);F(this,co,hl).call(this,!0)};pl=new WeakSet;Ic=function(){let e=this.querySelector('[role="menuitem"] > [role="menu"]:not([hidden])');this.container.classList.toggle("has-expanded",!!e)};ol=new WeakSet;Mc=function(t){var e;ae(this,t.relatedTarget)||(U(this,ai)&&((e=U(this,Dt))==null||e.focus()),U(this,ct)&&U(this,ct)!==t.relatedTarget&&!this.hidden&&(this.hidden=!0))};nl=new WeakSet;wc=function(t){var e,i,a,r,s;let{key:n,ctrlKey:d,altKey:u,metaKey:p}=t;if(!(d||u||p)&&this.keysUsed.includes(n))if(t.preventDefault(),t.stopPropagation(),n==="Tab"){if(U(this,ai)){this.hidden=!0;return}t.shiftKey?(i=(e=this.previousElementSibling)==null?void 0:e.focus)==null||i.call(e):(r=(a=this.nextElementSibling)==null?void 0:a.focus)==null||r.call(a),this.blur()}else n==="Escape"?((s=U(this,Dt))==null||s.focus(),U(this,ai)&&(this.hidden=!0)):n==="Enter"||n===" "?this.handleSelect(t):this.handleMove(t)};nr=new WeakSet;ho=function(t){return t.composedPath().find(e=>["menuitemradio","menuitemcheckbox"].includes(e.role))};ll=new WeakSet;Lc=function(){return this.items.find(t=>t.tabIndex===0)};lr=new WeakSet;mo=function(t){for(let e of this.items)e.tabIndex=e===t?0:-1};no=new WeakSet;dl=function(t,e){let i=[...this.checkedItems];t.type==="radio"&&this.radioGroupItems.forEach(a=>a.checked=!1),e?t.checked=!t.checked:t.checked=!0,this.checkedItems.some((a,r)=>a!=i[r])&&this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))};Y.shadowRootOptions={mode:"open"};Y.getTemplateHTML=Vp;function Kp(t){return["menuitem","menuitemradio","menuitemcheckbox"].includes(t?.role)}function cr(t){var e;return(e=t.getAttribute("bounds")?Re(t,`#${t.getAttribute("bounds")}`):B(t)||t.parentElement)!=null?e:t}l.customElements.get("media-chrome-menu")||l.customElements.define("media-chrome-menu",Y);var _l=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},se=(t,e,i)=>(_l(t,e,"read from private field"),i?i.call(t):e.get(t)),ht=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},vl=(t,e,i,a)=>(_l(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),Qi=(t,e,i)=>(_l(t,e,"access private method"),i),po,mr,fl,Cc,fo,Al,Tl,Dc,Xe,zi,El,vo,gl;function Gp(t){return`
    <style>
      :host {
        transition: var(--media-menu-item-transition,
          background .15s linear,
          opacity .2s ease-in-out
        );
        outline: var(--media-menu-item-outline, 0);
        outline-offset: var(--media-menu-item-outline-offset, -1px);
        cursor: var(--media-cursor, pointer);
        display: flex;
        align-items: center;
        align-self: stretch;
        justify-self: stretch;
        white-space: nowrap;
        white-space-collapse: collapse;
        text-wrap: nowrap;
        padding: .4em .8em .4em 1em;
      }

      :host(:focus-visible) {
        box-shadow: var(--media-menu-item-focus-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
        outline: var(--media-menu-item-hover-outline, 0);
        outline-offset: var(--media-menu-item-hover-outline-offset,  var(--media-menu-item-outline-offset, -1px));
      }

      :host(:hover) {
        cursor: var(--media-cursor, pointer);
        background: var(--media-menu-item-hover-background, rgb(92 92 102 / .5));
        outline: var(--media-menu-item-hover-outline);
        outline-offset: var(--media-menu-item-hover-outline-offset,  var(--media-menu-item-outline-offset, -1px));
      }

      :host([aria-checked="true"]) {
        background: var(--media-menu-item-checked-background);
      }

      :host([hidden]) {
        display: none;
      }

      :host([disabled]) {
        pointer-events: none;
        color: rgba(255, 255, 255, .3);
      }

      slot:not([name]) {
        width: 100%;
      }

      slot:not([name="submenu"]) {
        display: inline-flex;
        align-items: center;
        transition: inherit;
        opacity: var(--media-menu-item-opacity, 1);
      }

      slot[name="description"] {
        justify-content: end;
      }

      slot[name="description"] > span {
        display: inline-block;
        margin-inline: 1em .2em;
        max-width: var(--media-menu-item-description-max-width, 100px);
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: .8em;
        font-weight: 400;
        text-align: right;
        position: relative;
        top: .04em;
      }

      slot[name="checked-indicator"] {
        display: none;
      }

      :host(:is([role="menuitemradio"],[role="menuitemcheckbox"])) slot[name="checked-indicator"] {
        display: var(--media-menu-item-checked-indicator-display, inline-block);
      }

      
      svg, img, ::slotted(svg), ::slotted(img) {
        height: var(--media-menu-item-icon-height, var(--media-control-height, 24px));
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        display: block;
      }

      
      [part~="indicator"],
      ::slotted([part~="indicator"]) {
        fill: var(--media-menu-item-indicator-fill,
          var(--media-icon-color, var(--media-primary-color, rgb(238 238 238))));
        height: var(--media-menu-item-indicator-height, 1.25em);
        margin-right: .5ch;
      }

      [part~="checked-indicator"] {
        visibility: hidden;
      }

      :host([aria-checked="true"]) [part~="checked-indicator"] {
        visibility: visible;
      }
    </style>
    <slot name="checked-indicator">
      <svg aria-hidden="true" viewBox="0 1 24 24" part="checked-indicator indicator">
        <path d="m10 15.17 9.193-9.191 1.414 1.414-10.606 10.606-6.364-6.364 1.414-1.414 4.95 4.95Z"/>
      </svg>
    </slot>
    <slot name="prefix"></slot>
    <slot></slot>
    <slot name="description"></slot>
    <slot name="suffix">
      ${this.getSuffixSlotInnerHTML(t)}
    </slot>
    <slot name="submenu"></slot>
  `}function qp(t){return""}var Ee={TYPE:"type",VALUE:"value",CHECKED:"checked",DISABLED:"disabled"},he=class extends l.HTMLElement{constructor(){if(super(),ht(this,fl),ht(this,fo),ht(this,Tl),ht(this,vo),ht(this,po,!1),ht(this,mr,void 0),ht(this,Xe,()=>{var e,i;this.submenuElement.items&&this.setAttribute("submenusize",`${this.submenuElement.items.length}`);let a=this.shadowRoot.querySelector('slot[name="description"]'),r=(e=this.submenuElement.checkedItems)==null?void 0:e[0],s=(i=r?.dataset.description)!=null?i:r?.text,n=N.createElement("span");n.textContent=s??"",a.replaceChildren(n)}),ht(this,zi,e=>{let{key:i}=e;if(!this.keysUsed.includes(i)){this.removeEventListener("keyup",se(this,zi));return}this.handleClick(e)}),ht(this,El,e=>{let{metaKey:i,altKey:a,key:r}=e;if(i||a||!this.keysUsed.includes(r)){this.removeEventListener("keyup",se(this,zi));return}this.addEventListener("keyup",se(this,zi),{once:!0})}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);let e=$(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[Ee.TYPE,Ee.DISABLED,Ee.CHECKED,Ee.VALUE]}enable(){this.hasAttribute("tabindex")||this.setAttribute("tabindex","-1"),hr(this)&&!this.hasAttribute("aria-checked")&&this.setAttribute("aria-checked","false"),this.addEventListener("click",this),this.addEventListener("keydown",this)}disable(){this.removeAttribute("tabindex"),this.removeEventListener("click",this),this.removeEventListener("keydown",this),this.removeEventListener("keyup",this)}handleEvent(e){switch(e.type){case"slotchange":Qi(this,fl,Cc).call(this,e);break;case"click":this.handleClick(e);break;case"keydown":se(this,El).call(this,e);break;case"keyup":se(this,zi).call(this,e);break}}attributeChangedCallback(e,i,a){e===Ee.CHECKED&&hr(this)&&!se(this,po)?this.setAttribute("aria-checked",a!=null?"true":"false"):e===Ee.TYPE&&a!==i?this.role="menuitem"+a:e===Ee.DISABLED&&a!==i&&(a==null?this.enable():this.disable())}connectedCallback(){this.hasAttribute(Ee.DISABLED)||this.enable(),this.role="menuitem"+this.type,vl(this,mr,bl(this,this.parentNode)),Qi(this,vo,gl).call(this),this.submenuElement&&Qi(this,fo,Al).call(this),this.shadowRoot.addEventListener("slotchange",this)}disconnectedCallback(){this.disable(),Qi(this,vo,gl).call(this),vl(this,mr,null),this.shadowRoot.removeEventListener("slotchange",this)}get invokeTarget(){return this.getAttribute("invoketarget")}set invokeTarget(e){this.setAttribute("invoketarget",`${e}`)}get invokeTargetElement(){var e;return this.invokeTarget?(e=Ut(this))==null?void 0:e.querySelector(`#${this.invokeTarget}`):this.submenuElement}get submenuElement(){return this.shadowRoot.querySelector('slot[name="submenu"]').assignedElements({flatten:!0})[0]}get type(){var e;return(e=this.getAttribute(Ee.TYPE))!=null?e:""}set type(e){this.setAttribute(Ee.TYPE,`${e}`)}get value(){var e;return(e=this.getAttribute(Ee.VALUE))!=null?e:this.text}set value(e){this.setAttribute(Ee.VALUE,e)}get text(){var e;return((e=this.textContent)!=null?e:"").trim()}get checked(){if(hr(this))return this.getAttribute("aria-checked")==="true"}set checked(e){hr(this)&&(vl(this,po,!0),this.setAttribute("aria-checked",e?"true":"false"),e?this.part.add("checked"):this.part.remove("checked"))}handleClick(e){hr(this)||this.invokeTargetElement&&ae(this,e.target)&&this.invokeTargetElement.dispatchEvent(new Ct({relatedTarget:this}))}get keysUsed(){return["Enter"," "]}};po=new WeakMap;mr=new WeakMap;fl=new WeakSet;Cc=function(t){let e=t.target;if(!e?.name)for(let a of e.assignedNodes({flatten:!0}))a instanceof Text&&a.textContent.trim()===""&&a.remove();e.name==="submenu"&&(this.submenuElement?Qi(this,fo,Al).call(this):Qi(this,Tl,Dc).call(this))};fo=new WeakSet;Al=async function(){this.setAttribute("aria-haspopup","menu"),this.setAttribute("aria-expanded",`${!this.submenuElement.hidden}`),this.submenuElement.addEventListener("change",se(this,Xe)),this.submenuElement.addEventListener("addmenuitem",se(this,Xe)),this.submenuElement.addEventListener("removemenuitem",se(this,Xe)),se(this,Xe).call(this)};Tl=new WeakSet;Dc=function(){this.removeAttribute("aria-haspopup"),this.removeAttribute("aria-expanded"),this.submenuElement.removeEventListener("change",se(this,Xe)),this.submenuElement.removeEventListener("addmenuitem",se(this,Xe)),this.submenuElement.removeEventListener("removemenuitem",se(this,Xe)),se(this,Xe).call(this)};Xe=new WeakMap;zi=new WeakMap;El=new WeakMap;vo=new WeakSet;gl=function(){var t;let e=(t=se(this,mr))==null?void 0:t.radioGroupItems;if(!e)return;let i=e.filter(a=>a.getAttribute("aria-checked")==="true").pop();i||(i=e[0]);for(let a of e)a.setAttribute("aria-checked","false");i?.setAttribute("aria-checked","true")};he.shadowRootOptions={mode:"open"};he.getTemplateHTML=Gp;he.getSuffixSlotInnerHTML=qp;function hr(t){return t.type==="radio"||t.type==="checkbox"}function bl(t,e){if(!t)return null;let{host:i}=t.getRootNode();return!e&&i?bl(t,i):e?.items?e:bl(e,e?.parentNode)}l.customElements.get("media-chrome-menu-item")||l.customElements.define("media-chrome-menu-item",he);function Yp(t){return`
    ${Y.getTemplateHTML(t)}
    <style>
      :host {
        --_menu-bg: rgb(20 20 30 / .8);
        background: var(--media-settings-menu-background,
            var(--media-menu-background,
              var(--media-control-background,
                var(--media-secondary-color, var(--_menu-bg)))));
        min-width: var(--media-settings-menu-min-width, 170px);
        border-radius: 2px 2px 0 0;
        overflow: hidden;
      }

      @-moz-document url-prefix() {
        :host{
          --_menu-bg: rgb(20 20 30);
        }
      }

      :host([role="menu"]) {
        
        justify-content: end;
      }

      slot:not([name]) {
        justify-content: var(--media-settings-menu-justify-content);
        flex-direction: var(--media-settings-menu-flex-direction, column);
        overflow: visible;
      }

      #container.has-expanded {
        --media-settings-menu-item-opacity: 0;
      }
    </style>
  `}var pr=class extends Y{get anchorElement(){return this.anchor!=="auto"?super.anchorElement:B(this).querySelector("media-settings-menu-button")}};pr.getTemplateHTML=Yp;l.customElements.get("media-settings-menu")||l.customElements.define("media-settings-menu",pr);function zp(t){return`
    ${he.getTemplateHTML.call(this,t)}
    <style>
      slot:not([name="submenu"]) {
        opacity: var(--media-settings-menu-item-opacity, var(--media-menu-item-opacity));
      }

      :host([aria-expanded="true"]:hover) {
        background: transparent;
      }
    </style>
  `}function Qp(t){return`
    <svg aria-hidden="true" viewBox="0 0 20 24">
      <path d="m8.12 17.585-.742-.669 4.2-4.665-4.2-4.666.743-.669 4.803 5.335-4.803 5.334Z"/>
    </svg>
  `}var ri=class extends he{};ri.shadowRootOptions={mode:"open"};ri.getTemplateHTML=zp;ri.getSuffixSlotInnerHTML=Qp;l.customElements.get("media-settings-menu-item")||l.customElements.define("media-settings-menu-item",ri);var de=class extends O{connectedCallback(){super.connectedCallback(),this.invokeTargetElement&&this.setAttribute("aria-haspopup","menu")}get invokeTarget(){return this.getAttribute("invoketarget")}set invokeTarget(e){this.setAttribute("invoketarget",`${e}`)}get invokeTargetElement(){var e;return this.invokeTarget?(e=Ut(this))==null?void 0:e.querySelector(`#${this.invokeTarget}`):null}handleClick(){var e;(e=this.invokeTargetElement)==null||e.dispatchEvent(new Ct({relatedTarget:this}))}};l.customElements.get("media-chrome-menu-button")||l.customElements.define("media-chrome-menu-button",de);function Zp(){return`
    <style>
      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>
    <slot name="icon">
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M4.5 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm7.5 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm7.5 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
      </svg>
    </slot>
  `}function Xp(){return c("Settings")}var Zi=class extends de{static get observedAttributes(){return[...super.observedAttributes,"target"]}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-label",c("settings"))}get invokeTargetElement(){return this.invokeTarget!=null?super.invokeTargetElement:B(this).querySelector("media-settings-menu")}};Zi.getSlotTemplateHTML=Zp;Zi.getTooltipContentHTML=Xp;l.customElements.get("media-settings-menu-button")||l.customElements.define("media-settings-menu-button",Zi);var Il=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Rc=(t,e,i)=>(Il(t,e,"read from private field"),i?i.call(t):e.get(t)),Eo=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},kl=(t,e,i,a)=>(Il(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),go=(t,e,i)=>(Il(t,e,"access private method"),i),vr,Ao,bo,yl,_o,Sl,To=class extends Y{constructor(){super(...arguments),Eo(this,bo),Eo(this,_o),Eo(this,vr,[]),Eo(this,Ao,void 0)}static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_AUDIO_TRACK_LIST,o.MEDIA_AUDIO_TRACK_ENABLED,o.MEDIA_AUDIO_TRACK_UNAVAILABLE]}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===o.MEDIA_AUDIO_TRACK_ENABLED&&i!==a?this.value=a:e===o.MEDIA_AUDIO_TRACK_LIST&&i!==a&&(kl(this,vr,_d(a??"")),go(this,bo,yl).call(this))}connectedCallback(){super.connectedCallback(),this.addEventListener("change",go(this,_o,Sl))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("change",go(this,_o,Sl))}get anchorElement(){var e;return this.anchor!=="auto"?super.anchorElement:(e=B(this))==null?void 0:e.querySelector("media-audio-track-menu-button")}get mediaAudioTrackList(){return Rc(this,vr)}set mediaAudioTrackList(e){kl(this,vr,e),go(this,bo,yl).call(this)}get mediaAudioTrackEnabled(){var e;return(e=I(this,o.MEDIA_AUDIO_TRACK_ENABLED))!=null?e:""}set mediaAudioTrackEnabled(e){S(this,o.MEDIA_AUDIO_TRACK_ENABLED,e)}};vr=new WeakMap;Ao=new WeakMap;bo=new WeakSet;yl=function(){if(Rc(this,Ao)===JSON.stringify(this.mediaAudioTrackList))return;kl(this,Ao,JSON.stringify(this.mediaAudioTrackList));let t=this.mediaAudioTrackList;this.defaultSlot.textContent="",t.sort((e,i)=>e.id.localeCompare(i.id,void 0,{numeric:!0}));for(let e of t){let i=this.formatMenuItemText(e.label,e),a=Ze({type:"radio",text:i,value:`${e.id}`,checked:e.enabled});a.prepend(Ce(this,"checked-indicator")),this.defaultSlot.append(a)}};_o=new WeakSet;Sl=function(){if(this.value==null)return;let t=new l.CustomEvent(h.MEDIA_AUDIO_TRACK_REQUEST,{composed:!0,bubbles:!0,detail:this.value});this.dispatchEvent(t)};l.customElements.get("media-audio-track-menu")||l.customElements.define("media-audio-track-menu",To);var Jp=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M11 17H9.5V7H11v10Zm-3-3H6.5v-4H8v4Zm6-5h-1.5v6H14V9Zm3 7h-1.5V8H17v8Z"/>
  <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-2 0a8 8 0 1 0-16 0 8 8 0 0 0 16 0Z"/>
</svg>`;function jp(){return`
    <style>
      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>
    <slot name="icon">${Jp}</slot>
  `}function ev(){return c("Audio")}var xc=t=>{let e=c("Audio");t.setAttribute("aria-label",e)},Xi=class extends de{static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_AUDIO_TRACK_ENABLED,o.MEDIA_AUDIO_TRACK_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),xc(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===o.MEDIA_LANG&&xc(this)}get invokeTargetElement(){var e;return this.invokeTarget!=null?super.invokeTargetElement:(e=B(this))==null?void 0:e.querySelector("media-audio-track-menu")}get mediaAudioTrackEnabled(){var e;return(e=I(this,o.MEDIA_AUDIO_TRACK_ENABLED))!=null?e:""}set mediaAudioTrackEnabled(e){S(this,o.MEDIA_AUDIO_TRACK_ENABLED,e)}};Xi.getSlotTemplateHTML=jp;Xi.getTooltipContentHTML=ev;l.customElements.get("media-audio-track-menu-button")||l.customElements.define("media-audio-track-menu-button",Xi);var Cl=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},tv=(t,e,i)=>(Cl(t,e,"read from private field"),i?i.call(t):e.get(t)),Ml=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},iv=(t,e,i,a)=>(Cl(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),ko=(t,e,i)=>(Cl(t,e,"access private method"),i),Io,yo,wl,So,Ll,av=`
  <svg aria-hidden="true" viewBox="0 0 26 24" part="captions-indicator indicator">
    <path d="M22.83 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.39 9.45a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.92 3.92 0 0 1 .92-2.77 3.18 3.18 0 0 1 2.43-1 2.94 2.94 0 0 1 2.13.78c.364.359.62.813.74 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.17 1.61 1.61 0 0 0-1.29.58 2.79 2.79 0 0 0-.5 1.89 3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.48 1.48 0 0 0 1-.37 2.1 2.1 0 0 0 .59-1.14l1.4.44a3.23 3.23 0 0 1-1.07 1.69Zm7.22 0a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.88 3.88 0 0 1 .93-2.77 3.14 3.14 0 0 1 2.42-1 3 3 0 0 1 2.16.82 2.8 2.8 0 0 1 .73 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.21 1.61 1.61 0 0 0-1.29.58A2.79 2.79 0 0 0 15 12a3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.44 1.44 0 0 0 1-.37 2.1 2.1 0 0 0 .6-1.15l1.4.44a3.17 3.17 0 0 1-1.1 1.7Z"/>
  </svg>`;function rv(t){return`
    ${Y.getTemplateHTML(t)}
    <slot name="captions-indicator" hidden>${av}</slot>
  `}var fr=class extends Y{constructor(){super(...arguments),Ml(this,yo),Ml(this,So),Ml(this,Io,void 0)}static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_SUBTITLES_LIST,o.MEDIA_SUBTITLES_SHOWING]}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===o.MEDIA_SUBTITLES_LIST&&i!==a?ko(this,yo,wl).call(this):e===o.MEDIA_SUBTITLES_SHOWING&&i!==a&&(this.value=a||"",ko(this,yo,wl).call(this))}connectedCallback(){super.connectedCallback(),this.addEventListener("change",ko(this,So,Ll))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("change",ko(this,So,Ll))}get anchorElement(){return this.anchor!=="auto"?super.anchorElement:B(this).querySelector("media-captions-menu-button")}get mediaSubtitlesList(){return Oc(this,o.MEDIA_SUBTITLES_LIST)}set mediaSubtitlesList(e){Uc(this,o.MEDIA_SUBTITLES_LIST,e)}get mediaSubtitlesShowing(){return Oc(this,o.MEDIA_SUBTITLES_SHOWING)}set mediaSubtitlesShowing(e){Uc(this,o.MEDIA_SUBTITLES_SHOWING,e)}};Io=new WeakMap;yo=new WeakSet;wl=function(){var t;let e=tv(this,Io)!==JSON.stringify(this.mediaSubtitlesList),i=this.value!==this.getAttribute(o.MEDIA_SUBTITLES_SHOWING);if(!e&&!i)return;iv(this,Io,JSON.stringify(this.mediaSubtitlesList)),this.defaultSlot.textContent="";let a=!this.value,r=Ze({type:"radio",text:this.formatMenuItemText(c("Off")),value:"off",checked:a});r.prepend(Ce(this,"checked-indicator")),this.defaultSlot.append(r);let s=this.mediaSubtitlesList;for(let n of s){let d=Ze({type:"radio",text:this.formatMenuItemText(n.label,n),value:$r(n),checked:this.value==$r(n)});d.prepend(Ce(this,"checked-indicator")),((t=n.kind)!=null?t:"subs")==="captions"&&d.append(Ce(this,"captions-indicator")),this.defaultSlot.append(d)}};So=new WeakSet;Ll=function(){let t=this.mediaSubtitlesShowing,e=this.getAttribute(o.MEDIA_SUBTITLES_SHOWING),i=this.value!==e;if(t?.length&&i&&this.dispatchEvent(new l.CustomEvent(h.MEDIA_DISABLE_SUBTITLES_REQUEST,{composed:!0,bubbles:!0,detail:t})),!this.value||!i)return;let a=new l.CustomEvent(h.MEDIA_SHOW_SUBTITLES_REQUEST,{composed:!0,bubbles:!0,detail:this.value});this.dispatchEvent(a)};fr.getTemplateHTML=rv;var Oc=(t,e)=>{let i=t.getAttribute(e);return i?Ht(i):[]},Uc=(t,e,i)=>{if(!i?.length){t.removeAttribute(e);return}let a=ot(i);t.getAttribute(e)!==a&&t.setAttribute(e,a)};l.customElements.get("media-captions-menu")||l.customElements.define("media-captions-menu",fr);var sv=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.83 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.39 9.45a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.92 3.92 0 0 1 .92-2.77 3.18 3.18 0 0 1 2.43-1 2.94 2.94 0 0 1 2.13.78c.364.359.62.813.74 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.17 1.61 1.61 0 0 0-1.29.58 2.79 2.79 0 0 0-.5 1.89 3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.48 1.48 0 0 0 1-.37 2.1 2.1 0 0 0 .59-1.14l1.4.44a3.23 3.23 0 0 1-1.07 1.69Zm7.22 0a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.88 3.88 0 0 1 .93-2.77 3.14 3.14 0 0 1 2.42-1 3 3 0 0 1 2.16.82 2.8 2.8 0 0 1 .73 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.21 1.61 1.61 0 0 0-1.29.58A2.79 2.79 0 0 0 15 12a3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.44 1.44 0 0 0 1-.37 2.1 2.1 0 0 0 .6-1.15l1.4.44a3.17 3.17 0 0 1-1.1 1.7Z"/>
</svg>`,ov=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M17.73 14.09a1.4 1.4 0 0 1-1 .37 1.579 1.579 0 0 1-1.27-.58A3 3 0 0 1 15 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34A2.89 2.89 0 0 0 19 9.07a3 3 0 0 0-2.14-.78 3.14 3.14 0 0 0-2.42 1 3.91 3.91 0 0 0-.93 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.17 3.17 0 0 0 1.07-1.74l-1.4-.45c-.083.43-.3.822-.62 1.12Zm-7.22 0a1.43 1.43 0 0 1-1 .37 1.58 1.58 0 0 1-1.27-.58A3 3 0 0 1 7.76 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34a2.81 2.81 0 0 0-.74-1.32 2.94 2.94 0 0 0-2.13-.78 3.18 3.18 0 0 0-2.43 1 4 4 0 0 0-.92 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.23 3.23 0 0 0 1.07-1.74l-1.4-.45a2.06 2.06 0 0 1-.6 1.07Zm12.32-8.41a2.59 2.59 0 0 0-2.3-2.51C18.72 3.05 15.86 3 13 3c-2.86 0-5.72.05-7.53.17a2.59 2.59 0 0 0-2.3 2.51c-.23 4.207-.23 8.423 0 12.63a2.57 2.57 0 0 0 2.3 2.5c1.81.13 4.67.19 7.53.19 2.86 0 5.72-.06 7.53-.19a2.57 2.57 0 0 0 2.3-2.5c.23-4.207.23-8.423 0-12.63Zm-1.49 12.53a1.11 1.11 0 0 1-.91 1.11c-1.67.11-4.45.18-7.43.18-2.98 0-5.76-.07-7.43-.18a1.11 1.11 0 0 1-.91-1.11c-.21-4.14-.21-8.29 0-12.43a1.11 1.11 0 0 1 .91-1.11C7.24 4.56 10 4.49 13 4.49s5.76.07 7.43.18a1.11 1.11 0 0 1 .91 1.11c.21 4.14.21 8.29 0 12.43Z"/>
</svg>`;function nv(){return`
    <style>
      :host([data-captions-enabled="true"]) slot[name=off] {
        display: none !important;
      }

      
      :host(:not([data-captions-enabled="true"])) slot[name=on] {
        display: none !important;
      }

      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="on">${sv}</slot>
      <slot name="off">${ov}</slot>
    </slot>
  `}function lv(){return c("Captions")}var Pc=t=>{t.setAttribute("data-captions-enabled",Vr(t).toString())},Nc=t=>{t.setAttribute("aria-label",c("closed captions"))},Ji=class extends de{static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_SUBTITLES_LIST,o.MEDIA_SUBTITLES_SHOWING,o.MEDIA_LANG]}connectedCallback(){super.connectedCallback(),Nc(this),Pc(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===o.MEDIA_SUBTITLES_SHOWING?Pc(this):e===o.MEDIA_LANG&&Nc(this)}get invokeTargetElement(){var e;return this.invokeTarget!=null?super.invokeTargetElement:(e=B(this))==null?void 0:e.querySelector("media-captions-menu")}get mediaSubtitlesList(){return Hc(this,o.MEDIA_SUBTITLES_LIST)}set mediaSubtitlesList(e){Fc(this,o.MEDIA_SUBTITLES_LIST,e)}get mediaSubtitlesShowing(){return Hc(this,o.MEDIA_SUBTITLES_SHOWING)}set mediaSubtitlesShowing(e){Fc(this,o.MEDIA_SUBTITLES_SHOWING,e)}};Ji.getSlotTemplateHTML=nv;Ji.getTooltipContentHTML=lv;var Hc=(t,e)=>{let i=t.getAttribute(e);return i?Ht(i):[]},Fc=(t,e,i)=>{if(!i?.length){t.removeAttribute(e);return}let a=ot(i);t.getAttribute(e)!==a&&t.setAttribute(e,a)};l.customElements.get("media-captions-menu-button")||l.customElements.define("media-captions-menu-button",Ji);var Bc=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},ea=(t,e,i)=>(Bc(t,e,"read from private field"),i?i.call(t):e.get(t)),Dl=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},ji=(t,e,i)=>(Bc(t,e,"access private method"),i),Rt,ta,Er,Mo,xl,Rl={RATES:"rates"},wo=class extends Y{constructor(){super(),Dl(this,ta),Dl(this,Mo),Dl(this,Rt,new Et(this,Rl.RATES,{defaultValue:In})),ji(this,ta,Er).call(this)}static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_PLAYBACK_RATE,Rl.RATES]}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===o.MEDIA_PLAYBACK_RATE&&i!=a?(this.value=a,ji(this,ta,Er).call(this)):e===Rl.RATES&&i!=a&&(ea(this,Rt).value=a,ji(this,ta,Er).call(this))}connectedCallback(){super.connectedCallback(),this.addEventListener("change",ji(this,Mo,xl))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("change",ji(this,Mo,xl))}get anchorElement(){return this.anchor!=="auto"?super.anchorElement:B(this).querySelector("media-playback-rate-menu-button")}get rates(){return ea(this,Rt)}set rates(e){e?Array.isArray(e)?ea(this,Rt).value=e.join(" "):typeof e=="string"&&(ea(this,Rt).value=e):ea(this,Rt).value="",ji(this,ta,Er).call(this)}get mediaPlaybackRate(){return L(this,o.MEDIA_PLAYBACK_RATE,qt)}set mediaPlaybackRate(e){R(this,o.MEDIA_PLAYBACK_RATE,e)}};Rt=new WeakMap;ta=new WeakSet;Er=function(){this.defaultSlot.textContent="";let t=$e(this.mediaPlaybackRate),e=new Set(Array.from(ea(this,Rt)).map(a=>$e(Number(a))));t>0&&!e.has(t)&&e.add(t);let i=Array.from(e).sort((a,r)=>a-r);for(let a of i){let r=Ze({type:"radio",text:this.formatMenuItemText(`${a}x`,a),value:a.toString(),checked:t===a});r.prepend(Ce(this,"checked-indicator")),this.defaultSlot.append(r)}};Mo=new WeakSet;xl=function(){if(!this.value)return;let t=new l.CustomEvent(h.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:this.value});this.dispatchEvent(t)};l.customElements.get("media-playback-rate-menu")||l.customElements.define("media-playback-rate-menu",wo);var Lo=1;function dv(t){return`
    <style>
      :host {
        min-width: 5ch;
        padding: var(--media-button-padding, var(--media-control-padding, 10px 5px));
      }

      :host([aria-expanded="true"]) slot {
        display: block;
      }

      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>
    <slot name="icon">${t.mediaplaybackrate?$e(+t.mediaplaybackrate):Lo}x</slot>
  `}function uv(){return c("Playback rate")}var ia=class extends de{static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_PLAYBACK_RATE]}constructor(){var e;super(),this.container=this.shadowRoot.querySelector('slot[name="icon"]'),this.container.innerHTML=`${$e((e=this.mediaPlaybackRate)!=null?e:Lo)}x`}attributeChangedCallback(e,i,a){if(super.attributeChangedCallback(e,i,a),e===o.MEDIA_PLAYBACK_RATE){let r=a?+a:Number.NaN,s=$e(Number.isNaN(r)?Lo:r);this.container.innerHTML=`${s}x`,this.setAttribute("aria-label",c("Playback rate {playbackRate}",{playbackRate:s}))}}get invokeTargetElement(){return this.invokeTarget!=null?super.invokeTargetElement:B(this).querySelector("media-playback-rate-menu")}get mediaPlaybackRate(){return L(this,o.MEDIA_PLAYBACK_RATE,Lo)}set mediaPlaybackRate(e){R(this,o.MEDIA_PLAYBACK_RATE,e)}};ia.getSlotTemplateHTML=dv;ia.getTooltipContentHTML=uv;l.customElements.get("media-playback-rate-menu-button")||l.customElements.define("media-playback-rate-menu-button",ia);var Ul=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},mt=(t,e,i)=>(Ul(t,e,"read from private field"),i?i.call(t):e.get(t)),Co=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Wc=(t,e,i,a)=>(Ul(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),aa=(t,e,i)=>(Ul(t,e,"access private method"),i),gr,Je,ra,br,Do,Ol,Ro=class extends Y{constructor(){super(...arguments),Co(this,ra),Co(this,Do),Co(this,gr,[]),Co(this,Je,{})}static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_RENDITION_LIST,o.MEDIA_RENDITION_SELECTED,o.MEDIA_RENDITION_UNAVAILABLE,o.MEDIA_HEIGHT,o.MEDIA_WIDTH]}static formatMenuItemText(e,i){return super.formatMenuItemText(e,i)}static formatRendition(e,{showBitrate:i=!1}={}){let a=`${Math.min(e.width,e.height)}p`;if(i&&e.bitrate){let r=e.bitrate/1e6,s=`${r.toFixed(r<1?1:0)} Mbps`;return`${a} (${s})`}return this.formatMenuItemText(a,e)}static compareRendition(e,i){var a,r;return i.height===e.height?((a=i.bitrate)!=null?a:0)-((r=e.bitrate)!=null?r:0):i.height-e.height}attributeChangedCallback(e,i,a){if(super.attributeChangedCallback(e,i,a),i!==a)switch(e){case o.MEDIA_RENDITION_SELECTED:this.value=a??"auto",aa(this,ra,br).call(this);break;case o.MEDIA_RENDITION_LIST:Wc(this,gr,gd(a)),aa(this,ra,br).call(this);break;case o.MEDIA_HEIGHT:case o.MEDIA_WIDTH:aa(this,ra,br).call(this);break}}connectedCallback(){super.connectedCallback(),this.addEventListener("change",aa(this,Do,Ol))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("change",aa(this,Do,Ol))}get anchorElement(){return this.anchor!=="auto"?super.anchorElement:B(this).querySelector("media-rendition-menu-button")}get mediaRenditionList(){return mt(this,gr)}set mediaRenditionList(e){Wc(this,gr,e),aa(this,ra,br).call(this)}get mediaRenditionSelected(){return I(this,o.MEDIA_RENDITION_SELECTED)}set mediaRenditionSelected(e){S(this,o.MEDIA_RENDITION_SELECTED,e)}get mediaHeight(){return L(this,o.MEDIA_HEIGHT)}set mediaHeight(e){R(this,o.MEDIA_HEIGHT,e)}get mediaWidth(){return L(this,o.MEDIA_WIDTH)}set mediaWidth(e){R(this,o.MEDIA_WIDTH,e)}compareRendition(e,i){return this.constructor.compareRendition(e,i)}formatMenuItemText(e,i){return this.constructor.formatMenuItemText(e,i)}formatRendition(e,i){return this.constructor.formatRendition(e,i)}showRenditionBitrate(e){return this.mediaRenditionList.some(i=>i!==e&&i.height===e.height&&i.bitrate!==e.bitrate)}};gr=new WeakMap;Je=new WeakMap;ra=new WeakSet;br=function(){let t=!this.mediaRenditionSelected;if(mt(this,Je).mediaRenditionList===JSON.stringify(this.mediaRenditionList)&&mt(this,Je).mediaHeight===this.mediaHeight&&mt(this,Je).mediaWidth===this.mediaWidth&&mt(this,Je).isAuto===t)return;mt(this,Je).mediaRenditionList=JSON.stringify(this.mediaRenditionList),mt(this,Je).mediaHeight=this.mediaHeight,mt(this,Je).mediaWidth=this.mediaWidth,mt(this,Je).isAuto=t;let e=this.mediaRenditionList.sort(this.compareRendition.bind(this)),i=e.find(n=>n.id===this.mediaRenditionSelected);for(let n of e)n.selected=n===i;this.defaultSlot.textContent="";for(let n of e){let d=this.formatRendition(n,{showBitrate:this.showRenditionBitrate(n)}),u=Ze({type:"radio",text:d,value:`${n.id}`,checked:n.selected&&!t});u.prepend(Ce(this,"checked-indicator")),this.defaultSlot.append(u)}let a=i&&this.showRenditionBitrate(i),r;t&&(i?r=this.formatMenuItemText(`${c("Auto")} \u2022 ${this.formatRendition(i,{showBitrate:a})}`,i):this.mediaHeight>0&&this.mediaWidth>0&&(r=this.formatMenuItemText(`${c("Auto")} (${Math.min(this.mediaWidth,this.mediaHeight)}p)`))),r||(r=this.formatMenuItemText(c("Auto")));let s=Ze({type:"radio",text:r,value:"auto",checked:t});s.dataset.description=r,s.prepend(Ce(this,"checked-indicator")),this.defaultSlot.append(s)};Do=new WeakSet;Ol=function(){if(this.value==null)return;let t=new l.CustomEvent(h.MEDIA_RENDITION_REQUEST,{composed:!0,bubbles:!0,detail:this.value});this.dispatchEvent(t)};l.customElements.get("media-rendition-menu")||l.customElements.define("media-rendition-menu",Ro);var cv=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M13.5 2.5h2v6h-2v-2h-11v-2h11v-2Zm4 2h4v2h-4v-2Zm-12 4h2v6h-2v-2h-3v-2h3v-2Zm4 2h12v2h-12v-2Zm1 4h2v6h-2v-2h-8v-2h8v-2Zm4 2h7v2h-7v-2Z" />
</svg>`;function hv(){return`
    <style>
      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>
    <slot name="icon">${cv}</slot>
  `}function mv(){return c("Quality")}var sa=class extends de{static get observedAttributes(){return[...super.observedAttributes,o.MEDIA_RENDITION_SELECTED,o.MEDIA_RENDITION_UNAVAILABLE,o.MEDIA_HEIGHT]}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-label",c("quality"))}get invokeTargetElement(){return this.invokeTarget!=null?super.invokeTargetElement:B(this).querySelector("media-rendition-menu")}get mediaRenditionSelected(){return I(this,o.MEDIA_RENDITION_SELECTED)}set mediaRenditionSelected(e){S(this,o.MEDIA_RENDITION_SELECTED,e)}get mediaHeight(){return L(this,o.MEDIA_HEIGHT)}set mediaHeight(e){R(this,o.MEDIA_HEIGHT,e)}};sa.getSlotTemplateHTML=hv;sa.getTooltipContentHTML=mv;l.customElements.get("media-rendition-menu-button")||l.customElements.define("media-rendition-menu-button",sa);var Hl=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},et=(t,e,i)=>(Hl(t,e,"read from private field"),i?i.call(t):e.get(t)),je=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},$c=(t,e,i,a)=>(Hl(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),ge=(t,e,i)=>(Hl(t,e,"access private method"),i),na,_r,Ho,si,oa,Fl,Vc,xo,Pl,Oo,Nl,Kc,Po,No,Uo;function pv(t){return`
      ${Y.getTemplateHTML(t)}
      <style>
        :host {
          --_menu-bg: rgb(20 20 30 / .8);
          background: var(--media-settings-menu-background,
            var(--media-menu-background,
              var(--media-control-background,
                var(--media-secondary-color, var(--_menu-bg)))));
          min-width: var(--media-settings-menu-min-width, 170px);
          border-radius: 2px;
          overflow: hidden;
        }
      </style>
    `}var Ar=class extends Y{constructor(){super(),je(this,_r),je(this,si),je(this,Fl),je(this,xo),je(this,Nl),je(this,na,!1),je(this,Oo,e=>{let i=e.target,a=i?.nodeName==="VIDEO",r=ge(this,xo,Pl).call(this,i);(a||r)&&(et(this,na)?ge(this,si,oa).call(this):ge(this,Nl,Kc).call(this,e))}),je(this,Po,e=>{let i=e.target,a=this.contains(i),r=e.button===2,s=i?.nodeName==="VIDEO",n=ge(this,xo,Pl).call(this,i);a||r&&(s||n)||ge(this,si,oa).call(this)}),je(this,No,e=>{e.key==="Escape"&&ge(this,si,oa).call(this)}),je(this,Uo,e=>{var i,a;let r=e.target;if((i=r.matches)!=null&&i.call(r,'button[invoke="copy"]')){let s=(a=r.closest("media-context-menu-item"))==null?void 0:a.querySelector('input[slot="copy"]');s&&navigator.clipboard.writeText(s.value)}ge(this,si,oa).call(this)}),this.setAttribute("noautohide",""),ge(this,_r,Ho).call(this)}connectedCallback(){super.connectedCallback(),B(this).addEventListener("contextmenu",et(this,Oo)),this.addEventListener("click",et(this,Uo))}disconnectedCallback(){super.disconnectedCallback(),B(this).removeEventListener("contextmenu",et(this,Oo)),this.removeEventListener("click",et(this,Uo)),document.removeEventListener("mousedown",et(this,Po)),document.removeEventListener("keydown",et(this,No))}};na=new WeakMap;_r=new WeakSet;Ho=function(){this.hidden=!et(this,na)};si=new WeakSet;oa=function(){$c(this,na,!1),ge(this,_r,Ho).call(this)};Fl=new WeakSet;Vc=function(){document.querySelectorAll("media-context-menu").forEach(e=>{var i;e!==this&&ge(i=e,si,oa).call(i)})};xo=new WeakSet;Pl=function(t){return t?t.hasAttribute("slot")&&t.getAttribute("slot")==="media"?!0:t.nodeName.includes("-")&&t.tagName.includes("-")?t.hasAttribute("src")||t.hasAttribute("poster")||t.hasAttribute("preload")||t.hasAttribute("playsinline"):!1:!1};Oo=new WeakMap;Nl=new WeakSet;Kc=function(t){t.preventDefault(),ge(this,Fl,Vc).call(this),$c(this,na,!0),this.style.position="fixed",this.style.left=`${t.clientX}px`,this.style.top=`${t.clientY}px`,ge(this,_r,Ho).call(this),document.addEventListener("mousedown",et(this,Po),{once:!0}),document.addEventListener("keydown",et(this,No),{once:!0})};Po=new WeakMap;No=new WeakMap;Uo=new WeakMap;Ar.getTemplateHTML=pv;l.customElements.get("media-context-menu")||l.customElements.define("media-context-menu",Ar);function vv(t){return`
    ${he.getTemplateHTML.call(this,t)}
    <style>
        ::slotted(*) {
            color: var(--media-text-color, white);
            text-decoration: none;
            border: none;
            background: none;
            cursor: pointer;
            padding: 0;
            min-height: var(--media-control-height, 24px);
        }
    </style>
  `}var la=class extends he{};la.shadowRootOptions={mode:"open"};la.getTemplateHTML=vv;l.customElements.get("media-context-menu-item")||l.customElements.define("media-context-menu-item",la);var Bl=l.document?.createElement?.("template");Bl&&(Bl.innerHTML=String.raw`
    <!-- Sutro -->
    <style>
      :host {
        --_primary-color: var(--media-primary-color, #fff);
        --_secondary-color: var(--media-secondary-color, transparent);
        --_accent-color: var(--media-accent-color, #fff);
      }

      media-controller {
        --base: 18px;

        font-size: calc(0.75 * var(--base));
        font-family: Roboto, Arial, sans-serif;
        --media-font-family: Roboto, helvetica neue, segoe ui, arial, sans-serif;
        -webkit-font-smoothing: antialiased;

        --media-primary-color: #fff;
        --media-secondary-color: transparent;
        --media-menu-background: rgba(28, 28, 28, 0.6);
        --media-text-color: var(--_primary-color);
        --media-control-hover-background: var(--media-secondary-color);

        --media-range-track-height: calc(0.125 * var(--base));
        --media-range-thumb-height: var(--base);
        --media-range-thumb-width: var(--base);
        --media-range-thumb-border-radius: var(--base);

        --media-control-height: calc(2 * var(--base));
      }

      media-controller[breakpointmd] {
        --base: 20px;
      }

      /* The biggest size controller is tied to going fullscreen
          instead of a player width. */
      media-controller[mediaisfullscreen] {
        --base: 24px;
      }

      .media-button {
        --media-control-hover-background: var(--_secondary-color);
        --media-tooltip-background: rgb(28 28 28 / .24);
        --media-text-content-height: 1.2;
        --media-tooltip-padding: .7em 1em;
        --media-tooltip-distance: 8px;
        --media-tooltip-container-margin: 18px;
        position: relative;
        padding: 0;
        opacity: 0.9;
        transition: opacity 0.1s cubic-bezier(0.4, 0, 1, 1);
      }

      .media-button svg {
        fill: none;
        stroke: var(--_primary-color);
        stroke-width: 1;
        stroke-linecap: 'round';
        stroke-linejoin: 'round';
      }

      svg .svg-shadow {
        stroke: #000;
        stroke-opacity: 0.15;
        stroke-width: 2px;
        fill: none;
      }
    </style>

    <media-controller
      breakpoints="md:480"
      defaultsubtitles="{{defaultsubtitles}}"
      defaultduration="{{defaultduration}}"
      gesturesdisabled="{{disabled}}"
      hotkeys="{{hotkeys}}"
      nohotkeys="{{nohotkeys}}"
      defaultstreamtype="on-demand"
    >
      <slot name="media" slot="media"></slot>
      <slot name="poster" slot="poster"></slot>
      <slot name="centered-chrome" slot="centered-chrome"></slot>
      <media-error-dialog slot="dialog"></media-error-dialog>

      <!-- Controls Gradient -->
      <style>
        .media-gradient-bottom {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: calc(8 * var(--base));
          pointer-events: none;
        }

        .media-gradient-bottom::before {
          content: '';
          --gradient-steps: hsl(0 0% 0% / 0) 0%, hsl(0 0% 0% / 0.013) 8.1%, hsl(0 0% 0% / 0.049) 15.5%,
            hsl(0 0% 0% / 0.104) 22.5%, hsl(0 0% 0% / 0.175) 29%, hsl(0 0% 0% / 0.259) 35.3%, hsl(0 0% 0% / 0.352) 41.2%,
            hsl(0 0% 0% / 0.45) 47.1%, hsl(0 0% 0% / 0.55) 52.9%, hsl(0 0% 0% / 0.648) 58.8%, hsl(0 0% 0% / 0.741) 64.7%,
            hsl(0 0% 0% / 0.825) 71%, hsl(0 0% 0% / 0.896) 77.5%, hsl(0 0% 0% / 0.951) 84.5%, hsl(0 0% 0% / 0.987) 91.9%,
            hsl(0 0% 0%) 100%;

          position: absolute;
          inset: 0;
          opacity: 0.7;
          background: linear-gradient(to bottom, var(--gradient-steps));
        }
      </style>
      <div class="media-gradient-bottom"></div>

      <!-- Settings Menu -->
      <style>
        media-settings-menu {
          --media-menu-icon-height: 20px;
          --media-menu-item-icon-height: 20px;
          --media-settings-menu-min-width: calc(10 * var(--base));
          --media-menu-transform-in: translateY(0) scale(1);
          --media-menu-transform-out: translateY(20px) rotate(3deg) scale(1);
          padding-block: calc(0.15 * var(--base));
          margin-right: 10px;
          margin-bottom: 17px;
          border-radius: 8px;
          z-index: 2;
          user-select: none;
        }

        media-settings-menu-item,
        [role='menu']::part(menu-item) {
          --media-icon-color: var(--_primary-color);
          margin-inline: calc(0.45 * var(--base));
          height: calc(1.6 * var(--base));
          font-size: calc(0.7 * var(--base));
          font-weight: 400;
          padding: 0;
          padding-left: calc(0.4 * var(--base));
          padding-right: calc(0.1 * var(--base));
          border-radius: 6px;
          text-shadow: none;
        }

        [slot='submenu']::part(back button) {
          font-size: calc(0.7 * var(--base));
        }

        media-settings-menu-item:hover {
          --media-icon-color: #000;
          color: #000;
          background-color: #fff;
        }

        media-settings-menu-item:hover [slot='submenu']::part(menu-item),
        [slot='submenu']::part(back indicator) {
          --media-icon-color: var(--_primary-color);
        }

        media-settings-menu-item:hover [slot='submenu']::part(menu-item):hover {
          --media-icon-color: #000;
          color: #000;
          background-color: #fff;
        }

        media-settings-menu-item[submenusize='0'] {
          display: none;
        }

        /* Also hide if only 'Auto' is added. */
        .quality-settings[submenusize='1'] {
          display: none;
        }
      </style>
      <media-settings-menu hidden anchor="auto">
        <media-settings-menu-item>
          Playback Speed
          <media-playback-rate-menu slot="submenu" hidden>
            <div slot="title">Playback Speed</div>
          </media-playback-rate-menu>
        </media-settings-menu-item>
        <media-settings-menu-item class="quality-settings">
          Quality
          <media-rendition-menu slot="submenu" hidden>
            <div slot="title">Quality</div>
          </media-rendition-menu>
        </media-settings-menu-item>
        <media-settings-menu-item>
          Subtitles/CC
          <media-captions-menu slot="submenu" hidden>
            <div slot="title">Subtitles/CC</div>
          </media-captions-menu>
        </media-settings-menu-item>
      </media-settings-menu>

      <!-- Control Bar -->
      <style>
        media-control-bar {
          position: absolute;
          height: calc(2 * var(--base));
          line-height: calc(2 * var(--base));
          bottom: var(--base);
          left: var(--base);
          right: var(--base);
        }
      </style>
      <media-control-bar>
        <!-- Play/Pause -->
        <style>
          @keyframes bounce-scale-play {
            0% {
              transform: scale(0.75, 0.75);
            }
            50% {
              transform: scale(115%, 115%);
            }
            100% {
              transform: scale(1, 1);
            }
          }

          .media-button {
            border-radius: 25%;
            backdrop-filter: blur(10px) invert(15%) brightness(80%) opacity(0);
            -webkit-backdrop-filter: blur(10px) invert(15%) brightness(80%) opacity(0);
            transition: backdrop-filter 0.3s, -webkit-backdrop-filter 0.3s, box-shadow 0.3s;
          }

          .media-button:hover {
            /* background-color: rgba(0, 0, 0, 0.05); */
            box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 5px;
            /* hue-rotate(120deg) */
            backdrop-filter: blur(10px) invert(15%) brightness(80%) opacity(1);
            -webkit-backdrop-filter: blur(10px) invert(15%) brightness(80%) opacity(1);
            transition: backdrop-filter 0.3s, -webkit-backdrop-filter 0.3s;
          }

          media-play-button #icon-play {
            opacity: 0;
            transform-box: view-box;
            transform-origin: center center;
            transform: scale(0.5, 0.5);
            transition: all 0.5s;
          }

          media-play-button[mediapaused] #icon-play {
            opacity: 1;
            transform: scale(1, 1);
            animation: 0.35s bounce-scale-play ease-in-out;
          }

          @keyframes bounce-pause-left {
            0% {
              font-size: 10px;
            }
            50% {
              font-size: 3px;
            }
            100% {
              font-size: 4px;
            }
          }

          @keyframes bounce-pause-right {
            0% {
              font-size: 10px;
              transform: translateX(-8px);
            }
            50% {
              font-size: 3px;
              transform: translateX(1px);
            }
            100% {
              font-size: 4px;
              transform: translateX(0);
            }
          }

          media-play-button #pause-left,
          media-play-button #pause-right {
            /* Using font-size to animate height because using scale was resulting in unexpected positioning */
            font-size: 4px;
            opacity: 1;
            transform: translateX(0);
            transform-box: view-box;
          }

          media-play-button:not([mediapaused]) #pause-left {
            animation: 0.3s bounce-pause-left ease-out;
          }

          media-play-button:not([mediapaused]) #pause-right {
            animation: 0.3s bounce-pause-right ease-out;
          }

          media-play-button[mediapaused] #pause-left,
          media-play-button[mediapaused] #pause-right {
            opacity: 0;
            font-size: 10px;
          }

          media-play-button[mediapaused] #pause-right {
            transform-origin: right center;
            transform: translateX(-8px);
          }
        </style>
        <media-play-button mediapaused class="media-button">
          <svg slot="icon" viewBox="0 0 32 32">
            <!-- <use class="svg-shadow" xlink:href="#icon-play"></use> -->
            <g>
              <path
                id="icon-play"
                d="M20.7131 14.6976C21.7208 15.2735 21.7208 16.7265 20.7131 17.3024L12.7442 21.856C11.7442 22.4274 10.5 21.7054 10.5 20.5536L10.5 11.4464C10.5 10.2946 11.7442 9.57257 12.7442 10.144L20.7131 14.6976Z"
              />
            </g>
            <!-- <use class="svg-shadow" xlink:href="#icon-pause"></use> -->
            <g id="icon-pause">
              <rect id="pause-left" x="10.5" width="1em" y="10.5" height="11" rx="0.5" />
              <rect id="pause-right" x="17.5" width="1em" y="10.5" height="11" rx="0.5" />
            </g>
          </svg>
        </media-play-button>

        <!-- Volume/Mute -->
        <style>
          media-mute-button {
            position: relative;
          }

          media-mute-button .muted-path {
            transition: clip-path 0.2s ease-out;
          }

          media-mute-button #muted-path-2 {
            transition-delay: 0.2s;
          }

          media-mute-button .muted-path {
            clip-path: inset(0);
          }

          media-mute-button:not([mediavolumelevel='off']) #muted-path-1 {
            clip-path: inset(0 0 100% 0);
          }

          media-mute-button:not([mediavolumelevel='off']) #muted-path-2 {
            clip-path: inset(0 0 100% 0);
          }

          media-mute-button .muted-path {
            opacity: 0;
          }

          media-mute-button[mediavolumelevel='off'] .muted-path {
            opacity: 1;
          }

          media-mute-button .vol-path {
            opacity: 1;
            transition: opacity 0.4s;
          }

          media-mute-button[mediavolumelevel='off'] .vol-path {
            opacity: 0;
          }

          media-mute-button[mediavolumelevel='low'] #vol-high-path,
          media-mute-button[mediavolumelevel='medium'] #vol-high-path {
            opacity: 0;
          }

          media-volume-range {
            --media-range-track-background: rgba(255, 255, 255, 0.2);
            --media-range-thumb-opacity: 0;
          }

          @keyframes volume-in {
            0% {
              visibility: hidden;
              opacity: 0;
              transform: translateY(50%) rotate(1deg);
            }
            50% {
              visibility: visible;
              opacity: 1;
              transform: rotate(-2deg);
            }
            100% {
              visibility: visible;
              opacity: 1;
              transform: translateY(0) rotate(0deg);
            }
          }

          @keyframes volume-out {
            0% {
              visibility: visible;
              opacity: 1;
              transform: translateY(0) rotate(0deg);
            }
            50% {
              opacity: 1;
              transform: rotate(0deg);
            }
            100% {
              visibility: hidden;
              opacity: 0;
              transform: translateY(50%) rotate(1deg);
            }
          }

          .media-volume-range-wrapper {
            opacity: 0;
            visibility: hidden;

            position: absolute;
            top: -100%;
            left: calc(2 * var(--base));

            width: calc(10 * var(--base));
            height: calc(2.5 * var(--base));
            transform-origin: center left;
          }

          media-volume-range {
            /*
              Hide range and animation until mediavolume attribute is set.
              'visibility' didn't work, hovering over media-volume-range-wrapper
              caused it to show. Should require mute-button:hover.
            */
            opacity: 0;
            transition: opacity 0s 1s;

            width: calc(10 * var(--base));
            height: var(--base);
            padding: 0;
            border-radius: calc(0.25 * var(--base));
            overflow: hidden;
            background: rgba(0, 0, 0, 0.2);

            --media-range-bar-color: var(--media-accent-color);

            --media-range-padding-left: 0;
            --media-range-padding-right: 0;

            --media-range-track-width: calc(10 * var(--base));
            --media-range-track-height: var(--base);
            --media-range-track-border-radius: calc(0.25 * var(--base));
            --media-range-track-backdrop-filter: blur(10px) brightness(80%);

            /* This makes zero volume still show some of the bar.
               I can't make the bar have curved corners otherwise though. */
            --media-range-thumb-width: var(--base);
            --media-range-thumb-border-radius: calc(0.25 * var(--base));

            /* The Sutro design has a gradient like this, but not sure I like it */
            /* --media-range-thumb-box-shadow: 10px 0px 20px rgba(255, 255, 255, 0.5); */
          }

          media-volume-range[mediavolume] {
            opacity: 1;
          }

          [keyboardcontrol] media-volume-range:focus {
            /* TODO: This appears to be creating a think outline */
            outline: 1px solid rgba(27, 127, 204, 0.9);
          }

          media-mute-button:hover + .media-volume-range-wrapper,
          media-mute-button:focus + .media-volume-range-wrapper,
          media-mute-button:focus-within + .media-volume-range-wrapper,
          .media-volume-range-wrapper:hover,
          .media-volume-range-wrapper:focus,
          .media-volume-range-wrapper:focus-within {
            animation: 0.3s volume-in forwards ease-out;
          }

          .media-volume-range-wrapper:not(:hover, :focus-within) {
            animation: 0.3s volume-out ease-out;
          }

          /* When keyboard navigating the volume range and wrapper need to always be visible
            otherwise focus state can't land on it. This is ok when keyboard navigating because
            the hovering issues aren't a concern, unless you happen to be keyboard AND mouse navigating.
          */
          [keyboardcontrol] .media-volume-range-wrapper,
          [keyboardcontrol] .media-volume-range-wrapper:focus-within,
          [keyboardcontrol] .media-volume-range-wrapper:focus-within media-volume-range {
            visibility: visible;
          }
        </style>
        <media-mute-button class="media-button" notooltip>
          <use class="svg-shadow" xlink:href="#vol-paths"></use>
          <svg slot="icon" viewBox="0 0 32 32">
            <g id="vol-paths">
              <path
                id="speaker-path"
                d="M16.5 20.486v-8.972c0-1.537-2.037-2.08-2.802-.745l-1.026 1.79a2.5 2.5 0 0 1-.8.85l-1.194.78A1.5 1.5 0 0 0 10 15.446v1.11c0 .506.255.978.678 1.255l1.194.782a2.5 2.5 0 0 1 .8.849l1.026 1.79c.765 1.334 2.802.792 2.802-.745Z"
              />
              <path
                id="vol-low-path"
                class="vol-path"
                d="M18.5 18C19.6046 18 20.5 17.1046 20.5 16C20.5 14.8954 19.6046 14 18.5 14"
              />
              <path
                id="vol-high-path"
                class="vol-path"
                d="M18 21C20.7614 21 23 18.7614 23 16C23 13.2386 20.7614 11 18 11"
              />
              <path id="muted-path-1" class="muted-path" d="M23 18L19 14" />
              <path id="muted-path-2" class="muted-path" d="M23 14L19 18" />
            </g>
          </svg>
        </media-mute-button>
        <div class="media-volume-range-wrapper">
          <media-volume-range></media-volume-range>
        </div>

        <!-- Time Display -->
        <style>
          media-time-display {
            position: relative;
            padding: calc(0.5 * var(--base));
            font-size: calc(0.7 * var(--base));
            border-radius: calc(0.5 * var(--base));
          }

          media-controller[breakpointmd] media-time-display:not([showduration]) {
            display: none;
          }

          media-controller:not([breakpointmd]) media-time-display[showduration] {
            display: none;
          }
        </style>
        <media-time-display></media-time-display>
        <media-time-display showduration></media-time-display>

        <!-- Time Range / Progress Bar -->
        <style>
          media-time-range {
            height: calc(2 * var(--base));
            border-radius: calc(0.25 * var(--base));

            --media-range-track-backdrop-filter: invert(10%) blur(5px) brightness(110%);
            --media-range-track-background: rgba(255, 255, 255, 0.2);
            --media-range-track-pointer-background: rgba(255, 255, 255, 0.5);
            --media-range-track-border-radius: calc(0.25 * var(--base));

            --media-time-range-buffered-color: rgba(255, 255, 255, 0.4);
            --media-range-bar-color: var(--media-accent-color);

            --media-range-thumb-background: var(--media-accent-color);
            --media-range-thumb-transition: opacity 0.1s linear;
            --media-range-thumb-opacity: 0;

            --media-preview-thumbnail-border: calc(0.125 * var(--base)) solid #fff;
            --media-preview-thumbnail-border-radius: calc(0.5 * var(--base));
            --media-preview-thumbnail-min-width: calc(8 * var(--base));
            --media-preview-thumbnail-max-width: calc(10 * var(--base));
            --media-preview-thumbnail-min-height: calc(5 * var(--base));
            --media-preview-thumbnail-max-height: calc(7 * var(--base));
            --media-preview-box-margin: 0 0 -10px;
          }
          media-time-range:hover {
            --media-range-thumb-opacity: 1;
            --media-range-track-height: calc(0.25 * var(--base));
          }

          media-preview-thumbnail {
            margin-bottom: 5px;
          }

          media-preview-chapter-display {
            font-size: calc(0.6 * var(--base));
            padding-block: 0;
          }

          media-preview-time-display {
            font-size: calc(0.65 * var(--base));
            padding-top: 0;
          }
        </style>
        <media-time-range>
          <media-preview-thumbnail slot="preview"></media-preview-thumbnail>
          <media-preview-chapter-display slot="preview"></media-preview-chapter-display>
          <media-preview-time-display slot="preview"></media-preview-time-display>
        </media-time-range>

        <!-- Subtitles/CC Button -->
        <style>
          media-captions-button {
            position: relative;
          }

          media-controller:not([breakpointmd]) media-captions-button {
            display: none;
          }

          media-captions-button svg :is(path, rect) {
            stroke: none;
            fill: var(--_primary-color);
          }

          /* Disble the captions button when no subtitles are available */
          media-captions-button:not([mediasubtitleslist]) svg {
            opacity: 0.3;
          }

          media-captions-button #cc-underline {
            opacity: 1;
          }

          media-captions-button[mediasubtitleslist][aria-checked='true'] #cc-underline {
            opacity: 1;
          }

          media-captions-button #cc-underline {
            transition: clip-path 0.15s ease-out;
          }

          media-captions-button #cc-underline {
            clip-path: inset(0 100% 0 0);
          }

          media-captions-button[aria-checked='true'] #cc-underline {
            clip-path: inset(0 0 0 0);
          }
        </style>
        <media-captions-button class="media-button">
          <svg slot="icon" viewBox="0 0 32 32">
            <use class="svg-shadow" xlink:href="#cc-icon"></use>
            <g id="cc-icon">
              <path
                class="cc-c"
                d="M15.6634 14.3574H14.5636C14.4985 14.0523 14.3847 13.7842 14.2221 13.5532C14.0624 13.3222 13.8673 13.1283 13.6367 12.9715C13.409 12.8118 13.1562 12.692 12.8783 12.6122C12.6004 12.5323 12.3107 12.4924 12.0091 12.4924C11.4592 12.4924 10.961 12.6264 10.5146 12.8945C10.0711 13.1625 9.71776 13.5575 9.45463 14.0794C9.19445 14.6012 9.06436 15.2414 9.06436 16C9.06436 16.7586 9.19445 17.3988 9.45463 17.9206C9.71776 18.4425 10.0711 18.8375 10.5146 19.1055C10.961 19.3736 11.4592 19.5076 12.0091 19.5076C12.3107 19.5076 12.6004 19.4677 12.8783 19.3878C13.1562 19.308 13.409 19.1896 13.6367 19.0328C13.8673 18.8731 14.0624 18.6778 14.2221 18.4468C14.3847 18.2129 14.4985 17.9449 14.5636 17.6426H15.6634C15.5806 18.0903 15.4298 18.491 15.2111 18.8446C14.9923 19.1982 14.7203 19.499 14.3951 19.7471C14.0698 19.9924 13.7047 20.1792 13.2996 20.3075C12.8976 20.4358 12.4674 20.5 12.0091 20.5C11.2345 20.5 10.5456 20.3175 9.94246 19.9525C9.33932 19.5875 8.8648 19.0684 8.51888 18.3954C8.17296 17.7224 8 16.924 8 16C8 15.076 8.17296 14.2776 8.51888 13.6046C8.8648 12.9316 9.33932 12.4125 9.94246 12.0475C10.5456 11.6825 11.2345 11.5 12.0091 11.5C12.4674 11.5 12.8976 11.5642 13.2996 11.6925C13.7047 11.8208 14.0698 12.009 14.3951 12.2571C14.7203 12.5024 14.9923 12.8018 15.2111 13.1554C15.4298 13.5062 15.5806 13.9068 15.6634 14.3574Z"
              />
              <path
                class="cc-c"
                d="M24 14.3574H22.9002C22.8351 14.0523 22.7213 13.7842 22.5587 13.5532C22.399 13.3222 22.2039 13.1283 21.9733 12.9715C21.7456 12.8118 21.4928 12.692 21.2149 12.6122C20.937 12.5323 20.6473 12.4924 20.3457 12.4924C19.7958 12.4924 19.2976 12.6264 18.8511 12.8945C18.4077 13.1625 18.0543 13.5575 17.7912 14.0794C17.531 14.6012 17.4009 15.2414 17.4009 16C17.4009 16.7586 17.531 17.3988 17.7912 17.9206C18.0543 18.4425 18.4077 18.8375 18.8511 19.1055C19.2976 19.3736 19.7958 19.5076 20.3457 19.5076C20.6473 19.5076 20.937 19.4677 21.2149 19.3878C21.4928 19.308 21.7456 19.1896 21.9733 19.0328C22.2039 18.8731 22.399 18.6778 22.5587 18.4468C22.7213 18.2129 22.8351 17.9449 22.9002 17.6426H24C23.9172 18.0903 23.7664 18.491 23.5476 18.8446C23.3289 19.1982 23.0569 19.499 22.7316 19.7471C22.4064 19.9924 22.0413 20.1792 21.6362 20.3075C21.2341 20.4358 20.804 20.5 20.3457 20.5C19.5711 20.5 18.8822 20.3175 18.279 19.9525C17.6759 19.5875 17.2014 19.0684 16.8555 18.3954C16.5095 17.7224 16.3366 16.924 16.3366 16C16.3366 15.076 16.5095 14.2776 16.8555 13.6046C17.2014 12.9316 17.6759 12.4125 18.279 12.0475C18.8822 11.6825 19.5711 11.5 20.3457 11.5C20.804 11.5 21.2341 11.5642 21.6362 11.6925C22.0413 11.8208 22.4064 12.009 22.7316 12.2571C23.0569 12.5024 23.3289 12.8018 23.5476 13.1554C23.7664 13.5062 23.9172 13.9068 24 14.3574Z"
              />
              <rect id="cc-underline" x="8" y="23" width="16" height="1" rx="0.5" />
            </g>
          </svg>
        </media-captions-button>

        <!-- Settings Menu Button -->
        <style>
          media-settings-menu-button svg {
            transition: transform 0.1s cubic-bezier(0.4, 0, 1, 1);
            transform: rotateZ(0deg);
          }
          media-settings-menu-button[aria-expanded='true'] svg {
            transform: rotateZ(30deg);
          }
        </style>
        <media-settings-menu-button class="media-button">
          <svg slot="icon" viewBox="0 0 32 32">
            <use class="svg-shadow" xlink:href="#settings-icon"></use>
            <g id="settings-icon">
              <path
                d="M16 18C17.1046 18 18 17.1046 18 16C18 14.8954 17.1046 14 16 14C14.8954 14 14 14.8954 14 16C14 17.1046 14.8954 18 16 18Z"
              />
              <path
                d="M21.0176 13.0362L20.9715 12.9531C20.8445 12.7239 20.7797 12.4629 20.784 12.1982L20.8049 10.8997C20.8092 10.6343 20.675 10.3874 20.4545 10.2549L18.5385 9.10362C18.3186 8.97143 18.0472 8.9738 17.8293 9.10981L16.7658 9.77382C16.5485 9.90953 16.2999 9.98121 16.0465 9.98121H15.9543C15.7004 9.98121 15.4513 9.90922 15.2336 9.77295L14.1652 9.10413C13.9467 8.96728 13.674 8.96518 13.4535 9.09864L11.5436 10.2545C11.3242 10.3873 11.1908 10.6336 11.1951 10.8981L11.216 12.1982C11.2203 12.4629 11.1555 12.7239 11.0285 12.9531L10.9831 13.0351C10.856 13.2645 10.6715 13.4535 10.4493 13.5819L9.36075 14.2109C9.13763 14.3398 8.99942 14.5851 9 14.8511L9.00501 17.152C9.00559 17.4163 9.1432 17.6597 9.36476 17.7883L10.4481 18.4167C10.671 18.546 10.8559 18.7364 10.9826 18.9673L11.0313 19.0559C11.1565 19.284 11.2203 19.5431 11.2161 19.8059L11.1951 21.1003C11.1908 21.3657 11.325 21.6126 11.5456 21.7452L13.4615 22.8964C13.6814 23.0286 13.9528 23.0262 14.1707 22.8902L15.2342 22.2262C15.4515 22.0905 15.7001 22.0188 15.9535 22.0188H16.0457C16.2996 22.0188 16.5487 22.0908 16.7664 22.227L17.8348 22.8959C18.0534 23.0327 18.326 23.0348 18.5465 22.9014L20.4564 21.7455C20.6758 21.6127 20.8092 21.3664 20.8049 21.1019L20.784 19.8018C20.7797 19.5371 20.8445 19.2761 20.9715 19.0469L21.0169 18.9649C21.144 18.7355 21.3285 18.5465 21.5507 18.4181L22.6393 17.7891C22.8624 17.6602 23.0006 17.4149 23 17.1489L22.995 14.848C22.9944 14.5837 22.8568 14.3403 22.6352 14.2117L21.5493 13.5818C21.328 13.4534 21.1442 13.2649 21.0176 13.0362Z"
              />
            </g>
          </svg>
        </media-settings-menu-button>

        <!-- PIP/Mini Player Button -->
        <style>
          media-controller:not([breakpointmd]) media-pip-button {
            display: none;
          }
        </style>
        <media-pip-button class="media-button">
          <svg slot="icon" viewBox="0 0 32 32">
            <use class="svg-shadow" xlink:href="#pip-icon"></use>
            <g id="pip-icon">
              <path
                d="M12 22H9.77778C9.34822 22 9 21.6162 9 21.1429V10.8571C9 10.3838 9.34822 10 9.77778 10L22.2222 10C22.6518 10 23 10.3838 23 10.8571V12.5714"
              />
              <path
                d="M15 21.5714V16.4286C15 16.1919 15.199 16 15.4444 16H22.5556C22.801 16 23 16.1919 23 16.4286V17V21.5714C23 21.8081 22.801 22 22.5556 22H20.3333H17.6667H15.4444C15.199 22 15 21.8081 15 21.5714Z"
              />
            </g>
          </svg>
        </media-pip-button>

        <!-- Airplay Button -->
        <media-airplay-button class="media-button">
          <svg viewBox="0 0 32 32" aria-hidden="true" slot="icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.5 20h1.722c.43 0 .778-.32.778-.714v-8.572c0-.394-.348-.714-.778-.714H9.778c-.43 0-.778.32-.778.714v1.429"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.5 20H9.778c-.43 0-.778-.32-.778-.714v-8.572c0-.394.348-.714.778-.714h12.444c.43 0 .778.32.778.714v1.429"/>
            <path stroke-linejoin="round" d="m16 19 3.464 3.75h-6.928L16 19Z"/>
          </svg>
        </media-airplay-button>

        <!-- Cast Button -->
        <media-cast-button class="media-button">
          <svg slot="icon" viewBox="0 0 32 32">
            <use class="svg-shadow" xlink:href="#cast-icon"></use>
            <g id="cast-icon">
              <path
                d="M18.5 21.833h4.167c.46 0 .833-.373.833-.833V11a.833.833 0 0 0-.833-.833H9.333A.833.833 0 0 0 8.5 11v1.111m0 8.056c.92 0 1.667.746 1.667 1.666M8.5 17.667a4.167 4.167 0 0 1 4.167 4.166"
              />
              <path d="M8.5 15.167a6.667 6.667 0 0 1 6.667 6.666" />
            </g>
          </svg>
        </media-cast-button>

        <!-- Fullscreen Button -->
        <style>
          /* Having trouble getting @property to work in the shadow dom
             to clean this up. Like https://codepen.io/luwes/pen/oNRyZyx */

          media-fullscreen-button .fs-arrow {
            translate: 0% 0%;
          }
          media-fullscreen-button:hover .fs-arrow {
            animation: 0.35s up-left-bounce cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          media-fullscreen-button:hover #fs-enter-top,
          media-fullscreen-button:hover #fs-exit-bottom {
            animation-name: up-right-bounce;
          }

          media-fullscreen-button:hover #fs-enter-bottom,
          media-fullscreen-button:hover #fs-exit-top {
            animation-name: down-left-bounce;
          }

          @keyframes up-left-bounce {
            0% {
              translate: 0 0;
            }
            50% {
              translate: -4% -4%;
            }
          }
          @keyframes up-right-bounce {
            0% {
              translate: 0 0;
            }
            50% {
              translate: 4% -4%;
            }
          }
          @keyframes down-left-bounce {
            0% {
              translate: 0 0;
            }
            50% {
              translate: -4% 4%;
            }
          }
          @keyframes down-right-bounce {
            0% {
              translate: 0 0;
            }
            50% {
              translate: 4% 4%;
            }
          }
        </style>
        <media-fullscreen-button class="media-button">
          <svg slot="enter" viewBox="0 0 32 32">
            <use class="svg-shadow" xlink:href="#fs-enter-paths"></use>
            <g id="fs-enter-paths">
              <g id="fs-enter-top" class="fs-arrow">
                <path d="M18 10H22V14" />
                <path d="M22 10L18 14" />
              </g>
              <g id="fs-enter-bottom" class="fs-arrow">
                <path d="M14 22L10 22V18" />
                <path d="M10 22L14 18" />
              </g>
            </g>
          </svg>
          <svg slot="exit" viewBox="0 0 32 32">
            <use class="svg-shadow" xlink:href="#fs-exit-paths"></use>
            <g id="fs-exit-paths">
              <g id="fs-exit-top" class="fs-arrow">
                <path d="M22 14H18V10" />
                <path d="M22 10L18 14" />
              </g>
              <g id="fs-exit-bottom" class="fs-arrow">
                <path d="M10 18L14 18V22" />
                <path d="M14 18L10 22" />
              </g>
            </g>
          </svg>
        </media-fullscreen-button>
      </media-control-bar>
    </media-controller>

  `);var Wl=class extends ti{static template=Bl};l.customElements&&!l.customElements.get("media-theme-sutro")&&l.customElements.define("media-theme-sutro",Wl);var fv={"Start airplay":"\u5F00\u59CB AirPlay","Stop airplay":"\u505C\u6B62 AirPlay",Audio:"\u97F3\u9891",Captions:"\u5B57\u5E55","Enable captions":"\u5F00\u542F\u5B57\u5E55","Disable captions":"\u5173\u95ED\u5B57\u5E55","Start casting":"\u5F00\u59CB\u6295\u5C4F","Stop casting":"\u505C\u6B62\u6295\u5C4F","Enter fullscreen mode":"\u8FDB\u5165\u5168\u5C4F","Exit fullscreen mode":"\u9000\u51FA\u5168\u5C4F",Mute:"\u9759\u97F3",Unmute:"\u6062\u590D\u97F3\u91CF",Loop:"\u5FAA\u73AF\u64AD\u653E","Enter picture in picture mode":"\u5F00\u542F\u753B\u4E2D\u753B","Exit picture in picture mode":"\u5173\u95ED\u753B\u4E2D\u753B",Play:"\u64AD\u653E",Pause:"\u6682\u505C","Playback rate":"\u64AD\u653E\u901F\u5EA6","Playback rate {playbackRate}":"\u64AD\u653E\u901F\u5EA6\uFF1A{playbackRate}",Quality:"\u6E05\u6670\u5EA6","Seek backward":"\u5FEB\u9000","Seek forward":"\u5FEB\u8FDB",Settings:"\u8BBE\u7F6E",Auto:"\u81EA\u52A8","audio player":"\u97F3\u9891\u64AD\u653E\u5668","video player":"\u89C6\u9891\u64AD\u653E\u5668",volume:"\u97F3\u91CF",seek:"\u8DF3\u8F6C","closed captions":"\u9690\u85CF\u5F0F\u8F85\u52A9\u5B57\u5E55","current playback rate":"\u5F53\u524D\u64AD\u653E\u901F\u5EA6","playback time":"\u64AD\u653E\u65F6\u95F4","media loading":"\u5A92\u4F53\u52A0\u8F7D\u4E2D...",settings:"\u8BBE\u7F6E","audio tracks":"\u97F3\u8F68",quality:"\u6E05\u6670\u5EA6",play:"\u64AD\u653E",pause:"\u6682\u505C",mute:"\u9759\u97F3",unmute:"\u6062\u590D\u97F3\u91CF","chapter: {chapterName}":"\u7AE0\u8282: {chapterName}",live:"\u76F4\u64AD",Off:"\u5173\u95ED","start airplay":"\u5F00\u59CB AirPlay","stop airplay":"\u505C\u6B62 AirPlay","start casting":"\u5F00\u59CB\u6295\u5C4F","stop casting":"\u505C\u6B62\u6295\u5C4F","enter fullscreen mode":"\u8FDB\u5165\u5168\u5C4F","exit fullscreen mode":"\u9000\u51FA\u5168\u5C4F","enter picture in picture mode":"\u5F00\u542F\u753B\u4E2D\u753B","exit picture in picture mode":"\u5173\u95ED\u753B\u4E2D\u753B","seek to live":"\u8DF3\u8F6C\u81F3\u76F4\u64AD\u8FDB\u5EA6","playing live":"\u6B63\u5728\u76F4\u64AD\u4E2D","seek back {seekOffset} seconds":"\u5FEB\u9000 {seekOffset} \u79D2","seek forward {seekOffset} seconds":"\u5FEB\u8FDB {seekOffset} \u79D2","Network Error":"\u7F51\u7EDC\u9519\u8BEF","Decode Error":"\u89E3\u7801\u5931\u8D25","Source Not Supported":"\u4E0D\u652F\u6301\u7684\u5A92\u4F53\u6765\u6E90","Encryption Error":"\u52A0\u5BC6\u9519\u8BEF","A network error caused the media download to fail.":"\u5A92\u4F53\u4E0B\u8F7D\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u8FDE\u63A5\u3002","A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.":"\u5A92\u4F53\u9519\u8BEF\u5BFC\u81F4\u64AD\u653E\u4E2D\u6B62\u3002\u53EF\u80FD\u662F\u6587\u4EF6\u635F\u574F\uFF0C\u6216\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u8BE5\u683C\u5F0F\u3002","An unsupported error occurred. The server or network failed, or your browser does not support this format.":"\u53D1\u751F\u672A\u652F\u6301\u7684\u9519\u8BEF\uFF0C\u53EF\u80FD\u662F\u670D\u52A1\u5668\u6216\u7F51\u7EDC\u6545\u969C\uFF0C\u6216\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u8BE5\u683C\u5F0F\u3002","The media is encrypted and there are no keys to decrypt it.":"\u5A92\u4F53\u5DF2\u52A0\u5BC6\uFF0C\u7F3A\u5C11\u89E3\u5BC6\u5BC6\u94A5\u3002",hour:"\u5C0F\u65F6",hours:"\u5C0F\u65F6",minute:"\u5206\u949F",minutes:"\u5206\u949F",second:"\u79D2",seconds:"\u79D2","{time} remaining":"\u5269\u4F59 {time}","{currentTime} of {totalTime}":"{currentTime} / {totalTime}","video not loaded, unknown time.":"\u89C6\u9891\u672A\u52A0\u8F7D\uFF0C\u65F6\u95F4\u672A\u77E5\u3002"};Sd("zh-CN",fv);var Gc=new WeakSet;function qc(){let t=document.querySelector("#icp-panel media-theme-sutro"),e=t?.shadowRoot?.querySelector("media-controller");if(!e||Gc.has(e))return;Gc.add(e),e.lang="zh-CN",e.setAttribute("nohotkeys",""),e.fullscreenElement=t.closest(".icp-main"),e.querySelector("media-playback-rate-menu")?.setAttribute("rates","0.75 1 1.25 1.5 1.75 2 2.5 3");let i=e.querySelector("media-settings-menu");if(i){let r={Speed:"\u901F\u5EA6","Playback Speed":"\u901F\u5EA6",Quality:"\u753B\u8D28",Captions:"\u5B57\u5E55","Subtitles/CC":"\u5B57\u5E55"};for(let n of i.querySelectorAll(":scope > media-settings-menu-item"))for(let d of n.childNodes)d.nodeType===3&&r[d.textContent.trim()]&&(d.textContent=r[d.textContent.trim()]);for(let n of i.querySelectorAll("[slot=title]"))r[n.textContent.trim()]&&(n.textContent=r[n.textContent.trim()]);let s=document.createElement("media-settings-menu-item");s.textContent="\u8BC6\u522B\u4E0E\u4EBA\u58F0\u589E\u5F3A",s.addEventListener("click",()=>{i.hidden=!0,t.dispatchEvent(new Event("icp-settings-request",{bubbles:!0,composed:!0}))}),i.append(s)}let a=t.querySelector("video");a&&(a.controls=!1),t.setAttribute("data-icp-ready","true")}new MutationObserver(qc).observe(document,{childList:!0,subtree:!0});qc();})();
