const ESC = 0x1b;
const GS = 0x1d;
const LF = 0x0a;

const encoder = new TextEncoder();

export class EscPosBuilder {
  private readonly bytes: number[] = [];

  init(): this {
    this.bytes.push(ESC, 0x40);
    return this;
  }

  align(mode: 'left' | 'center' | 'right'): this {
    const n = mode === 'left' ? 0 : mode === 'center' ? 1 : 2;
    this.bytes.push(ESC, 0x61, n);
    return this;
  }

  bold(enable: boolean): this {
    this.bytes.push(ESC, 0x45, enable ? 1 : 0);
    return this;
  }

  // width/height valid range 1..8 for ESC/POS text size multiplier.
  size(width: number, height: number): this {
    const w = Math.min(8, Math.max(1, width));
    const h = Math.min(8, Math.max(1, height));
    const n = ((w - 1) << 4) | (h - 1);
    this.bytes.push(GS, 0x21, n);
    return this;
  }

  text(value: string): this {
    const normalized = value.replace(/[^\x00-\x7F]/g, '');
    const encoded = encoder.encode(normalized);
    this.bytes.push(...encoded);
    return this;
  }

  line(value = ''): this {
    if (value.length > 0) {
      this.text(value);
    }
    this.bytes.push(LF);
    return this;
  }

  hr(width = 42): this {
    return this.line('-'.repeat(width));
  }

  feed(lines = 1): this {
    for (let index = 0; index < lines; index += 1) {
      this.bytes.push(LF);
    }
    return this;
  }

  cut(): this {
    this.bytes.push(GS, 0x56, 0x00);
    return this;
  }

  build(): Uint8Array {
    return Uint8Array.from(this.bytes);
  }
}
