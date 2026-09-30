/* Recording scheduler: prioritize the playhead, cache complete chunks, ignore stale jobs. */
(function (root) {
  'use strict';
  class Prefetch {
    constructor(request, emit) { this.request = request; this.emit = emit; this.chunks = new Map(); this.generation = 0; this.running = false; }
    start(source, duration) { this.stop(); this.source = source; this.duration = duration; this.chunks.clear(); this.active = true; }
    stop() { this.active = false; this.generation++; this.source = null; }
    focus(time) { this.time = Math.max(0, time); }
    ready(time) { return this.chunks.has(Math.floor(time / 20) * 20); }
    ahead(time) {
      let end = Math.floor(time / 20) * 20;
      while (this.chunks.has(end)) { end = this.chunks.get(end).end; if (end >= this.duration || end % 20) break; }
      return Math.max(0, end - time);
    }
    cues() { return [...this.chunks.values()].flatMap(c => c.cues).sort((a, b) => a.start - b.start); }
    async pump() {
      if (!this.active || this.running) return;
      const gen = this.generation, source = this.source;
      const first = Math.floor(this.time / 20) * 20;
      let start = first;
      while (this.chunks.has(start) && start < this.duration && start < first + 100) start += 20;
      if (start >= this.duration || start >= first + 100) return;
      this.running = true;
      this.emit({ type: 'loading', start });
      try {
        const result = await this.request({ source, start, duration: this.duration });
        if (!this.active || gen !== this.generation) return;
        if (result.start !== start || !(result.end > start) || !Array.isArray(result.cues)) throw Error('本地服务返回了无效的字幕分段');
        this.chunks.set(start, result);
        // Bound in-page history; disk cache can restore old chunks when seeking back.
        if (this.chunks.size > 180) {
          const farthest = [...this.chunks.keys()].sort((a, b) => Math.abs(b - this.time) - Math.abs(a - this.time))[0];
          this.chunks.delete(farthest);
        }
        this.emit({ type: 'chunk', result });
      } catch (error) { if (this.active && gen === this.generation) { this.active = false; this.emit({ type: 'error', error: error.message }); } }
      finally { this.running = false; }
    }
  }
  root.ICourseWhisper = { Prefetch };
})(globalThis);
