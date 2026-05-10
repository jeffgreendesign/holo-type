declare module 'gifenc' {
  export class GIFEncoder {
    constructor(options?: { auto? : boolean });
    writeFrame(index: Uint8Array | number[] | Uint8ClampedArray, width: number, height: number, options?: { palette: number[][], delay?: number, transparent?: boolean, transparentIndex?: number, repeat?: number }): void;
    finish(): void;
    bytes(): Uint8Array;
    reset(): void;
  }
  export function quantize(data: Uint8Array | number[] | Uint8ClampedArray, colors: number, options?: { format?: string }): number[][];
  export function applyPalette(data: Uint8Array | number[] | Uint8ClampedArray, palette: number[][], format?: string): Uint8Array;
}
