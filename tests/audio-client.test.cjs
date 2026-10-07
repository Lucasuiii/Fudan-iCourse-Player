const { test } = require('node:test');
const assert = require('node:assert/strict');
require('../core.js');
const { voiceRequest } = globalThis.ICourseCore;
test('missing reply and invalidated runtime provide reload instructions', async () => {
  await assert.rejects(voiceRequest(undefined, 'toggle'), /重新加载.*刷新/);
  await assert.rejects(voiceRequest({ id: 'test', sendMessage: async () => undefined }, 'toggle', { enabled: true }), /没有响应.*重新加载.*刷新/);
  await assert.rejects(voiceRequest({ id: 'test', sendMessage: async () => { throw Error('Extension context invalidated'); } }, 'toggle'), /context invalidated.*重新加载/);
});
test('audio errors remain intact without a recognition probe', async () => {
  const calls = [];
  const runtime = { id: 'test', sendMessage: async message => {
    calls.push(message.type);
    return { ok: false, error: '音频捕获已停止' };
  } };
  await assert.rejects(voiceRequest(runtime, 'toggle', { enabled: false }), /^Error: 音频捕获已停止$/);
  assert.deepEqual(calls, ['toggle']);
});
