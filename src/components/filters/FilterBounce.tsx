import { validateFilterProps, type FilterProps } from "./types";

/** ぴょんぴょん跳ねるフィルター（translateアニメーション） */
export function FilterBounce({
  id,
  transforms,
  paths,
  color,
  viewBoxSize: size = 128,
  backgroundColor = "transparent",
}: FilterProps) {
  validateFilterProps(paths, transforms);

  return (
    <svg id={id} viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <rect width="100%" height="100%" fill={backgroundColor} />
      {paths.map((p, i) => (
        <g key={i}>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 -12; 0 0"
            keyTimes="0; 0.4; 1"
            calcMode="spline"
            keySplines="0.3 0.8 0.3 1; 0.3 0 0.7 0.2"
            dur="0.5s"
            repeatCount="indefinite"
          />
          <path
            d={p}
            fill={color}
            stroke={color}
            strokeWidth="1"
            transform={transforms[i]}
          />
        </g>
      ))}
    </svg>
  );
}
