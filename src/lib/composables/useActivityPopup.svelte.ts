import type { ActivityProperties } from "$lib/types.js";

export function useActivityPopup() {
  const createPopupContent = (properties: ActivityProperties): string => {
    const {
      name = "Unnamed Activity",
      type = "Unknown",
      id = "",
      start_date_local = "",
      distance = 0,
      total_elevation_gain = 0,
      elapsed_time = 0,
    } = properties;

    // Format distance (convert from meters to km/miles)
    const distanceKm = (distance / 1000).toFixed(1);
    const distanceMi = (distance * 0.000621371).toFixed(1);

    // Format elevation gain
    const elevationM = Math.round(total_elevation_gain || 0);
    const elevationFt = Math.round((total_elevation_gain || 0) * 3.28084);

    // Format time (convert from seconds to readable format)
    const formatTime = (seconds: number): string => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      }
      return `${minutes}m`;
    };

    // Format date
    const formatDate = (dateStr: string): string => {
      if (!dateStr) return "";
      try {
        return new Date(dateStr).toLocaleDateString();
      } catch {
        return dateStr;
      }
    };

    return `
            <div class="activity-popup">
                <h3>${name}</h3>
                <div class="details">
                    <div><strong>Type:</strong> ${type}</div>
                    ${start_date_local ? `<div><strong>Date:</strong> ${formatDate(start_date_local)}</div>` : ""}
                    ${distance > 0 ? `<div><strong>Distance:</strong> ${distanceKm} km (${distanceMi} mi)</div>` : ""}
                    ${total_elevation_gain > 0 ? `<div><strong>Elevation:</strong> ${elevationM} m (${elevationFt} ft)</div>` : ""}
                    ${elapsed_time > 0 ? `<div><strong>Time:</strong> ${formatTime(elapsed_time)}</div>` : ""}
                </div>
                ${
                  id
                    ? `<div class="link">
                    <a href="https://intervals.icu/activities/${id}" target="_blank" rel="noopener">
                        View on intervals.icu
                    </a>
                </div>`
                    : ""
                }
            </div>
        `;
  };

  return {
    createPopupContent,
  };
}
