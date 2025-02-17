import {
  achromatic,
  alpha,
  family,
  lightness,
  luminance,
  mc,
  temp,
  token,
} from "../lib/utils.ts";
import runner, { type Spec } from "./runner.ts";

const str = "#ffc3b03b",
  arr = ["rgb", 0.4, 0.3, 0.1, 0.7],
  obj = { r: 0.2, g: 0.4, b: 0.5, mode: "rgb" },
  fn_mc = (a: string, b: string, c: number | string) => mc(a)(b, c);
const specs: Spec[] = [
  {
    // ? token()
    description: "converts an object to a number",
    callback: token,
    params: [obj, { kind: "num" }],
  },
  {
    description: "converts a hex string to an array of channel values",
    callback: token,
    params: [str, { kind: "arr", targetMode: "lab" }],
  },
  {
    description:
      "converts an array to a 6 character hex string (without the alpha channel). ",
    callback: token,
    params: [arr, { kind: "str", omitAlpha: true }],
  },
  {
    description:
      "converts an array to an object without alpha and mode properties",
    callback: token,
    params: [arr, { kind: "obj", omitMode: true, omitAlpha: true }],
  },
  {
    description:
      "converts an object to an array of channel values with no mode string.",
    callback: token,
    params: [obj, { kind: "arr", omitMode: true }],
  },
  {
    description: "converts an array to a number",
    params: [arr, { kind: "num" }],
    callback: token,
  }, // ? mc()
  // * getting
  {
    description: "gets the channel value of a color object",
    callback: fn_mc,
    params: ["lch.c", obj],
  },
  {
    description: "gets the channel value of color array",
    callback: fn_mc,
    params: ["lch.c", arr],
  },
  {
    description: "gets the channel value of color string",
    callback: fn_mc,
    params: ["lch.c", str],
  }, // * setting

  {
    description: "sets the channel value of a color object",
    callback: fn_mc,
    params: ["lch.h", obj, "*0.2"],
  },
  {
    description: "sets the channel value of a color array",
    callback: fn_mc,
    params: ["lch.h", arr, 20],
  }, // ? alpha()
  //  * setting
  {
    description: "sets the alpha channel value on a color object",
    callback: alpha,
    params: [obj, 0.05],
  },
  {
    description: "sets the alpha channel value on a color string",
    callback: alpha,
    params: [str, 0.05],
  },
  {
    description: "sets the alpha channel value on a color array",
    callback: alpha,
    params: [arr, 0.05],
  }, // * getting
  {
    description: "gets the alpha channel value from a color object",
    callback: alpha,
    params: [obj],
  },
  {
    description: "gets the alpha channel value from a color array",
    callback: alpha,
    params: [arr],
  },
  {
    description: "gets the alpha channel value from a color string",
    callback: alpha,
    params: [str],
  }, // ? family()
  {
    description: "gets the hue family of a color token",
    params: [str, true],
    callback: family,
  }, // ? temp

  {
    description: "gets the estimated color temperature of a color token",
    params: [str],
    callback: temp,
  }, // ? achromatic
  {
    description: "checks if a color is grayscale or not",
    params: ["gray"],
    callback: achromatic,
  }, // ? lightness
  {
    description:
      "brightens or darkens the color by scaling the lightness channel",
    params: [obj, { amount: 0.3, darken: true }],
    callback: lightness,
  }, // ? luminance

  // * setting
  {
    description: "gets the luminance value of the passed in color token",
    params: [obj],
    callback: luminance,
  }, // * setting
  // ! passing string values treturns black #000000

  {
    description: "sets the luminance value of the passed in color token",
    params: [str, 0.5],
    callback: luminance,
  },
];

runner(specs);
