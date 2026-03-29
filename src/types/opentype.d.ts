declare module "opentype.js" {
  export interface BoundingBox {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }

  export interface Path {
    toPathData(decimalPlaces?: number): string;
    getBoundingBox(): BoundingBox;
  }

  export interface Font {
    unitsPerEm: number;
    ascender: number;
    descender: number;
    charToGlyph(char: string): Glyph;
    stringToGlyphs(str: string): Glyph[];
    getPath(
      text: string,
      x: number,
      y: number,
      fontSize: number,
    ): Path;
  }

  export interface Glyph {
    advanceWidth: number;
    unicode: number;
  }

  export function load(
    url: string,
    callback: (err: Error | null, font?: Font) => void,
  ): void;
}
