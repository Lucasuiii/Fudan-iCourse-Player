const { test } = require('node:test');
const assert = require('node:assert/strict');
require('../core.js');
const { voiceRequest } = globalThis.ICourseCore;
test('legacy background is detected before sending ASR without disturbing capture', async () => {
  const calls = [];
  const runtime = { id: 'test', sendMessage: async message => {
    calls.push(message.type);
    return { ok: true, state: { enabled: true, active: true } };
  } };
  await assert.rejects(voiceRequest(runtime, 'asr', { enabled: true }), /后台不支持本地识别.*重新加载.*刷新/);
  assert.deepEqual(calls, ['state']);
  assert.equal((await voiceRequest(runtime, 'toggle')).enabled, true);
});
test('compatible background receives ASR clock after capability check', async () => {
  const calls = [], clock = { epoch: 3, time: 12, paused: false, rate: 1 };
  const runtime = { id: 'test', sendMessage: async message => {
    calls.push(message);
    return { ok: true, asrProtocol: 1, state: { active: true } };
  } };
  assert.equal((await voiceRequest(runtime, 'asr', { enabled: true, clock })).active, true);
  assert.deepEqual(calls.map(c => c.type), ['state', 'asr']);
  assert.equal(calls[1].clock, clock);
});
test('missing reply and invalidated runtime provide reload instructions', async () => {
  await assert.rejects(voiceRequest(undefined, 'asr'), /重新加载.*刷新/);
  await assert.rejects(voiceRequest({ id: 'test', sendMessage: async () => undefined }, 'asr', { enabled: true }), /没有响应.*重新加载.*刷新/);
  await assert.rejects(voiceRequest({ id: 'test', sendMessage: async () => { throw Error('Extension context invalidated'); } }, 'toggle'), /context invalidated.*重新加载/);
});
test('model errors remain intact and stopping ASR skips the compatibility probe', async () => {
  const calls = [];
  const runtime = { id: 'test', sendMessage: async message => {
    calls.push(message.type);
    return { ok: false, error: '缺少本地模型文件' };
  } };
  await assert.rejects(voiceRequest(runtime, 'asr', { enabled: false }), /^Error: 缺少本地模型文件$/);
  assert.deepEqual(calls, ['asr']);
});
