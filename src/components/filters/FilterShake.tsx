import { validateFilterProps, type FilterProps } from "./types";

/** ぷるぷる震えるフィルター（translateアニメーション） */
export function FilterShake({
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
            values="0 0; -3 0; 3 0; -2 0; 2 0; 0 0"
            dur="0.3s"
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
