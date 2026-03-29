import { useState, useEffect } from "react";
import { useGenerateFontPath } from "@/hooks/useGenerateFontPath";
import { ParametersForm } from "@/components/ParametersForm";
import { FilterGallery } from "@/components/FilterGallery";
import { Loading } from "@/components/Loading";
import { COLORS } from "@/lib/constants";
import styles from "./MainPage.module.css";

export function MainPage() {
  const { text, setText, fontType, setFontType, paths, transforms, loading, loadFonts } =
    useGenerateFontPath("Emoji", 128);

  const [color, setColor] = useState(COLORS[0]);
  const [backgroundColor, setBackgroundColor] = useState("transparent");

  // 初回マウント時にフォントをロード
  useEffect(() => {
    loadFonts("ja");
  }, [loadFonts]);

  return (
    <div className={styles.container}>
      <Loading visible={loading} />
      <div className={styles.columns}>
        <div className={styles.left}>
          <ParametersForm
            text={text}
            onTextChange={setText}
            color={color}
            onColorChange={setColor}
            fontFamily={fontType.family}
            onFontFamilyChange={(f) => setFontType({ ...fontType, family: f })}
            fontWeight={fontType.weight}
            onFontWeightChange={(w) => setFontType({ ...fontType, weight: w })}
            backgroundColor={backgroundColor}
            onBackgroundColorChange={setBackgroundColor}
          />
        </div>
        <div className={styles.right}>
          <FilterGallery
            paths={paths}
            transforms={transforms}
            color={color}
            backgroundColor={backgroundColor}
            text={text}
          />
        </div>
      </div>
    </div>
  );
}
