import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import { Svg2Gif } from "./svg2gif";

// modern-gifのencodeをモック
vi.mock("modern-gif", () => ({
  encode: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
}));

describe("Svg2Gif", () => {
  let svgElement: SVGSVGElement;

  beforeEach(() => {
    svgElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    svgElement.setAttribute("width", "128");
    svgElement.setAttribute("height", "128");
    document.body.appendChild(svgElement);
  });

  afterEach(() => {
    document.querySelectorAll(".tmp-img").forEach((el) => el.remove());
    svgElement.remove();
  });

  test("デフォルトサイズ500x500でインスタンス化できる", () => {
    const gif = new Svg2Gif(svgElement);
    expect(gif).toBeDefined();
    expect(gif).toBeInstanceOf(Svg2Gif);
  });

  test("カスタムサイズでインスタンス化できる", () => {
    const gif = new Svg2Gif(svgElement, 128, 128);
    expect(gif).toBeDefined();
  });

  test("add()でSVGをシリアライズしtmp-img要素をbodyに追加する", async () => {
    const gif = new Svg2Gif(svgElement, 128, 128);

    // jsdom環境ではImage.onloadが自動発火しないため、srcセッターをモック
    const originalDescriptor = Object.getOwnPropertyDescriptor(
      HTMLImageElement.prototype,
      "src",
    );
    Object.defineProperty(HTMLImageElement.prototype, "src", {
      set(this: HTMLImageElement, value: string) {
        originalDescriptor?.set?.call(this, value);
        setTimeout(() => {
          if (this.onload) {
            this.onload(new Event("load"));
          }
        }, 0);
      },
      get(this: HTMLImageElement) {
        return originalDescriptor?.get?.call(this) ?? "";
      },
      configurable: true,
    });

    await gif.add();

    const tmpImgs = document.querySelectorAll(".tmp-img");
    expect(tmpImgs.length).toBe(1);

    // 元に戻す
    if (originalDescriptor) {
      Object.defineProperty(
        HTMLImageElement.prototype,
        "src",
        originalDescriptor,
      );
    }
  });

  test("render()でmodern-gifのencodeを呼び出しBlobを返す", async () => {
    const { encode } = await import("modern-gif");
    const gif = new Svg2Gif(svgElement, 128, 128);

    const blob = await gif.render();

    expect(encode).toHaveBeenCalledWith(
      expect.objectContaining({
        width: 128,
        height: 128,
      }),
    );
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe("image/gif");
  });

  test("render()にprogressコールバックを渡してもエラーにならない", async () => {
    const gif = new Svg2Gif(svgElement, 128, 128);
    const onProgress = vi.fn();

    const blob = await gif.render(onProgress);

    expect(blob).toBeInstanceOf(Blob);
  });
});
