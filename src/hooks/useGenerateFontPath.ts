import { useState, useMemo, useCallback } from "react";
import type { Font } from "opentype.js";
import { FontClient, type Fonts } from "../lib/FontClient";

type FontType = {
  family: keyof Fonts;
  weight: keyof Fonts["sans"];
};

type UseGenerateFontPathReturn = {
  text: string;
  setText: (text: string) => void;
  fontType: FontType;
  setFontType: (fontType: FontType) => void;
  paths: string[];
  transforms: string[];
  loading: boolean;
  loadFonts: (locale: string) => Promise<void>;
};

const initialFonts: Fonts = {
  serif: { bold: null, light: null, medium: null },
  sans: { bold: null, light: null, medium: null },
};

export function useGenerateFontPath(
  initialText: string,
  viewSize: number = 128
): UseGenerateFontPathReturn {
  const [text, setText] = useState(initialText);
  const [fonts, setFonts] = useState<Fonts>(initialFonts);
  const [fontType, setFontType] = useState<FontType>({
    family: "sans",
    weight: "bold",
  });
  const [loading, setLoading] = useState(true);

  // 現在のフォント
  const font = useMemo<Font | null>(
    () => fonts[fontType.family][fontType.weight],
    [fonts, fontType]
  );

  // テキストを行に分割
  const rows = useMemo(() => text.trim().split("\n"), [text]);

  // 各行のテキストサイズを計算
  const textSize = useMemo(() => {
    return rows.map((t) => {
      if (!font) {
        return { height: 0, width: 0 };
      }
      const { x1, y1, x2, y2 } = font
        .getPath(t, 0, 0, viewSize)
        .getBoundingBox();
      return {
        width: x2 - x1 + 20.8,
        height: y2 - y1 + 20.8,
      };
    });
  }, [font, rows, viewSize]);

  // SVGパスデータを生成
  const paths = useMemo(() => {
    if (!font) {
      return [""];
    }
    return rows.map((t, i) => {
      const height =
        i === 0 ? textSize[i].height - 12 : textSize[i].height - 4;
      const baseLine = height * (i + 1);
      return font.getPath(t, 5, baseLine, viewSize).toPathData(2);
    });
  }, [font, rows, textSize, viewSize]);

  // スケール変換を生成
  const transforms = useMemo(() => {
    if (!font || !text.length) {
      return ["scale(1,1)"];
    }
    return rows.map((_t, i) => {
      const xScale = viewSize / (textSize[i].width + 8);
      const yScale = viewSize / textSize[i].height / rows.length;
      return `scale(${xScale}, ${yScale})`;
    });
  }, [font, text, rows, textSize, viewSize]);

  // フォントロード関数
  const loadFonts = useCallback(async (locale: string) => {
    const fontClient = new FontClient(locale);
    // 初期フォント（sans/bold）を先にロードしてUIを早く表示
    setLoading(true);
    const initialFont = await fontClient.loadFont("sans", "bold");
    setFonts((prev) => ({
      ...prev,
      sans: { ...prev.sans, bold: initialFont },
    }));
    setLoading(false);

    // 残りのフォントを並列ロード
    const result = await fontClient.loadAllFonts();
    setFonts({
      serif: {
        light: result.serif.light,
        medium: result.serif.medium,
        bold: result.serif.bold,
      },
      sans: {
        light: result.sans.light,
        medium: result.sans.medium,
        bold: result.sans.bold,
      },
    });
  }, []);

  return {
    text,
    setText,
    fontType,
    setFontType,
    paths,
    transforms,
    loading,
    loadFonts,
  };
}
