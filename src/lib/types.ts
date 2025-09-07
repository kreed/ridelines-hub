export interface MapStyle {
  id: string;
  name: string;
  lightUrl: string;
  darkUrl: string;
}

export interface Config {
  mapStyles: MapStyle[];
  activityTypes: ActivityType[];
  activityColors: Record<string, string>;
  defaultCenter: [number, number];
  defaultZoom: number;
  apiUrl: string;
}

export interface ActivityProperties {
  name?: string;
  type?: string;
  id?: string;
  start_date_local?: string;
  distance?: number;
  total_elevation_gain?: number;
  elapsed_time?: number;
}

export type ActivityType = "Ride" | "Run" | "Walk" | "Hike" | "AlpineSki";

// Extended types for filter functionality
export type FilterableActivityType = ActivityType | "Other";
