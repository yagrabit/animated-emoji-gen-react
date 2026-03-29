import { useMemo } from "react";
import {
  parseScaleTransform,
  validateFilterProps,
  type FilterProps,
} from "./types";

/** スケールアニメーションフィルター */
export function FilterScale({
  id,
  transforms,
  paths,
  color,
  viewBoxSize: size = 128,
  backgroundColor = "transparent",
}: FilterProps) {
  validateFilterProps(paths, transforms);

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
          transform={transforms[i]}
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="scale"
            from="0.1 0.1"
            to={scaleParams[i]}
            dur="1s"
            repeatCount="indefinite"
          />
        </path>
      ))}
    </svg>
  );
}
