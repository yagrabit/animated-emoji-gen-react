import type { FC } from "react";

/** 全フィルターコンポーネント共通のprops */
export type FilterProps = {
  /** SVG要素のID（GIF変換時の参照用） */
  id: string;
  /** 各パスのscale変換（例: "scale(0.5, 0.5)"） */
  transforms: string[];
  /** SVGパスデータ（d属性値） */
  paths: string[];
  /** 塗り色（fill + stroke） */
  color: string;
  /** SVGサイズ（デフォルト128） */
  viewBoxSize?: number;
  /** 背景色（デフォルト"transparent"） */
  backgroundColor?: string;
};

/** フィルターコンポーネントの型 */
export type FilterComponent = FC<FilterProps>;

/** フィルターエントリー（ギャラリー表示用） */
export type FilterEntry = {
  /** 表示名 */
  name: string;
  /** フィルターコンポーネント */
  component: FilterComponent;
};

/**
 * pathsとtransformsの配列長が一致することを検証する。
 * 不一致の場合はErrorをスローする。
 */
export function validateFilterProps(paths: string[], transforms: string[]) {
  if (paths.length !== transforms.length) {
    throw new Error(
      `paths and transforms must have the same length (paths: ${paths.length}, transforms: ${transforms.length})`,
    );
  }
}

/** "scale(x, y)" 形式の文字列にマッチする正規表現 */
const SCALE_PATTERN =
  /^scale\(\s*([+-]?(?:\d+\.?\d*|\.\d+))\s*,\s*([+-]?(?:\d+\.?\d*|\.\d+))\s*\)$/;

/**
 * "scale(x, y)" → "x y" 形式に変換する。
 * フォーマットが不正な場合はErrorをスローする。
 */
export function parseScaleTransform(transform: string): string {
  const m = transform.match(SCALE_PATTERN);
  if (!m) {
    throw new Error(`Invalid transform format: ${transform}`);
  }
  return `${m[1]} ${m[2]}`;
}
