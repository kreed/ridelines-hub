import { PUBLIC_MAPTILER_API_KEY } from "$env/static/public";
import type { Config } from "../types.js";

export const config: Config = {
  mapStyles: [
    {
      id: "dataviz-dark",
      name: "Standard",
      lightUrl: `https://api.maptiler.com/maps/dataviz/style.json?key=${PUBLIC_MAPTILER_API_KEY}`,
      darkUrl: `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${PUBLIC_MAPTILER_API_KEY}`,
    },
    {
      id: "outdoor-dark",
      name: "Terrain",
      lightUrl: `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${PUBLIC_MAPTILER_API_KEY}`,
      darkUrl: `https://api.maptiler.com/maps/outdoor-v2-dark/style.json?key=${PUBLIC_MAPTILER_API_KEY}`,
    },
    {
      id: "satellite",
      name: "Satellite",
      lightUrl: `https://api.maptiler.com/maps/satellite/style.json?key=${PUBLIC_MAPTILER_API_KEY}`,
      darkUrl: `https://api.maptiler.com/maps/satellite/style.json?key=${PUBLIC_MAPTILER_API_KEY}`,
    },
  ],
  activityTypes: ["Ride", "Run", "Walk", "Hike", "AlpineSki"] as const,
  activityColors: {
    Ride: "#14affc",
    Run: "#4FFFB0",
    Walk: "#fb139c",
    Hike: "#fb139c",
    AlpineSki: "#984ea3",
    default: "#ffff33",
  },
  defaultCenter: [-98.583, 39.833],
  defaultZoom: 4,
  apiUrl:
    import.meta.env.PUBLIC_API_URL ||
    (import.meta.env.DEV
      ? "/api"
      : `https://api.${typeof window !== "undefined" ? window.location.hostname : "localhost"}`),
};
