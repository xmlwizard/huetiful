import hueTempMap from "./color-maps/samples/hueTemperature.js";
import {
  adjustHue,
  customConcat,
  expressionParser,
  floorCeil,
  inRange,
  lte,
  matchLightnessChannel,
  max,
  random,
} from "./fp/index.js";
import { toHex } from "./converters.js";
import {
  interpolate,
  wcagLuminance,
  modeRgb,
  useMode,
  modeLch,
  converter,
  wcagContrast,
  easingSmootherstep,
  modeLab,
} from "culori/fn";
import "culori/css";
import {
  Color,
  HueColorSpaces,
  Factor,
  Order,
  callback,
  HueFamily,
} from "./types.js";

import { matchChromaChannel, sortedArr, checkArg } from "./fp/index.js";
import { isAchromatic } from "./colors/index.js";
/**
 *@function
 @description Gets the hue family which a a color belongs to with the overtone included (if it has one.). For achromatic colors it returns the string "gray".
 * @param color The color to query its shade or hue family.
 * @returns The name of the hue family for example red or green.
 * @example
 * 
 * import { getHue } from 'huetiful-js'


console.log(getHue("#310000"))
// red
 */
function getHueFamily(color: Color, mode?: HueColorSpaces): HueFamily {
  //Capture the hue value

  return Object.keys(hueTempMap)
    .map((hue) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const hueVals = customConcat(hueTempMap[hue]);
      // @ts-ignore
      const minVal = min(hueVals),
        maxVal = max(hueVals);
      const bool = customConcat(hueTempMap[hue]).some(() =>
        inRange(getChannel(`${mode}.h`)(color), minVal, maxVal)
      );

      if (bool) {
        return hue;
      }
    })
    .filter((val) => typeof val === "string")[0] as HueFamily;
}

function lightnessPredicate(colorspace) {
  return getChannel(`${matchLightnessChannel(colorspace)}`);
}

function temperaturePredicate(factor: number, temp: "warm" | "cool"): boolean {
  const hueKeys = Object.keys(hueTempMap);
  return (
    hueKeys.some((val) =>
      inRange(
        floorCeil(factor),
        hueTempMap[val][temp][0],
        hueTempMap[val][temp][1]
      )
    ) || false
  );
}

/**
 * @function
 * @description Checks if a color can be roughly classified as a cool color. Returns true if color is a cool color else false.
 * @param color The color to check the temperature.
 * @returns True or false.
 * @example
 * 
 * import { isCool } from 'huetiful-js'

let sample = [
  "#00ffdc",
  "#00ff78",
  "#00c000"
];


console.log(isCool(sample[2]));
// false

console.log(map(sample, isCool));

// [ true,  false, true]



 */
function isCool(color: Color): boolean {
  // First we need to get the hue value which we'll pass to the predicate
  const factor = getChannel("lch.h")(color);

  return temperaturePredicate(factor, "cool");
}

/**
 * @function
 * @description Checks if a color can be roughly classified as a warm color. Returns true if color is a warm color else false.
 * @param color The color to check the temperature.
 * @returns True or false.
 * @example import { isWarm } from 'huetiful-js'

let sample = [
  "#00ffdc",
  "#00ff78",
  "#00c000"
];



console.log(isWarm(sample[2]));
//true

console.log(map(sample, isWarm));


// [ false, true,  false]

 */
function isWarm(color: Color): boolean {
  const factor = getChannel("lch.h")(color);

  return temperaturePredicate(factor, "cool");
}

function contrastPredicate(color) {
  return (against) => getContrast(color, against);
}

function huePredicate(colorSpace: string) {
  return (color: Color) => {
    return getChannel(`${checkArg(colorSpace, "jch")}.h`)(color);
  };
}

/**
 * @function
 * @description Gets the smallest contrast value from the passed in colors compared against a sample color.
 * @param colors The array of colors to query the color with the smallest contrast value.
 * @param colorObj Optional boolean that makes the function return a custom object with factor (contrast) and name of the color as keys. Default is false.
 * @param mode THe mode colorspace to retrieve the contrast value from.
 * @returns The smallest contrast value in the colors passed in or a custom object.
 * @example 
 * 
 * import { getNearestContrast } from 'huetiful-js'
 * 
console.log(getNearestContrast(["b2c3f1", "#a1bd2f", "#f3bac1"], "green"));
// 2.4061390502133424

console.log(getNearestContrast(["b2c3f1", "#a1bd2f", "#f3bac1"], "green", true));
// { contrast: 2.4061390502133424, name: '#a1bd2f' }
 */
