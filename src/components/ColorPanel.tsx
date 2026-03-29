import styles from "./ColorPanel.module.css";

type ColorPanelProps = {
  color: string;
  onChange: (color: string) => void;
  colors: string[];
};

export function ColorPanel({ color, onChange, colors }: ColorPanelProps) {
  return (
    <>
      <div className={styles.grid}>
        {colors.map((c) => (
          <button
            key={c}
            type="button"
            className={`${styles.colorButton} ${c === color ? styles.selected : ""}`}
            style={{ backgroundColor: c }}
            onClick={() => onChange(c)}
            aria-label={c}
          />
        ))}
      </div>
      <label htmlFor="custom-color" className={styles.colorInputLabel}>
        カスタムカラー
      </label>
      <input
        id="custom-color"
        type="color"
        className={styles.colorInput}
        value={color}
        onChange={(e) => onChange(e.target.value)}
      />
    </>
  );
}
