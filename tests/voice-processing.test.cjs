const {test}=require('node:test'),assert=require('node:assert/strict');
const moduleReady=import('../scripts/voice-processing.mjs');
function frame(amplitude,phase=0){return Float32Array.from({length:480},(_,i)=>amplitude*Math.sin(2*Math.PI*(i+phase)/48));}
function rms(a){return Math.sqrt(a.reduce((sum,x)=>sum+x*x,0)/a.length);}
test('speech-only leveling raises quiet speech gradually, links stereo and never boosts noise',async()=>{
 const {FrameEnhancer}=await moduleReady,p=new FrameEnhancer();let last;
 for(let i=0;i<500;i++){const left=frame(.025),right=frame(.0125);last=[left,right];p.process(last,[left.slice(),right.slice()],.9);}
 assert.ok(rms(last[0])>rms(frame(.025))*1.8);assert.ok(p.gain<=2);assert.ok(Math.abs(rms(last[0])/rms(last[1])-2)<1e-5);
 const noise=new FrameEnhancer();for(let i=0;i<500;i++)noise.process([frame(.003),frame(.003)],[frame(.003),frame(.003)],.05);
 assert.equal(noise.gain,1);
});
test('leveling reduces sustained loudness changes and disabled leveling returns smoothly to unity',async()=>{
 const {FrameEnhancer}=await moduleReady;
 const a=new FrameEnhancer(),b=new FrameEnhancer();let quiet,loud;
 for(let i=0;i<1000;i++){quiet=[frame(.05)];loud=[frame(.2)];a.process(quiet,[frame(.05)],.9);b.process(loud,[frame(.2)],.9);}
 assert.ok(rms(loud[0])/rms(quiet[0])<1.4);
 a.configure({level:false});const before=a.gain;a.process([frame(.05)],[frame(.05)],.9);assert.ok(a.gain<before&&a.gain>1);
 for(let i=0;i<500;i++)a.process([frame(.05)],[frame(.05)],.9);assert.ok(Math.abs(a.gain-1)<.01);
});
test('light blend preserves more residual signal and aligned frames avoid cancellation',async()=>{
 const {FrameEnhancer}=await moduleReady,p=new FrameEnhancer();p.configure({strength:'light',level:false});let out;
 for(let i=0;i<100;i++){out=[frame(.01)];p.process(out,[frame(.1)],.9);}
 assert.ok(Math.abs(rms(out[0])/rms(frame(.028))-1)<.01);
 const same=[frame(.1)];p.process(same,[frame(.1)],.9);assert.ok(Math.abs(rms(same[0])-rms(frame(.1)))<1e-7);
});
test('experimental tail preserves onset/hold and gently suppresses low-probability residual after speech',async()=>{
 const {FrameEnhancer}=await moduleReady,p=new FrameEnhancer();p.configure({level:false,tail:true});
 let out=[frame(.1)];p.process(out,[frame(.1)],.9);assert.equal(p.tailGain,1);
 for(let i=0;i<12;i++){out=[frame(.02)];p.process(out,[frame(.02)],.05);assert.equal(p.tailGain,1);}
 for(let i=0;i<100;i++){out=[frame(.02)];p.process(out,[frame(.02)],.05);}
 assert.ok(p.tailGain>=.6&&p.tailGain<.61);
 for(let i=0;i<10;i++)p.process([frame(.1)],[frame(.1)],.9);assert.ok(p.tailGain>.999);
 const disabled=new FrameEnhancer();disabled.configure({level:false});for(let i=0;i<200;i++)disabled.process([frame(.02)],[frame(.02)],.05);assert.equal(disabled.tailGain,1);
});
