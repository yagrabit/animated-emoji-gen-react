import { describe, expect, test, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useGenerateFontPath } from "./useGenerateFontPath";

// opentype.jsのloadをモック
vi.mock("opentype.js", () => ({
  load: vi.fn((_url: string, callback: (err: Error | null, font?: unknown) => void) => {
    const dummyFont = {
      getPath: vi.fn((_text: string, _x: number, _y: number, _size: number) => ({
        toPathData: vi.fn(() => "M0 0L10 10"),
        getBoundingBox: vi.fn(() => ({ x1: 0, y1: -50, x2: 100, y2: 10 })),
      })),
    };
    callback(null, dummyFont);
  }),
}));

describe("useGenerateFontPath", () => {
  test("初期テキストが正しく設定される", () => {
    const { result } = renderHook(() => useGenerateFontPath("テスト"));
    expect(result.current.text).toBe("テスト");
  });

  test("setTextでテキストを変更できる", () => {
    const { result } = renderHook(() => useGenerateFontPath("初期値"));
    act(() => {
      result.current.setText("新しいテキスト");
    });
    expect(result.current.text).toBe("新しいテキスト");
  });

  test("初期fontTypeはsans/boldである", () => {
    const { result } = renderHook(() => useGenerateFontPath("テスト"));
    expect(result.current.fontType).toEqual({
      family: "sans",
      weight: "bold",
    });
  });

  test("setFontTypeでフォント種別を変更できる", () => {
    const { result } = renderHook(() => useGenerateFontPath("テスト"));
    act(() => {
      result.current.setFontType({ family: "serif", weight: "light" });
    });
    expect(result.current.fontType).toEqual({
      family: "serif",
      weight: "light",
    });
  });

  test("フォント未ロード時はpathsが空文字配列を返す", () => {
    const { result } = renderHook(() => useGenerateFontPath("テスト"));
    expect(result.current.paths).toEqual([""]);
  });

  test("フォント未ロード時のtransformsはscale(1,1)を返す", () => {
    const { result } = renderHook(() => useGenerateFontPath("テスト"));
    expect(result.current.transforms).toEqual(["scale(1,1)"]);
  });

  test("loadingの初期値はtrueである", () => {
    const { result } = renderHook(() => useGenerateFontPath("テスト"));
    expect(result.current.loading).toBe(true);
  });

  test("loadFonts後にloadingがfalseになる", async () => {
    const { result } = renderHook(() => useGenerateFontPath("テスト"));
    await act(async () => {
      await result.current.loadFonts("ja");
    });
    expect(result.current.loading).toBe(false);
  });

  test("loadFonts後にpathsが生成される", async () => {
    const { result } = renderHook(() => useGenerateFontPath("テスト"));
    await act(async () => {
      await result.current.loadFonts("ja");
    });
    expect(result.current.paths.length).toBeGreaterThan(0);
    expect(result.current.paths[0]).toBe("M0 0L10 10");
  });

  test("loadFonts後にtransformsが生成される", async () => {
    const { result } = renderHook(() => useGenerateFontPath("テスト"));
    await act(async () => {
      await result.current.loadFonts("ja");
    });
    expect(result.current.transforms.length).toBeGreaterThan(0);
    expect(result.current.transforms[0]).toContain("scale(");
  });
});