function getNearestContrast(
  colors: Color[],
  against: Color,
  colorObj?: boolean
) {
  return baseFunc(
    "contrast",
    colors,
    contrastPredicate(against),
    "desc",
    colorObj
  );
}

/**
 *@function
 * @description Gets the largest contrast value from the passed in colors compared against a sample color.
 * @param colors The array of colors to query the color with the largest contrast value.
 * @param colorObj Optional boolean that makes the function return a custom object with factor (contrast) and name of the color as keys. Default is false.
 * @param mode THe mode colorspace to retrieve the contrast value from.
 * @returns The largest contrast value in the colors passed in or a custom object.
 * @example 
 * 
import { getFarthestContrast } from 'huetiful-js'

console.log(getFarthestContrast(["b2c3f1", "#a1bd2f", "#f3bac1"], "green"));
// 3.08355493246362

console.log(getFarthestContrast(["b2c3f1", "#a1bd2f", "#f3bac1"], "green", true));
// { contrast: 3.08355493246362, name: '#f3bac1' }

 */

function getFarthestContrast(
  colors: Color[],
  against: Color,
  colorObj?: boolean
): number | { factor: number; name: Color } {
  return baseFunc(
    "contrast",
    colors,
    contrastPredicate(against),
    "desc",
    colorObj
  );
}

function chromaPredicate(colorspace) {
  return (color: Color) =>
    getChannel(matchChromaChannel(colorspace))(color) || undefined;
}

function baseFunc(
  factor: Factor,
  colors: Color[],
  cb: callback,
  order?: Order,
  colorObj?: boolean
) {
  const result: Array<{ factor: number; name: Color }> | number = sortedArr(
    factor,
    cb,
    order as Order,
    colorObj
  )(colors).filter((el) => el[factor] !== undefined);

  return (colorObj && result[0]) || result[0][factor];
}

/**
 *@function
 * @description Gets the smallest chroma/saturation value from the passed in colors.
 * @param colors The array of colors to query the color with the smallest chroma/saturation value.
 * @param colorspace The mode color space to perform the computation in.
 * @param colorObj Optional boolean that makes the function return a custom object with factor (saturation) and name of the color as keys. Default is false.
 * @returns The smallest chroma/saturation value in the colors passed in or a custom object.
 * @example
 * 
 * import { getNearestChroma } from 'huetiful-js'

let sample = ['b2c3f1', '#a1bd2f', '#f3bac1']

console.log(getNearestChroma(sample, 'lch'))
// 22.45669293295522
 */
function getNearestChroma(
  colors: Color[],
  colorspace?: HueColorSpaces,
  colorObj = false
): number | { factor: number; color: Color } {
  return baseFunc(
    "saturation",
    colors,
    chromaPredicate(colorspace),
    "asc",
    colorObj
  );
}

/**
 *@function
 * @description Gets the largest saturation value from the passed in colors.
 * @param colors The array of colors to query the color with the largest saturation value.
 * @param colorSpace The mode color space to perform the computation in.
 * @param colorObj Optional boolean that makes the function return a custom object with factor (saturation) and name of the color as keys. Default is false.
 * @returns The largest saturation value in the colors passed in or a custom object.
 * @example 
 * 
 * import { getFarthestChroma } from 'huetiful-js'

let sample = ['b2c3f1', '#a1bd2f', '#f3bac1']

console.log(getFarthestChroma(sample, 'lch'))
// 67.22120855010492
 */
function getFarthestChroma(
  colors: Color[],
  colorSpace?: HueColorSpaces,
  colorObj = false
): number | { factor: number; color: Color } {
  return baseFunc("saturation", colors, chromaPredicate, "desc", colorObj);
}

/**
 *@function
 * @description Gets the smallest hue value from the passed in colors.
 * @param colors The array of colors to query the color with the smallest hue value.
 * @param colorspace The mode color space to perform the computation in.
 * @param colorObj Optional boolean that makes the function return a custom object with factor (hue) and name of the color as keys. Default is false.
 * @returns The smallest hue value in the colors passed in or a custom object.
 * @example
 * 
 * import { getNearestHue } from 'huetiful-js'

let sample = ['b2c3f1', '#a1bd2f', '#f3bac1']

console.log(getNearestHue(sample, 'lch'))
// 12.462831644544274
 */
