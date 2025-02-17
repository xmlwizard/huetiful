import runner, { type Spec } from "./runner.ts";
import {
  discover,
  earthtone,
  hueshift,
  interpolator,
  pair,
  pastel,
  scheme,
} from "../lib/generators.ts";
const tests: Spec[] = [
  {
    description: "Discovers palette combinations from an array of colors",
    callback: discover,
    matcher: "arrayContaining",
    params: [],
    result: "",
  },
  {
    description:
      "Creates a color scale between an earth tone and any color token using spline interpolation.",
    callback: earthtone,
    matcher: "arrayContaining",
    params: [],
    result: "",
  },
  {
    description:
      "Creates a palette of hue shifted colors from the passed in color.",
    callback: hueshift,
    matcher: "arrayContaining",
    params: [],
    result: "",
  },
  {
    description:
      "Interpolates the passed in colors and returns a color scale that is evenly split into `num` amount of samples.",
    callback: interpolator,
    matcher: "arrayContaining",
    params: [],
    result: "",
  },
  {
    description:
      "Creates a palette that consists of a `baseColor` that is incremented by a `hueStep` to get the final color to pair with.",
    callback: pair,
    matcher: "arrayContaining",
    params: [],
    result: "",
  },
  {
    description:
      "Generates a randomised classic color scheme from the passed in color.",
    callback: pastel,
    matcher: "arrayContaining",
    params: [],
    result: "",
  },
  {
    description: "Distributes factors of a collection of color.",
    callback: scheme,
    matcher: "arrayContaining",
    params: [],
    result: "",
  },
];

runner(tests);
