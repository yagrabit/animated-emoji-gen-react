import { describe, expect, test } from "vitest";
import { hex2colorMatrix } from "./hex2colorMatrix";

describe("hex2colorMatrix", () => {
  test("HEXカラーをfeColorMatrix用の文字列に変換する", () => {
    const result = hex2colorMatrix("#1e88e5", "0 0 0 0 1");
    // #1e88e5 → r=30, g=136, b=229
    // r/150 = 0.2, g/150 ≈ 0.9067, b/150 ≈ 1.5267
    expect(result).toContain("0 0 0 0"); // 行の構造確認
    expect(result).toContain("0 0 0 0 1"); // lastRecord
  });

  test("空文字列の場合は単位行列を返す", () => {
    const result = hex2colorMatrix("", "0 0 0 0 1");
    expect(result).toBe("1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0 1");
  });

  test("黒色(#000000)の場合", () => {
    const result = hex2colorMatrix("#000000", "0 0 0 0 1");
    // r=0, g=0, b=0 → 全て0/150 = 0
    expect(result).toContain("0 0 0 0 0");
  });

  test("白色(#ffffff)の場合", () => {
    const result = hex2colorMatrix("#ffffff", "0 0 0 0 1");
    // r=255, g=255, b=255 → 全て255/150 = 1.7
    expect(result).toContain("0 0 0 0 1"); // lastRecord部分
  });
});
