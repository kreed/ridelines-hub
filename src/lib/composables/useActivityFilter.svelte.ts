import type { Config, FilterableActivityType } from "$lib/types.js";

export function useActivityFilter(config: Config) {
  let checkedTypes = $state<string[]>(["Ride", "Run", "Walk", "Hike", "AlpineSki", "Other"]);

  const toggleType = (type: string) => {
    if (checkedTypes.includes(type)) {
      checkedTypes = checkedTypes.filter((t) => t !== type);
    } else {
      checkedTypes = [...checkedTypes, type];
    }
  };

  const getMapFilter = () => {
    if (checkedTypes.length === 0) {
      return ["==", "type", ""];
    }

    const hasOtherChecked = checkedTypes.includes("Other");
    const mainTypes = checkedTypes.filter((type) => type !== "Other");

    if (hasOtherChecked && mainTypes.length > 0) {
      return ["any", ["in", "type", ...mainTypes], ["!in", "type", ...config.activityTypes]];
    } else if (hasOtherChecked) {
      return ["!in", "type", ...config.activityTypes];
    } else {
      return ["in", "type", ...mainTypes];
    }
  };

  const getActivityTypes = (): FilterableActivityType[] =>
    [...config.activityTypes, "Other"] as FilterableActivityType[];

  return {
    get checkedTypes() {
      return checkedTypes;
    },
    set checkedTypes(value: string[]) {
      checkedTypes = value;
    },
    toggleType,
    getMapFilter,
    getActivityTypes,
  };
}
