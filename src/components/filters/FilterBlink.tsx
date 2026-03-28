import type { FilterProps } from "./types";

/** 点滅フィルター（SMILアニメーション） */
export function FilterBlink({
  id,
  transforms,
  paths,
  color,
  viewBoxSize: size = 128,
  backgroundColor = "transparent",
}: FilterProps) {
  return (
    <svg id={id} viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <rect width="100%" height="100%" fill={backgroundColor} />
      {paths.map((p, i) => (
        <path
          key={i}
          d={p}
          fill={color}
          stroke="transparent"
          transform={transforms[i]}
        >
          <animate
            attributeName="fill"
            values={`${color};transparent`}
            calcMode="discrete"
            dur="0.4s"
            repeatCount="indefinite"
          />
        </path>
      ))}
    </svg>
  );
}