function getNearestHue(
  colors: Color[],
  colorspace?: HueColorSpaces | string,
  colorObj = false
): number | { factor: number; color: Color } {
  return baseFunc("hue", colors, huePredicate(colorspace), "asc", colorObj);
}

/**
 *@function
 * @description Gets the largest hue value from the passed in colors.
 * @param colors The array of colors to query the color with the largest hue value.
 * @param colorspace The mode color space to perform the computation in.
 * @param colorObj Optional boolean that makes the function return a custom object with factor (hue) and name of the color as keys. Default is false.
 * @returns The largest hue value in the colors passed in or a custom object.
 * @example
 * 
 * import { getFarthestHue } from 'huetiful-js'
let sample = ['b2c3f1', '#a1bd2f', '#f3bac1']

console.log(getFarthestHue(sample, 'lch'))
// 273.54920266436477
 */
function getFarthestHue(
  colors: Color[],
  colorspace?: HueColorSpaces,
  colorObj = false
): number | { factor: number; color: Color } {
  return baseFunc("hue", colors, huePredicate(colorspace), "desc", colorObj);
}

/**
 * @function
 * @description Gets the complementary hue of the passed in color. The function is internally guarded against achromatic colors.
 * @param color The color to retrieve its complimentary hue.
 * @param colorObj Optional boolean whether to return an object with the result color hue family or just the result color. Default is false.
 * @returns An object with the hue family and complimentary color as keys.
 * @example
 *import { getComplimentaryHue } from "huetiful-js";
 *
 * 
console.log(getComplimentaryHue("pink", true))
//// { hue: 'blue-green', color: '#97dfd7ff' }

console.log(getComplimentaryHue("purple"))
// #005700ff
 */
function getComplimentaryHue(
  color: Color,
  colorspace?: HueColorSpaces,
  colorObj = false
): { hue: string; color: Color } | Color {
  const modeChannel = `${colorspace}.h`;

  const complementaryHue: number = adjustHue(
    getChannel(modeChannel)(color) + 180 * random(0.965, 1)
  );

  const result: Color | { hue: string; color: Color } = (complementaryHue && {
    hue: getHueFamily(complementaryHue),
    color: toHex(setChannel(modeChannel)(color, complementaryHue)),
  }) || { hue: "gray", color: color };

  return (colorObj && result) || result["color"];
}

/**
 * @function
 * @description Sets the value for the specified channel in a color.
 * @param  color Any recognizable color token.
 * @param  mc The mode and channel to work with. For example 'rgb.b'.
 * @param  value The value to set on the queried channel. Also supports expressions as strings e.g set('lch.c)("#fc23a1","*0.5")
 * @returns color The mutated color.
 * 
 * @example
 * 
 * import { setChannel } from 'huetiful-js'

let myColor = setChannel('lch.h')('green',10)

console.log(getChannel('lch.h')(myColor))
// 10
 */

function setChannel(mc: string) {
  return (color: Color, value: number | string): Color => {
    const [mode, channel] = mc.split(".");
    // @ts-ignore
    const src: Color = converter(mode)(toHex(color));

    if (channel) {
      if (typeof value === "number") {
        src[channel] = value;
      } else if (typeof value === "string") {
        expressionParser(src, channel, value);
      } else {
        throw new Error(`unsupported value for setChannel`);
      }

      return src;
    } else {
      throw new Error(`unknown channel ${channel} in mode ${mode}`);
    }
  };
}

/**
 * @function
 * @description Gets the  value specifified channel on the color.
 * @param mc The mode and channel to be retrieved. For example "rgb.b" will return the value of the blue channel in the RGB color space of that color.
 * @param color The color being queried.
 * @returns value The value of the queried channel.
 * @example
 * 
 * import { getChannel } from 'huetiful-js'

console.log(getChannel('rgb.g')('#a1bd2f'))
// 0.7411764705882353
 * */
function getChannel(mc: string) {
  return (color: Color): number => {
    const [mode, channel] = mc.split(".");
    // @ts-ignore
    const src = converter(mode)(toHex(color));

    if (channel) {
      return src[channel];
    } else {
      throw Error(`unknown channel ${channel} in mode ${mode}`);
    }
  };
}

