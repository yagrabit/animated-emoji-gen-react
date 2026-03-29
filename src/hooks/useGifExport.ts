import { useState } from "react";
import { Svg2Gif } from "@/lib/svg2gif";
import { wait } from "@/lib/sleep";

type UseGifExportReturn = {
  /** GIFエクスポートを実行する */
  exportGif: (svgElement: SVGSVGElement, fileName: string) => Promise<void>;
  /** エクスポート中かどうか */
  exporting: boolean;
  /** エクスポート進捗（0-100） */
  progress: number;
};

/**
 * SVGアニメーションをGIFとしてエクスポートするフック
 *
 * - 10フレームを95msインターバルでキャプチャ（進捗0-50%）
 * - modern-gifでエンコード（進捗50-100%）
 * - 完了後に自動ダウンロード
 */
export function useGifExport(): UseGifExportReturn {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const exportGif = async (svgElement: SVGSVGElement, fileName: string) => {
    setExporting(true);
    setProgress(0);
    try {
      const gif = new Svg2Gif(svgElement, 128, 128);

      // 10フレームを95msインターバルでキャプチャ
      for (let i = 0; i < 10; i++) {
        await wait(95);
        await gif.add();
        setProgress(((i + 1) / 10) * 50); // キャプチャ進捗: 0-50%
      }

      const blob = await gif.render((p) => setProgress(50 + p * 50)); // エンコード進捗: 50-100%

      // ダウンロード
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);

      // クリーンアップ: Chromeハック用のtmp-img要素を除去
      document.querySelectorAll(".tmp-img").forEach((e) => e.remove());
    } finally {
      setExporting(false);
      setProgress(0);
    }
  };

  return { exportGif, exporting, progress };
}
