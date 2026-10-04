const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync(require.resolve('../content.js'),'utf8');
const reset=source.match(/function resetVideo\(\) \{[\s\S]*?\n  \}/)[0];

test('course reset completes without an obsolete relay container, even when service release fails',async()=>{
 const calls=[];const state={loadToken:4,restoreAt:10,playController:{abort(){calls.push('abort');}},hls:{destroy(){calls.push('destroy');}}};
 const scope={state,qwenMedia:async request=>{calls.push(request.action);throw new Error('service offline');},saveProgress:()=>calls.push('save'),stopVoice:()=>calls.push('stopVoice'),clearSubtitle:()=>calls.push('clearSubtitle'),video:{pause:()=>calls.push('pause'),removeAttribute:key=>calls.push('remove '+key),load:()=>calls.push('load')}};
 vm.runInNewContext(reset+';resetVideo();',scope);
 await new Promise(resolve=>setImmediate(resolve));
 assert.deepEqual(calls,['release','save','abort','pause','destroy','stopVoice','remove src','load','clearSubtitle']);
 assert.equal(state.loadToken,5);assert.equal(state.restoreAt,0);assert.equal(state.hls,null);
});