/** @alias
 * Gets the luminance value of that color as defined by WCAG.
 * @param color The color to query.
 * @returns value The color's luminance value.
 * @example
 * 
 * import { getLuminance } from 'huetiful-js'

console.log(getLuminance('#a1bd2f'))
// 0.4417749513730954
 */
function getLuminance(color: Color): number {
  return wcagLuminance(toHex(color));
}

const { pow, abs } = Math;
const toRgb = useMode(modeRgb);
/**
 * @function
 * @description Sets the luminance by interpolating the color with black (to decrease luminance) or white (to increase the luminance).
 * @param color The color to set luminance
 * @param lum The amount of luminance to set. The value range is normalised between [0,1]
 * @returns The mutated color with the modified properties.
 * @example
 * 
 * import { setLuminance, getLuminance } from 'huetiful-js'

let myColor = setLuminance('#a1bd2f', 0.5)

console.log(getLuminance(myColor))
// 0.4999999136285792
 */
function setLuminance(color: Color, lum: number): Color {
  const white = "#ffffff",
    black = "#000000";

  const EPS = 1e-7;
  let MAX_ITER = 20;

  if (lum !== undefined && typeof lum == "number") {
    (lum == 0 && lum) || black || (lum == 1 && !lum) || white;

    // compute new color using...
    // @ts-ignore
    const cur_lum = wcagLuminance(color);

    color = toRgb(toHex(color));

    const test = (low: Color, high: Color) => {
      //Must add the overrides object to change parameters like easings, fixups, and the mode to perform the computations in.
      // @ts-ignore
      const mid = interpolate([low, high])(0.5);
      const lm = getLuminance(color);
      // @ts-ignore
      if (abs(lum - lm > EPS) || !MAX_ITER--) {
        // close enough
        return mid;
      }

      if (lm > lum) {
        return test(low, mid);
      } else {
        return test(mid, high);
      }
    };

    let rgb: Color;
    if (cur_lum > lum) {
      rgb = test(black, color);
    } else {
      rgb = test(color, white);
    }
    color = rgb;
    return color;
  }
  //   spreading the array values (r,g,b)
  return rgb2luminance(color);
}

function rgb2luminance(color: Color): number {
  color = toRgb(toHex(color));

  // relative luminance
  // see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
  return (
    0.7152 * luminance_x(color["g"]) +
    0.2126 * luminance_x(color["r"]) +
    0.0722 * luminance_x(color["b"])
  );
}

function luminance_x(x: number) {
  x /= 255;
  return (lte(x, 0.03928) && x / 12.92) || pow((x + 0.055) / 1.055, 2.4);
}

/**
 * @function
 * @description Sets the opacity of a color. Also gets the alpha value of the color if the value param is omitted
 * @param color The color with the targeted opacity/alpha channel.
 * @param value The value to apply to the opacity channel. The value is between [0,1]
 * @returns color The resulting color. Returns an 8 character hex code.
 * @example
 * 
 * // Getting the alpha
console.log(alpha('#a1bd2f0d'))
// 0.050980392156862744

// Setting the alpha

let myColor = alpha('b2c3f1', 0.5)

console.log(myColor)

// #b2c3f180
 */

function alpha(color: Color, value?: number | string): number {
  // We never perfom an operation on an undefined color. Defaults to pure black
  color = color || "black";

  const channel = "alpha";
  const lch = useMode(modeLch);
  const src: Color = lch(toHex(color));
  if (typeof value === "undefined" || null) {
    return src[channel];
  } else if (typeof value === "number") {
    if (inRange(value, 0, 1)) {
      src[channel] = value;
    } else {
      src[channel] = value / 100;
    }
  } else if (typeof value === "string") {
    expressionParser(src, channel, value);
  }
  // @ts-ignore
  return toHex(src);
}

/**
 * @function
 * @description Gets the relative luminance of the lightest color
 * @param color
 * @param against
 * @returns The relative luminance of the lightest color.
 * @example
 *
 * import { getContrast } from 'huetiful-js'
 *
 * console.log(getContrast("black", "white"));
 * // 21
 */
function getContrast(color: Color, against: Color): number {
  return wcagContrast(toHex(color), toHex(against));
}

