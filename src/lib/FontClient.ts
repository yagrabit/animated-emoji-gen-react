import { load, type Font } from "opentype.js";

export type FontFamily = "sans" | "serif";
export type FontWeight = "bold" | "medium" | "light";
export type Fonts = {
  serif: { light: Font | null; medium: Font | null; bold: Font | null };
  sans: { light: Font | null; medium: Font | null; bold: Font | null };
};

// opentype.jsのloadをPromiseでラップ
const loadFont = (url: string): Promise<Font | null> => {
  return new Promise((resolve, reject) => {
    load(url, (err, font) => {
      if (err) {
        reject(err);
      } else {
        resolve(font ?? null);
      }
    });
  });
};

// Viteのベースパスを取得（末尾スラッシュ付き、例: "/animated-emoji-gen-react/"）
const BASE_URL = import.meta.env.BASE_URL;

// ロケール・ファミリー・ウェイトからフォントファイル名を決定するマッピング
const fontFileMap: Record<string, Record<FontFamily, Record<FontWeight, string>>> = {
  ja: {
    serif: {
      bold: "NotoSerifJP-Black.otf",
      medium: "NotoSerifJP-Medium.otf",
      light: "NotoSerifJP-Light.otf",
    },
    sans: {
      bold: "NotoSansJP-Black.otf",
      medium: "NotoSansJP-Medium.otf",
      light: "NotoSansJP-Light.otf",
    },
  },
  en: {
    serif: {
      bold: "NotoSerif-Bold.ttf",
      medium: "NotoSerif-Regular.ttf",
      light: "NotoSerif-Italic.ttf",
    },
    sans: {
      bold: "NotoSans-Bold.ttf",
      medium: "NotoSans-Regular.ttf",
      light: "NotoSans-Italic.ttf",
    },
  },
};

// ベースパスとフォントファイル名からフルパスを生成
const getFontPath = (fileName: string): string => `${BASE_URL}fonts/${fileName}`;

export class FontClient {
  private locale: string;

  constructor(locale: string) {
    this.locale = locale;
  }

  async loadFont(family: FontFamily, weight: FontWeight): Promise<Font | null> {
    const localeFiles = fontFileMap[this.locale];
    if (!localeFiles) {
      return null;
    }
    const fileName = localeFiles[family]?.[weight];
    if (!fileName) {
      return null;
    }
    return loadFont(getFontPath(fileName));
  }

  async loadAllFonts(): Promise<Fonts> {
    const [serifLight, serifMedium, serifBold, sansLight, sansMedium, sansBold] =
      await Promise.all([
        this.loadFont("serif", "light"),
        this.loadFont("serif", "medium"),
        this.loadFont("serif", "bold"),
        this.loadFont("sans", "light"),
        this.loadFont("sans", "medium"),
        this.loadFont("sans", "bold"),
      ]);

    return {
      serif: {
        light: serifLight,
        medium: serifMedium,
        bold: serifBold,
      },
      sans: {
        light: sansLight,
        medium: sansMedium,
        bold: sansBold,
      },
    };
  }
}
