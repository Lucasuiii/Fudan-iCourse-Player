'use strict';
const $ = selector => document.querySelector(selector);
let prompts = {};
function showPreset(){
  const note=$('#preset-info'),preset=ICourseTerms.preset($('#course').value.trim());
  note.hidden=!preset;
  note.textContent=preset?'此课程自动附加希腊字母和数值算法术语提示。填写的关键词可补充并优先使用，发送的总长度最多 800 字。提示不保证识别正确，修改后使用对应的新字幕缓存。':'';
}
chrome.storage.local.get(['whisperKey', 'whisperCourseId', 'whisperPrompts']).then(values => {
  $('#key').value = values.whisperKey || '';
  $('#course').value = values.whisperCourseId || '';
  prompts = values.whisperPrompts || {};
  $('#prompt').value = prompts[$('#course').value] || '';
  showPreset();
});
$('#course').addEventListener('input', () => { $('#prompt').value = prompts[$('#course').value] || ''; showPreset(); });
$('#save').addEventListener('click', async () => {
  const key = $('#key').value.trim(), course = $('#course').value.trim(), prompt = $('#prompt').value.trim().slice(0, 800);
  const label = $('#status');
  if (key.length < 24 || key.length > 128) { label.textContent = '请填写服务生成的完整连接密钥'; return; }
  if ((course && !/^\d{1,10}$/.test(course)) || (prompt && !course)) { label.textContent = '填写术语时需要正确的课程 ID，避免影响其他课程'; return; }
  try {
    const saved = await chrome.storage.local.get('whisperPrompts');
    prompts = { ...(saved.whisperPrompts || {}) };
    if (course) { if (prompt) prompts[course] = prompt; else delete prompts[course]; }
    await chrome.storage.local.set({ whisperKey: key, whisperCourseId: course, whisperPrompts: prompts });
    label.textContent = '正在检查…';
    const reply = await chrome.runtime.sendMessage({ target: $('#engine').value==='qwen'?'qwen-background':'whisper-background', type: 'health' });
    label.textContent = reply?.ok ? '连接成功：' + reply.result.model + '。关键词已保存，正在识别的对应课程会自动重新载入。Qwen 会重新准备当前及前方窗口；Whisper 从当前位置继续识别。' : (reply?.error || '后台未响应，请重新加载扩展');
  } catch (error) { label.textContent = error.message; }
});
