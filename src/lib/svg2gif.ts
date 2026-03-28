// SVGアニメーションをGIFに変換するクラス
// Vue版(gif.js)からの移植。modern-gif APIを使用。
// 参考: https://github.com/yuneco/fulful/blob/master/src/core/Svg2Gif.ts

import { encode } from "modern-gif";

/** Canvas経由でHTMLImageElementからImageDataを取得する */
function getImageData(
  img: HTMLImageElement,
  width: number,
  height: number,
): ImageData {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2Dコンテキストの取得に失敗しました");
  }
  ctx.drawImage(img, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height);
}

/**
 * SVG要素を複数フレームとしてキャプチャし、GIF画像に変換するクラス
 *
 * 使い方:
 * 1. new Svg2Gif(svgElement, width, height) でインスタンス化
 * 2. add() を繰り返し呼んでフレームをキャプチャ
 * 3. render() でGIF Blobを取得
 */
export class Svg2Gif {
  private readonly element: Element;
  private readonly width: number;
  private readonly height: number;
  private readonly frameImages: HTMLImageElement[] = [];

  constructor(element: Element, width = 500, height = 500) {
    this.element = element;
    this.width = width;
    this.height = height;
  }

  /**
   * SVG要素の現在の状態を1フレームとしてキャプチャする
   * Chromeハック: img要素をdocument.bodyにappendする必要がある
   */
  async add(): Promise<void> {
    return new Promise((resolve, reject) => {
      const data = new XMLSerializer().serializeToString(this.element);
      const img = new Image();
      const base64 = btoa(unescape(encodeURIComponent(data)));
      img.src = `data:image/svg+xml;base64,${base64}`;

      // Chromeハック: bodyにappendしないとImageの描画が正しく動作しない
      // position absoluteで画面外に配置し、後でクリーンアップする
      img.style.position = "absolute";
      img.style.top = "-1000px";
      img.classList.add("tmp-img");
      document.body.appendChild(img);

      img.onload = () => {
        this.frameImages.push(img);
        resolve();
      };
      img.onerror = () => {
        reject(new Error("フレームの描画中にエラーが発生しました"));
      };
    });
  }

  /**
   * キャプチャ済みフレームをGIFにエンコードして返す
   * @param onProgress エンコード進捗コールバック(0-1)
   */
  async render(onProgress?: (progress: number) => void): Promise<Blob> {
    const frames = this.frameImages.map((img) => ({
      imageData: getImageData(img, this.width, this.height),
      delay: 100,
    }));

    const output = await encode({
      width: this.width,
      height: this.height,
      frames: frames.map((f) => ({
        data: f.imageData.data,
        delay: f.delay,
      })),
    });

    // progressコールバックがあれば完了を通知
    // (modern-gifのencodeは同期的にArrayBufferを返すためリアルタイム進捗は得られないが、
    //  インターフェースの互換性のために100%完了として呼び出す)
    if (onProgress) {
      onProgress(1);
    }

    return new Blob([output], { type: "image/gif" });
  }
}
