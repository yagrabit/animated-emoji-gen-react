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

// ロケール・ファミリー・ウェイトからフォントパスを決定するマッピング
const fontPathMap: Record<string, Record<FontFamily, Record<FontWeight, string>>> = {
  ja: {
    serif: {
      bold: "/fonts/NotoSerifJP-Black.otf",
      medium: "/fonts/NotoSerifJP-Medium.otf",
      light: "/fonts/NotoSerifJP-Light.otf",
    },
    sans: {
      bold: "/fonts/NotoSansJP-Black.otf",
      medium: "/fonts/NotoSansJP-Medium.otf",
      light: "/fonts/NotoSansJP-Light.otf",
    },
  },
  en: {
    serif: {
      bold: "/fonts/NotoSerif-Bold.ttf",
      medium: "/fonts/NotoSerif-Regular.ttf",
      light: "/fonts/NotoSerif-Italic.ttf",
    },
    sans: {
      bold: "/fonts/NotoSans-Bold.ttf",
      medium: "/fonts/NotoSans-Regular.ttf",
      light: "/fonts/NotoSans-Italic.ttf",
    },
  },
};

export class FontClient {
  private locale: string;

  constructor(locale: string) {
    this.locale = locale;
  }

  async loadFont(family: FontFamily, weight: FontWeight): Promise<Font | null> {
    const localePaths = fontPathMap[this.locale];
    if (!localePaths) {
      return null;
    }
    const path = localePaths[family]?.[weight];
    if (!path) {
      return null;
    }
    return loadFont(path);
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
