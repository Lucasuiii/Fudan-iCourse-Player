const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const Player=require('../sutro-player.js');

function element(selector,editable=false){return {isContentEditable:editable,matches:selectors=>selectors.split(',').includes(selector)};}
function fixture(){
  let handler,toggles=0;
  const theme=element('media-theme-sutro'),video={src:'sample.mp4'};
  const sutro=Object.assign(Object.create(Player.prototype),{theme,video});
  const source=fs.readFileSync(require.resolve('../content.js'),'utf8');
  const start=source.lastIndexOf("  document.addEventListener('keydown'");
  vm.runInNewContext(source.slice(start,source.lastIndexOf('})();')),{document:{addEventListener:(_,fn)=>handler=fn},panel:{hidden:false},more:{hidden:true},video,state:{hls:null},sutro,togglePlayback:()=>toggles++});
  function press(path,extra={}){
    const result={prevented:false,stopped:false};
    handler({key:' ',repeat:false,composedPath:()=>path,preventDefault:()=>result.prevented=true,stopImmediatePropagation:()=>result.stopped=true,...extra});
    return {...result,toggles};
  }
  return {press,theme,video};
}
test('Space pauses/resumes after fullscreen or CC button focus without activating that button',()=>{
  const {press,theme}=fixture();
  assert.deepEqual(press([element('button'),element('[role=button]'),theme]),{prevented:true,stopped:true,toggles:1});
  assert.equal(press([element('button'),theme]).toggles,2);
});
test('video focus and the player background support Space; holding it does not toggle repeatedly',()=>{
  const {press,video}=fixture();
  assert.equal(press([video]).toggles,1);
  assert.deepEqual(press([video],{repeat:true}),{prevented:true,stopped:true,toggles:1});
  assert.equal(press([element('div')]).toggles,2);
});
test('editable fields, menus, sliders and controls outside Sutro keep native Space behavior',()=>{
  for(const selector of ['input','textarea','select','a','summary','[role=slider]','[role=menu]','[role=menuitemradio]','[role=menuitem]','[role=menuitemcheckbox]']){
    const {press,theme}=fixture();
    assert.deepEqual(press([element(selector),theme]),{prevented:false,stopped:false,toggles:0},selector);
  }
  const {press}=fixture();
  assert.equal(press([element('div',true)]).toggles,0);
  assert.equal(press([element('button')]).toggles,0);
});
test('browser shortcuts and IME composition do not change playback; K still toggles it',()=>{
  const {press,theme}=fixture();
  for(const modifier of ['altKey','ctrlKey','metaKey','isComposing'])assert.equal(press([theme],{[modifier]:true}).toggles,0);
  assert.equal(press([element('button'),theme],{key:'k'}).toggles,1);
});
