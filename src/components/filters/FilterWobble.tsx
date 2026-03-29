import { useMemo } from "react";
import {
  parseScaleTransform,
  validateFilterProps,
  type FilterProps,
} from "./types";

/** ゆらゆら揺れるフィルター（rotate往復アニメーション） */
export function FilterWobble({
  id,
  transforms,
  paths,
  color,
  viewBoxSize: size = 128,
  backgroundColor = "transparent",
}: FilterProps) {
  validateFilterProps(paths, transforms);

  const center = size / 2;

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
            dur="0.5s"
            additive="sum"
            repeatCount="indefinite"
          />
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            values={`-10 ${center} ${center}; 10 ${center} ${center}; -10 ${center} ${center}`}
            dur="0.5s"
            additive="sum"
            repeatCount="indefinite"
          />
        </path>
      ))}
    </svg>
  );
}
