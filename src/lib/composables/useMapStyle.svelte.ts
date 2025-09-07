import { PUBLIC_MAPTILER_API_KEY } from "$env/static/public";
import type { Config } from "$lib/types.js";

export function useMapStyle(config: Config) {
  let currentStyleUrl = $state(config.mapStyles[0]?.lightUrl || "");

  const currentStyle = $derived(
    config.mapStyles.find((style) => style.lightUrl === currentStyleUrl || style.darkUrl === currentStyleUrl) ||
      config.mapStyles[0],
  );

  const changeStyle = (styleUrl: string) => {
    currentStyleUrl = styleUrl;
  };

  const getTerrainSource = () => ({
    type: "raster-dem" as const,
    url: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${PUBLIC_MAPTILER_API_KEY}`,
    tileSize: 256,
  });

  const getTerrainConfig = () => ({
    source: "terrain",
    exaggeration: 1.5,
  });

  return {
    get currentStyleUrl() {
      return currentStyleUrl;
    },
    get currentStyle() {
      return currentStyle;
    },
    changeStyle,
    getTerrainSource,
    getTerrainConfig,
  };
}
