import { useMemo } from "react";
import type { FilterProps } from "./types";

/** 回転アニメーションフィルター（scale維持 + rotate合成） */
export function FilterRotate({
  id,
  transforms,
  paths,
  color,
  viewBoxSize: size = 128,
  backgroundColor = "transparent",
}: FilterProps) {
  /** "scale(x, y)" → "x y" 形式に変換 */
  const scaleParams = useMemo(
    () => transforms.map((t) => t.replace(/scale\((.+),\s+(.+)\)/, "$1 $2")),
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
            from="360 120 120"
            to="0 120 120"
            dur="1s"
            additive="sum"
            repeatCount="indefinite"
          />
        </path>
      ))}
    </svg>
  );
}
