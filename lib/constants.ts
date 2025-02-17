import type { BiasedHues, ColorFamily } from "./types.d.ts";

/**
 * @internal
 * One dimensional array with each element an array. Index 0 has the hue-family name and indexes 1 and 2 have arrays of the start and end ranges of the warm and cool temp respectively.
 *  // Extracted from The Color Strategist  color wheel. Each hue has two properties :warm and cool as well an [] for each prop with the signature [start,end]

 * - 0 is ColorFamily
 * - 1 is warm ranges
 * - 2 is ccol ranges
 */
const hue: Array<
    [ColorFamily | BiasedHues, [number, number], [number, number]]
  > = [
    ["red-purple", [343, 359], [321, 342]],
    ["red", [21, 40], [0, 20]],
    ["yellow-red", [41, 54], [55, 70]],
    ["yellow", [71, 90], [91, 109]],
    ["green-yellow", [110, 124], [125, 140]],
    ["green", [141, 160], [161, 180]],
    ["blue-green", [181, 200], [201, 220]],
    ["blue", [221, 235], [236, 250]],
    ["purple-blue", [271, 290], [251, 270]],
    ["purple", [316, 320], [291, 315]],
  ],
  limits = {
    cubehelix: {
      s: [0, 4.614],
      l: [0, 1],
    },
    lab: {
      l: [0, 100],
    },
    dlch: { l: [0, 100], c: [0, 51.484] },
    jab: {
      j: [0, 0.222],
    },
    jch: {
      j: [0, 0.221],
      c: [0, 0.19],
    },
    lch: { l: [0, 100], c: [0, 150] },
    lch65: { l: [0, 100], c: [0, 133.807] },
    lchuv: { l: [0, 100], c: [0, 176.956] },
    luv: { l: [0, 100] },
    oklab: { l: [0, 1] },
    oklch: { l: [0, 1], c: [0, 0.4] },
  };

export { hue, limits };