/**
 * @function
 * @description Returns the hue which is biasing the passed in color
 * @param color The color to query its overtone.
 * @returns The name of the overtone hue. If an achromatic color is passed in it return the string gray otherwise if the color has no bias it returns false.
 * @example
 * 
 * import { overtone } from "huetiful-js";
 * 
console.log(overtone("fefefe"))
// 'gray'

console.log(overtone("cyan"))
// 'green'

console.log(overtone("blue"))
// false
 */
function overtone(color: Color): string | boolean {
  const factor = getChannel("lch.h")(color);
  let hue = getHueFamily(factor);

  // We check if the color can be found in the defined ranges
  return (
    (isAchromatic(color) && "gray") ||
    (/-/.test(hue) && hue.split("-")[1]) ||
    false
  );
}

/**
 * @function
 * @description Gets the smallest lightness value from the passed in colors.
 * @param colors The array of colors to query the color with the smallest lightness value.
 * @param colorObj Optional boolean that makes the function return a custom object with factor (lightness) and name of the color as keys. Default is false.
 * @param mode THe mode colorspace to retrieve the lightness value from.
 * @returns The smallest lightness value in the colors passed in or a custom object.
 * @example
 * 
 * import { getNearestLightness } from 'huetiful-js'

let sample = ["b2c3f1", "#a1bd2f", "#f3bac1"]

console.log(getNearestLightness(sample, true))

// { lightness: 72.61647882089876, name: '#a1bd2f' }

 */
function getNearestLightness(
  colors: Color[],
  mode?: HueColorSpaces,
  colorObj = false
): number | { factor: number; color: Color } {
  // @ts-ignore

  return baseFunc("lightness", colors, lightnessPredicate, "asc", colorObj);
}

/**
 * @function
 * @description Gets the largest lightness value from the passed in colors.
 * @param colors The array of colors to query the color with the largest lightness value.
 * @param colorObj Optional boolean that makes the function return a custom object with factor (lightness) and name of the color as keys. Default is false.
 * @param mode THe mode colorspace to retrieve the lightness value from.
 * @returns The largest lightness value in the colors passed in or a custom object.
 * @example 
 * 
 * import { getFarthestLightness } from 'huetiful-js'

let sample = ["b2c3f1", "#a1bd2f", "#f3bac1"]

console.log(getFarthestLightness(sample, true))

// { lightness: 80.94668903360088, name: '#f3bac1' }

 */
const getFarthestLightness = (
  colors: Color[],
  mode?: HueColorSpaces,
  colorObj = false
): number | { factor: number; color: Color } => {
  // @ts-ignore

  return baseFunc("lightness", colors, lightnessPredicate, "asc", colorObj);
};

const toLab = useMode(modeLab);
/**
 * @function
 * @description Darkens the color by reducing the lightness channel. .
 * @param   color The color to darken.
 * @param value The amount to darken with. Also supports expressions as strings e.g darken("#fc23a1","*0.5")
 * @returns color The darkened color.
 * @example
 * 
 * 

 */
function darken(color: Color, value: number | string): Color {
  const Kn = 18;
  const channel = "l";

  const src = toLab(toHex(color));

  if (typeof value === "number") {
    src["l"] -= Kn * easingSmootherstep(value / 100);
  } else if (typeof value === "string") {
    // @ts-ignore
    expressionParser(src, channel, value || 1);
  }

  return toHex(src);
}

/**
 *
 * @param color The color to brighten.
 * @param value The amount to brighten with. Also supports expressions as strings e.g darken("#fc23a1","*0.5")
 * @param mode The color space to compute the color in. Any color space with a lightness channel will do (including HWB)
 * @returns
 */
function brighten(color: Color, value: number | string, colorspace): Color {
  const src = toLab(toHex(color));
  const [_, ch] = matchLightnessChannel(colorspace).split(".");
  let result = src;
  if (typeof value == "number") {
    result[ch] -= 18 * easingSmootherstep(Math.abs(value) / 100);
  } else if (typeof value == "string") {
    //@ts-ignore
    result = expressionParser(src, ch, value);
  }

  return toHex(result);
}

export {
  brighten,
  darken,
  getFarthestLightness,
  getNearestLightness,
  overtone,
  getFarthestChroma,
  getNearestChroma,
  setChannel,
  setLuminance,
  getChannel,
  getLuminance,
  getContrast,
  getFarthestContrast,
  getNearestContrast,
  isCool,
  isWarm,
  getHueFamily,
  getComplimentaryHue,
  getFarthestHue,
  getNearestHue,
};
