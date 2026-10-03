const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const manifest=require('../manifest.json');

test('Sutro registration runs in MAIN while credential and recognition scripts stay isolated',()=>{
  const main=manifest.content_scripts.filter(s=>s.world==='MAIN');
  assert.equal(main.length,1);
  assert.deepEqual(main[0].js,['vendor/sutro.js']);
  assert.equal(main[0].run_at,'document_start');
  const isolated=manifest.content_scripts.filter(s=>!s.world||s.world==='ISOLATED').flatMap(s=>s.js);
  for(const file of ['content.js','sutro-player.js','qwen-cache.js','core.js'])assert.ok(isolated.includes(file));
});

test('late isolated host creation configures MAIN controls once and keeps native fallback until ready',()=>{
  let host=null,observe;const attrs={},rates={},video={controls:true},container={};let fullscreenAssignments=0;
  const controller={setAttribute:(key,value)=>attrs[key]=value,querySelector:key=>key==='media-playback-rate-menu'?{setAttribute:(k,v)=>rates[k]=v}:null,set fullscreenElement(value){assert.equal(value,container);fullscreenAssignments++;}};
  const theme={shadowRoot:{querySelector:()=>controller},querySelector:()=>video,closest:()=>container,setAttribute:(key,value)=>attrs[key]=value};
  const source=fs.readFileSync(require.resolve('../scripts/sutro-entry.js'),'utf8').replace(/^import .*;$/gm,'');
  vm.runInNewContext(source,{document:{querySelector:()=>host},MutationObserver:class{constructor(fn){observe=fn;}observe(){}},WeakSet,Event});
  assert.equal(video.controls,true);
  host=theme;observe();assert.equal(video.controls,false);assert.equal(attrs['data-icp-ready'],'true');assert.equal(attrs.nohotkeys,'');assert.ok(rates.rates.includes('2.5'));
  observe();assert.equal(fullscreenAssignments,1);
});
