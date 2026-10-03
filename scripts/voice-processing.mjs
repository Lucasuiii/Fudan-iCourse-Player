// Linked stereo controls. Frames are 10 ms at 48 kHz.
export function settings(value = {}) {
  value = value || {};
  return { strength: value.strength === 'light' ? 'light' : 'standard',
    level: value.level !== false, tone: value.tone === 'clear' ? 'clear' : 'natural', tail: value.tail === true };
}
export class FrameEnhancer {
  constructor() { this.config = settings(); this.mix = 1; this.gain = 1; this.tailGain = 1; this.quiet = 0; this.hadSpeech = false; }
  configure(value) { this.config = settings(value); }
  process(wet, raw, probability) {
    let power = 0;
    for (const channel of wet) for (const x of channel) power += x * x;
    const rms = Math.sqrt(power / (wet.length * wet[0].length));
    const speech = probability >= .6 && rms > .008;
    if (speech) { this.quiet = 0; this.hadSpeech = true; }
    else this.quiet++;
    let targetGain = 1;
    if (this.config.level) {
      // Never learn gain from pauses/noise, and never boost below the speech floor.
      targetGain = speech ? Math.max(.5, Math.min(2, .08 / rms)) : Math.min(1, this.gain);
    }
    const targetMix = this.config.strength === 'light' ? .8 : 1;
    // Conservative residual-tail attenuation, not full room dereverberation.
    const targetTail = this.config.tail && this.hadSpeech && this.quiet > 12 && probability < .2 ? .6 : 1;
    const frames = wet[0].length;
    const gainStep = 1 - Math.exp(-1 / (48000 * (targetGain < this.gain ? .2 : 1.5)));
    const mixStep = 1 - Math.exp(-1 / (48000 * .04));
    const tailStep = 1 - Math.exp(-1 / (48000 * (targetTail < this.tailGain ? .1 : .01)));
    for (let i = 0; i < frames; i++) {
      this.gain += (targetGain - this.gain) * gainStep;
      this.mix += (targetMix - this.mix) * mixStep;
      this.tailGain += (targetTail - this.tailGain) * tailStep;
      for (let c = 0; c < wet.length; c++) {
        wet[c][i] = (wet[c][i] * this.mix + raw[c][i] * (1 - this.mix)) * this.gain * this.tailGain;
      }
    }
  }
}
