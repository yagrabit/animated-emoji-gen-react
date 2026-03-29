import { useCallback } from "react";
import { useGifExport } from "@/hooks/useGifExport";
import type { FilterEntry } from "@/components/filters/types";
import { FilterNormal } from "@/components/filters/FilterNormal";
import { FilterDancingStroke } from "@/components/filters/FilterDancingStroke";
import { FilterBlink } from "@/components/filters/FilterBlink";
import { FilterScale } from "@/components/filters/FilterScale";
import { FilterShake } from "@/components/filters/FilterShake";
import { FilterBounce } from "@/components/filters/FilterBounce";
import { FilterRainbow } from "@/components/filters/FilterRainbow";
import { FilterWobble } from "@/components/filters/FilterWobble";
import styles from "./FilterGallery.module.css";

const FILTERS: FilterEntry[] = [
  { name: "Normal", component: FilterNormal },
  { name: "Dancing Stroke", component: FilterDancingStroke },
  { name: "Blink", component: FilterBlink },
  { name: "Scale", component: FilterScale },
  { name: "Shake", component: FilterShake },
  { name: "Bounce", component: FilterBounce },
  { name: "Rainbow", component: FilterRainbow },
  { name: "Wobble", component: FilterWobble },
];

type FilterGalleryProps = {
  paths: string[];
  transforms: string[];
  color: string;
  backgroundColor: string;
  text: string;
};

export function FilterGallery({
  paths,
  transforms,
  color,
  backgroundColor,
  text,
}: FilterGalleryProps) {
  const { exportGif, exporting } = useGifExport();

  const handleDownload = useCallback(
    async (filterName: string, svgId: string) => {
      const svgEl = document.getElementById(svgId) as SVGSVGElement | null;
      if (!svgEl) return;
      const fileName = `${text}_${filterName}.gif`;
      await exportGif(svgEl, fileName);
    },
    [text, exportGif],
  );

  const hasPaths = paths.length > 0 && paths.some((p) => p.length > 0);

  return (
    <div className={styles.gallery}>
      {FILTERS.map((filter) => {
        const FilterComp = filter.component;
        const svgId = `filter-${filter.name.replace(/\s+/g, "-").toLowerCase()}`;
        return (
          <div key={filter.name} className={styles.card}>
            <span className={styles.filterName}>{filter.name}</span>
            <div className={styles.preview}>
              {hasPaths ? (
                <FilterComp
                  id={svgId}
                  paths={paths}
                  transforms={transforms}
                  color={color}
                  backgroundColor={backgroundColor}
                />
              ) : (
                <div className={styles.placeholder} />
              )}
            </div>
            <button
              type="button"
              className={styles.downloadButton}
              disabled={!hasPaths || exporting}
              onClick={() => handleDownload(filter.name, svgId)}
            >
              {exporting ? "生成中..." : "ダウンロード"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
