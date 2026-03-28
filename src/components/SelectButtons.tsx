import styles from "./SelectButtons.module.css";

type SelectButtonsProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: { label: string; value: T }[];
};

export function SelectButtons<T extends string>({
  value,
  onChange,
  options,
}: SelectButtonsProps<T>) {
  return (
    <div className={styles.grid}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`${styles.button} ${option.value === value ? styles.active : ""}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
