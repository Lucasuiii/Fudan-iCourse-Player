/* Worker bridge: bounded backlog and independent failure handling. */
(function (root) {
  'use strict';
  class ASRSession {
    constructor(context, source, emit) {
      this.context = context; this.source = source; this.emit = emit;
      this.pending = []; this.inFlight = false; this.ready = false; this.closed = false;
      this.clock = { epoch: 0, time: 0, paused: true, rate: 1 }; this.stamp = performance.now();
    }
    async start() {
      this.worker = new Worker('asr-worker.js');
      this.worker.onmessage = ({ data }) => {
        if (this.closed) return;
        if (data.type === 'error') { this.fail(data.error); return; }
        if (data.type === 'ready') { this.ready = true; clearTimeout(this.timer); this.emit({ type: 'ready' }); }
        if (data.type === 'loading') this.emit({ type: 'loading' });
        if (data.type === 'text' && data.epoch === this.clock.epoch) this.emit(data);
        if (data.type === 'ack' && data.epoch === this.clock.epoch) this.inFlight = false;
        this.pump();
      };
      this.worker.onerror = event => this.fail(event.message || '模型文件加载失败，请安装本地识别资源');
      this.timer = setTimeout(() => this.fail('模型加载超时，请检查本地识别资源'), 90000);
      this.worker.postMessage({ type: 'init' });
      await this.context.audioWorklet.addModule('pcm-worklet.js');
      if (this.closed) return;
      this.node = new AudioWorkletNode(this.context, 'icourse-pcm');
      this.silent = this.context.createGain(); this.silent.gain.value = 0;
      this.source.connect(this.node).connect(this.silent).connect(this.context.destination);
      this.node.port.onmessage = ({ data }) => {
        if (this.closed || !this.ready || this.clock.paused || this.clock.rate !== 1) return;
        if (this.pending.length >= 5) { this.fail('本地识别跟不上播放，已停止识别；视频继续播放'); return; }
        const end = this.clock.time + (performance.now() - this.stamp) / 1000;
        this.pending.push({ ...data, type: 'samples', epoch: this.clock.epoch, time: Math.max(0, end - data.samples.length / data.sampleRate) });
        this.pump();
      };
    }
    setClock(clock) {
      if (!Number.isFinite(clock.time) || !Number.isInteger(clock.epoch)) return;
      if (clock.epoch !== this.clock.epoch) {
        this.pending = []; this.inFlight = false;
        this.worker?.postMessage({ type: 'reset', epoch: clock.epoch });
      }
      this.clock = clock; this.stamp = performance.now();
    }
    pump() {
      if (!this.ready || this.inFlight || this.closed || !this.pending.length) return;
      const data = this.pending.shift(); this.inFlight = true;
      this.worker.postMessage(data, [data.samples.buffer]);
    }
    fail(error) { this.close(); this.emit({ type: 'error', error }); }
    close() {
      if (this.closed) return;
      this.closed = true; clearTimeout(this.timer); this.worker?.terminate();
      if (this.node) { this.node.port.onmessage = null; this.source.disconnect(this.node); this.node.disconnect(); }
      this.silent?.disconnect(); this.pending = [];
    }
  }
  root.ICourseASR = { ASRSession };
})(globalThis);
