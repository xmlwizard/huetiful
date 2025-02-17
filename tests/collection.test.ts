import { filterBy, sortBy, stats } from "../lib/collection.ts";
import { colors } from "../lib/palettes.ts";
import runner, { type Spec } from "./runner.ts";

const samples = colors("all", "500");
const tests: Spec[] = [
  {
    description: "Filters collections of color.",
    callback: filterBy,

    params: [samples, { ranges: { hue: [">=190"], factor: ["hue"] } }],
  },
  {
    description: "Sorts collections of color.",
    callback: sortBy,

    params: [samples, { factor: ["hue"], order: "asc" }],
  },
  {
    description: "Gets the stats for a collection of color.",
    callback: stats,

    params: [samples],
  },
  // {
  //   description: "Distributes factors of a collection of color.",
  //   callback: distribute,
  //   matcher: "toEqual",
  //   params: [],
  //   result: "",
  // },
];

runner(tests);
