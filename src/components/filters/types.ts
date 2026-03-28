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
