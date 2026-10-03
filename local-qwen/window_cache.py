#!/usr/bin/env python3
"""Local recording-window cache pilot. Timings are window bounds, not word alignment."""
from array import array
import hashlib
import json
import math
import os
from pathlib import Path
import sys
import tempfile
import time
import wave

VERSION = 3


def is_digital_silence(pcm):
    """Skip only zero/one-LSB PCM. Room noise requires a proper speech VAD."""
    samples = array('h', pcm)
    if sys.byteorder != 'little': samples.byteswap()
    return all(abs(sample) <= 1 for sample in samples)


def digest_file(path):
    digest = hashlib.sha256()
    with Path(path).open('rb') as f:
        for block in iter(lambda: f.read(4 * 1024 * 1024), b''):
            digest.update(block)
    return digest.hexdigest()


class WindowCache:
    def __init__(self, audio, cache, infer, model_id, *, context='', offset=0, window=20, overlap=2, limit=1800):
        if not math.isfinite(offset) or offset < 0 or window != 20 or overlap != 2 or limit < 1:
            raise ValueError('Invalid window configuration')
        if not isinstance(context, str) or len(context) > 800:
            raise ValueError('Course terms must be a string of at most 800 characters')
        self.audio = Path(audio).resolve()
        self.cache = Path(cache); self.cache.mkdir(parents=True, exist_ok=True, mode=0o700)
        self.infer, self.model_id, self.context = infer, model_id, context
        self.offset, self.window, self.overlap, self.limit = float(offset), window, overlap, limit
        with wave.open(str(self.audio), 'rb') as f:
            if (f.getframerate(), f.getnchannels(), f.getsampwidth()) != (16000, 1, 2):
                raise ValueError('Input must be mono 16kHz PCM16 WAV')
            self.frames = f.getnframes()
        self.duration = self.frames / 16000
        self.audio_id = digest_file(self.audio)

    def plan(self, position, horizon=100):
        if not math.isfinite(position) or not self.offset <= position < self.offset + self.duration:
            raise ValueError('Position is outside the imported recording')
        if not math.isfinite(horizon) or not 0 <= horizon <= 100:
            raise ValueError('Prefetch horizon must be 0-100 media seconds')
        # Current position first; no work outside this imported clip.
        start = self.offset + math.floor((position - self.offset) / self.window) * self.window
        end = min(self.offset + self.duration, position + horizon)
        result = [start]
        while result[-1] + self.window < end:
            result.append(result[-1] + self.window)
        return result

    def get(self, start):
        if not math.isfinite(start) or not self.offset <= start < self.offset + self.duration:
            raise ValueError('Window starts outside the imported recording')
        # Canonical numbers keep 600 and 600.0 in the same cache namespace.
        start = float(start)
        end = min(start + self.window, float(self.offset + self.duration))
        audio_start = max(self.offset, start - self.overlap)
        audio_end = min(self.offset + self.duration, end + self.overlap)
        identity = [VERSION, self.audio_id, self.model_id, self.context, start, end, audio_start, audio_end]
        key = hashlib.sha256(json.dumps(identity, ensure_ascii=False).encode()).hexdigest()
        destination = self.cache / (key + '.json')
        began = time.perf_counter()
        if destination.exists():
            result = json.loads(destination.read_text()); os.utime(destination, None)
            return {**result, 'cached': True, 'seconds': time.perf_counter() - began}
        with wave.open(str(self.audio), 'rb') as f:
            f.setpos(round((audio_start - self.offset) * 16000))
            frames = round((audio_end - audio_start) * 16000)
            pcm = f.readframes(frames)
        if len(pcm) != frames * 2:
            raise ValueError('Recording does not fully cover the window')
        decoded = {'text': '', 'truncated': False} if is_digital_silence(pcm) else self.infer(pcm, self.context)
        if decoded.get('truncated'):
            raise RuntimeError('Model output was truncated; incomplete text is not cached')
        result = {'start': start, 'end': end, 'audio_start': audio_start, 'audio_end': audio_end,
                  'text': decoded['text'], 'words': decoded.get('segments', []), 'timing': 'word-aligned' if 'segments' in decoded else 'window-only', 'cached': False,
                  'seconds': time.perf_counter() - began}
        fd, temporary = tempfile.mkstemp(dir=self.cache, suffix='.tmp')
        try:
            with os.fdopen(fd, 'w') as f:
                json.dump(result, f, ensure_ascii=False)
            os.replace(temporary, destination)
        finally:
            if Path(temporary).exists(): Path(temporary).unlink()
        entries = sorted(self.cache.glob('*.json'), key=lambda p: p.stat().st_mtime)
        for old in entries[:-self.limit]: old.unlink()
        return result
