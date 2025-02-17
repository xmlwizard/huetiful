// import { token } from './lib/utils.ts'

import { colors, diverging, filterBy, sortBy, stats } from "./lib/index.ts";
import { achromatic, family, mc, token } from "./lib/utils.ts";

const cols = colors("all", "300").concat(
  colors("all", "800"),
);

console.log(
  filterBy(cols, {
    factor: ["hue"],
    ranges: {
      hue: [">10", "<50"]
    },factorObject:true
  }),
);


// console.log(sortBy(cols,{factor:['hue']}))
