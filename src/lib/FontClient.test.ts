import { describe, expect, test, vi } from "vitest";
import { FontClient } from "./FontClient";

// opentype.jsのloadをモック
vi.mock("opentype.js", () => ({
  load: vi.fn((_url: string, callback: (err: Error | null, font?: unknown) => void) => {
    // コールバック形式のモック: 成功時にダミーフォントを返す
    const dummyFont = { getPath: vi.fn() };
    callback(null, dummyFont);
  }),
}));

describe("FontClient", () => {
  test("ja ロケールでインスタンス化できる", () => {
    const client = new FontClient("ja");
    expect(client).toBeInstanceOf(FontClient);
  });

  test("en ロケールでインスタンス化できる", () => {
    const client = new FontClient("en");
    expect(client).toBeInstanceOf(FontClient);
  });

  test("loadFont: ja/sans/bold で正しいパスのフォントをロードする", async () => {
    const { load } = await import("opentype.js");
    const client = new FontClient("ja");
    await client.loadFont("sans", "bold");
    expect(load).toHaveBeenCalledWith(
      "/fonts/NotoSansJP-Black.otf",
      expect.any(Function)
    );
  });

  test("loadFont: ja/serif/light で正しいパスのフォントをロードする", async () => {
    const { load } = await import("opentype.js");
    const client = new FontClient("ja");
    await client.loadFont("serif", "light");
    expect(load).toHaveBeenCalledWith(
      "/fonts/NotoSerifJP-Light.otf",
      expect.any(Function)
    );
  });

  test("loadFont: en/sans/medium で正しいパスのフォントをロードする", async () => {
    const { load } = await import("opentype.js");
    const client = new FontClient("en");
    await client.loadFont("sans", "medium");
    expect(load).toHaveBeenCalledWith(
      "/fonts/NotoSans-Regular.ttf",
      expect.any(Function)
    );
  });

  test("loadFont: en/serif/bold で正しいパスのフォントをロードする", async () => {
    const { load } = await import("opentype.js");
    const client = new FontClient("en");
    await client.loadFont("serif", "bold");
    expect(load).toHaveBeenCalledWith(
      "/fonts/NotoSerif-Bold.ttf",
      expect.any(Function)
    );
  });

  test("loadFont: 未対応ロケールではnullを返す", async () => {
    const client = new FontClient("ko");
    const result = await client.loadFont("sans", "bold");
    expect(result).toBeNull();
  });

  test("loadAllFonts: 6種全フォントを並列ロードする", async () => {
    const client = new FontClient("ja");
    const fonts = await client.loadAllFonts();
    expect(fonts).toHaveProperty("serif.light");
    expect(fonts).toHaveProperty("serif.medium");
    expect(fonts).toHaveProperty("serif.bold");
    expect(fonts).toHaveProperty("sans.light");
    expect(fonts).toHaveProperty("sans.medium");
    expect(fonts).toHaveProperty("sans.bold");
  });
});
