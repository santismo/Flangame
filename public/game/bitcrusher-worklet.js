class FlangBitcrusher extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: "mix", defaultValue: 1, minValue: 0, maxValue: 1 },
      { name: "bits", defaultValue: 7, minValue: 2, maxValue: 16 },
      { name: "reduction", defaultValue: 4, minValue: 1, maxValue: 32 },
    ];
  }

  constructor() {
    super();
    this.phase = 0;
    this.held = [];
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    if (!input?.length) return true;
    const mix = parameters.mix;
    const bits = parameters.bits;
    const reduction = parameters.reduction;

    for (let channel = 0; channel < output.length; channel += 1) {
      const source = input[Math.min(channel, input.length - 1)];
      const target = output[channel];
      if (!source) continue;
      let held = this.held[channel] || 0;
      for (let index = 0; index < target.length; index += 1) {
        const rate = Math.max(1, Math.round(reduction.length > 1 ? reduction[index] : reduction[0]));
        if (this.phase % rate === 0) {
          const bitCount = bits.length > 1 ? bits[index] : bits[0];
          const steps = 2 ** (Math.max(2, bitCount) - 1);
          held = Math.round(source[index] * steps) / steps;
        }
        const wet = mix.length > 1 ? mix[index] : mix[0];
        target[index] = source[index] * (1 - wet) + held * wet;
        this.phase += 1;
      }
      this.held[channel] = held;
    }
    return true;
  }
}

registerProcessor("flang-bitcrusher", FlangBitcrusher);
