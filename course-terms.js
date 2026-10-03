/* Course context stays in extension-owned scripts, never in the MAIN player world. */
(function(root){
  'use strict';
  function resolve(courseId,prompts={}){
    if(!/^\d{1,10}$/.test(courseId||''))return '';
    const custom=typeof prompts?.[courseId]==='string'?prompts[courseId].trim():'';
    return custom.slice(0,800);
  }
  const api={resolve};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.ICourseTerms=api;
})(globalThis);
