import { useMemo } from "react";
import {
  parseScaleTransform,
  validateFilterProps,
  type FilterProps,
} from "./types";

/** 回転アニメーションフィルター（scale維持 + rotate合成） */
export function FilterRotate({
  id,
  transforms,
  paths,
  color,
  viewBoxSize: size = 128,
  backgroundColor = "transparent",
}: FilterProps) {
  validateFilterProps(paths, transforms);

  const center = size / 2;

  /** "scale(x, y)" → "x y" 形式に変換 */
  const scaleParams = useMemo(
    () => transforms.map(parseScaleTransform),
    [transforms],
  );

  return (
    <svg id={id} viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <rect width="100%" height="100%" fill={backgroundColor} />
      {paths.map((p, i) => (
        <path
          key={i}
          d={p}
          fill={color}
          stroke={color}
          strokeWidth="1"
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="scale"
            from={scaleParams[i]}
            to={scaleParams[i]}
            dur="1s"
            additive="sum"
            repeatCount="indefinite"
          />
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from={`360 ${center} ${center}`}
            to={`0 ${center} ${center}`}
            dur="1s"
            additive="sum"
            repeatCount="indefinite"
          />
        </path>
      ))}
    </svg>
  );
}
