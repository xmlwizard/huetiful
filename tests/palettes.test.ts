import { colors, diverging, nearest } from "../lib/palettes.ts";

import runner, { type Spec } from "./runner.ts";

const specs: Spec[] = [{
  description: "Returns an array of diverging colors",
  callback: diverging,
  params: [["Spectral"]],
}, {
  description: "Returns an array of colors from Tailwind",
  callback: colors,
  params: ["red"],
}, {
  description:
    "Gets the nearest colors in a collection as compared against a comparison color",
  callback: nearest,
  params: [colors("all", "600"), { num: 6, against: "yellow" }],
}];

runner(specs);
