import hexRgb from "hex-rgb";

/**
 * HEXカラーコードをSVGフィルターの<feColorMatrix>用の行列文字列に変換する
 * RGB値を150で割ってカラーマトリックスの係数を生成する
 */
export function hex2colorMatrix(hex: string, lastRecord: string): string {
  if (!hex) {
    return "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0 1";
  }

  const { red, green, blue } = hexRgb(hex);
  const r = red / 150;
  const g = green / 150;
  const b = blue / 150;

  return `${r} 0 0 0 0 0 ${g} 0 0 0 0 0 ${b} 0 0 ${lastRecord}`;
}
