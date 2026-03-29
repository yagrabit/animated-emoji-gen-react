import { validateFilterProps, type FilterProps } from "./types";

const RAINBOW_COLORS = "#ff0000;#ff8800;#ffdd00;#00cc44;#0088ff;#8800ff;#ff0000";

/** 虹色に変化するフィルター（fillアニメーション） */
export function FilterRainbow({
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
        <path
          key={i}
          d={p}
          fill={color}
          stroke={color}
          strokeWidth="1"
          transform={transforms[i]}
        >
          <animate
            attributeName="fill"
            values={RAINBOW_COLORS}
            dur="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke"
            values={RAINBOW_COLORS}
            dur="1s"
            repeatCount="indefinite"
          />
        </path>
      ))}
    </svg>
  );
}
