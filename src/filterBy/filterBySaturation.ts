// Filters colors according to a defined saturation range
import { multiply } from "lodash-es";
import { getChannel } from "../core-utils/get.ts";
import type { baseColor, filterBy } from "../paramTypes";
import { colorObjArr, filteredArr } from "../core-utils/helpers.ts";

const filterBySaturation: filterBy = (
  colors,
  startSaturation = 0.05,
  endSaturation = 1
) => {
  const factor = "saturation";
  const cb = getChannel("lch.c");

  //  Normalize saturation ranges later
  return filteredArr(factor)(
    colorObjArr(factor, cb)(colors),
    multiply(100, startSaturation),
    multiply(100, endSaturation)
  );
};

export { filterBySaturation };
