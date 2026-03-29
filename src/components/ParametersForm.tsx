import { COLORS } from "../lib/constants";
import { ColorPanel } from "./ColorPanel";
import { SelectButtons } from "./SelectButtons";
import styles from "./ParametersForm.module.css";

type ParametersFormProps = {
  text: string;
  onTextChange: (text: string) => void;
  color: string;
  onColorChange: (color: string) => void;
  fontFamily: "sans" | "serif";
  onFontFamilyChange: (family: "sans" | "serif") => void;
  fontWeight: "bold" | "medium" | "light";
  onFontWeightChange: (weight: "bold" | "medium" | "light") => void;
  backgroundColor: string;
  onBackgroundColorChange: (color: string) => void;
};

const fontFamilyOptions = [
  { label: "明朝体", value: "serif" as const },
  { label: "ゴシック体", value: "sans" as const },
];

const fontWeightOptions = [
  { label: "太字", value: "bold" as const },
  { label: "中字", value: "medium" as const },
  { label: "細字", value: "light" as const },
];

const backgroundOptions = [
  { label: "透明", value: "transparent" as const },
  { label: "白", value: "#ffffff" as const },
  { label: "黒", value: "#000000" as const },
];

export function ParametersForm({
  text,
  onTextChange,
  color,
  onColorChange,
  fontFamily,
  onFontFamilyChange,
  fontWeight,
  onFontWeightChange,
  backgroundColor,
  onBackgroundColorChange,
}: ParametersFormProps) {
  return (
    <article className={styles.panel}>
      <h1 className={styles.heading}>
        <span className={styles.headingEmoji}>
          <span style={{ color: "#1da1f2" }}>E</span>
          <span style={{ color: "#2eb67d" }}>m</span>
          <span style={{ color: "#e01e5a" }}>o</span>
          <span style={{ color: "#ecb22e" }}>ji</span>
        </span>{" "}
        generator
      </h1>

      <div className={styles.block}>
        <label className={styles.label} htmlFor="emoji-text">
          テキスト
        </label>
        <textarea
          id="emoji-text"
          className={styles.textarea}
          rows={2}
          placeholder="your emoji"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
        />
      </div>

      <div className={styles.block}>
        <span className={styles.label}>色</span>
        <ColorPanel color={color} onChange={onColorChange} colors={COLORS} />
      </div>

      <div className={styles.block}>
        <span className={styles.label}>フォント</span>
        <SelectButtons
          value={fontFamily}
          onChange={onFontFamilyChange}
          options={fontFamilyOptions}
        />
      </div>

      <div className={styles.block}>
        <span className={styles.label}>太さ</span>
        <SelectButtons
          value={fontWeight}
          onChange={onFontWeightChange}
          options={fontWeightOptions}
        />
      </div>

      <div className={styles.block}>
        <span className={styles.label}>背景</span>
        <SelectButtons
          value={backgroundColor}
          onChange={onBackgroundColorChange}
          options={backgroundOptions}
        />
      </div>
    </article>
  );
}
