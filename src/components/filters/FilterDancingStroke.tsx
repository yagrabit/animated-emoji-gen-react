import { useId } from "react";
import { validateFilterProps, type FilterProps } from "./types";

/** 踊るストロークフィルター（feTurbulence + SMIL） */
export function FilterDancingStroke({
  id,
  transforms,
  paths,
  color,
  viewBoxSize: size = 128,
  backgroundColor = "transparent",
}: FilterProps) {
  validateFilterProps(paths, transforms);
  const filterId = useId();

  return (
    <svg id={id} viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <defs>
        <filter
          id={filterId}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
          colorInterpolationFilters="linearRGB"
        >
          <feMorphology
            operator="dilate"
            radius="4 4"
            in="SourceAlpha"
            result="morphology"
          />
          <feFlood floodColor={color} floodOpacity="1" result="flood" />
          <feComposite
            in="flood"
            in2="morphology"
            operator="in"
            result="composite"
          />
          <feComposite
            in="composite"
            in2="SourceAlpha"
            operator="out"
            result="composite1"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.01 0.02"
            numOctaves="1"
            seed="0"
            stitchTiles="stitch"
            result="turbulence"
          >
            <animate
              attributeName="seed"
              from="1"
              to="100"
              dur="1s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="composite1"
            in2="turbulence"
            scale="30"
            xChannelSelector="A"
            yChannelSelector="A"
            result="displacementMap"
          />
          <feMerge result="merge">
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="displacementMap" />
          </feMerge>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill={backgroundColor} />
      {paths.map((p, i) => (
        <path
          key={i}
          d={p}
          fill={color}
          stroke={color}
          strokeWidth="1"
          transform={transforms[i]}
          filter={`url(#${filterId})`}
        />
      ))}
    </svg>
  );
}
