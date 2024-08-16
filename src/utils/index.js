// @ts-nocheck

/**
 * @typedef { import('../types.js').ColorToken} ColorToken
 * @typedef { import('../types.js').Collection} Collection
 * @typedef {import('../types.js').TailwindColorFamilies} TailwindColorFamilies
 * @typedef {import('../types.js').ScaleValues} ScaleValues
 */

/**
 *
 */

import {
  colorsNamed,
  useMode,
  modeJch,
  modeHsv,
  modeLch65,
  modeLrgb,
  modeLab65,
  modeOklch,
  formatHex,
  formatHex8,
  modeLch,
  modeXyz65,
  modeLab,
  wcagLuminance,
  interpolate,
} from "culori/fn";
import "culori/css";
import {
  getSrcMode,
  gmchn,
  and,
  eq,
  not,
  exprParser,
  inRange,
  isArray,
  neq,
  or,
  gt,
  take,
  give,
  max,
  min,
  adjustHue,
  customConcat,
  entries,
  floorCeil,
  gte,
  keys,
  lte,
  rand,
} from "../internal/index.js";
import { hue } from "../constants/index.js";

/**
 *
 * Returns the color token's alpha channel value.
 * 
 *  If the the `amount` parameter is passed in, it sets the color token's alpha channel with the `amount` specified 
 * and returns the color as a hex string.
 * 
 * * Also supports math expressions as a `string` for the `amount` parameter. 
 * For example `*0.5` which means the value multiply the current alpha by `0.5` and set the product as the new alpha value. 
 * In short `currentAlpha * 0.5 = newAlpha`. The supported symbols are `*  -  /  +`.
 * 
 * @param {ColorToken} color The color with the opacity/alpha channel to retrieve or set.
 * @param {number|string} amount The value to apply to the opacity channel. The value is between `[0,1]`
 * @returns {number|string}
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
function alpha(color, amount = undefined) {
  let alphaChannel;

  if (isArray(color)) {
    alphaChannel = eq(
      color.filter((channel) => eq(typeof channel, "number")).length,
      4
    )
      ? color[color?.length - 1]
      : 1;
  } else if (eq(typeof color, "string")) {
    alphaChannel = and(
      gte(color?.length, 8),
      not(colorsNamed?.color?.toLowerCase())
    )
      ? parseInt(color?.slice(color?.length - 2), 16)
      : 1;
  } else if (eq(typeof color, "object")) {
    alphaChannel = color?.alpha;
  }

  if (not(amount)) {
    return alphaChannel;
  } else {
    amount = or(
      and(neq(typeof amount, "number"), exprParser(alphaChannel, amount)),
      or(and(inRange(amount, 0, 1), amount), give(amount, 100))
    );

    if (isArray(color)) {
      // Get the alpha index

      color[
        or(
          and(
            or(
              eq(color.length, 5),
              and(neq(color[0], "string"), eq(color.length, 4))
            ),
            take(color.length, 1)
          ),
          3
        )
      ] = amount;
    }

    if (eq(typeof color, "object")) {
      color["alpha"] = amount;
    } else {
      let colorObject = token(color, { kind: "obj" });
      colorObject["alpha"] = amount;
      color = colorObject;
    }
    return color;
  }
}

/**
 * Sets the value of the specified channel on the passed in color.
 * 
 * If the `amount` parameter is `undefined` it gets the value of the specified channel.
 * @param {string} modeChannel The mode and channel to be retrieved. For example `'rgb.b'` will return the value of the blue channel in the RGB color space of that color.
 
 * @example
 *
 * import { mc } from 'huetiful-js'

console.log(mc('rgb.g')('#a1bd2f'))
// 0.7411764705882353
 * 
*/

function mc(modeChannel = "") {
  /**
   
   * @param {ColorToken} color Any recognizable color token.
  * @param {string|number} [value=undefined] The value to set on the queried channel. Also supports expressions as strings e.g `"#fc23a1"` `"*0.5"`
 
   * @returns  {number|ColorToken}
 
   */
  return (color, value = undefined) => {
    let [mode, channel] = modeChannel.split("."),
      // @ts-ignore
      colorObject = token(color, { targetMode: mode, kind: "obj" }),
      currentChannel;

    if (eq(typeof color, "object")) {
      currentChannel = or(
        and(
          isArray(color),
          or(and(eq(typeof color[0], "string"), color.slice(1)), color)[
            gmchn(mode).indexOf(channel)
          ]
        ),
        color[channel]
      );
    } else {
    }

    or(
      and(
        eq(typeof color, "object"),
        (currentChannel = or(
          and(
            isArray(color),
            or(and(eq(typeof color[0], "string"), color.slice(1)), color)[
              gmchn(mode).indexOf(channel)
            ]
          ),
          color[channel]
        ))
      ),
      (currentChannel = colorObject[channel])
    );

    if (value) {
      or(
        or(
          and(eq(typeof value, "number"), (colorObject[channel] = value)),
          exprParser(colorObject[channel], value)
        ),
        Error(
          `${typeof value}} ${value} is an unsupported value to set on a color token`
        )
      );

      // @ts-ignore
      return colorObject;
    }
    return currentChannel;
  };
}

/**
 * Checks if a color token is achromatic (without hue or simply grayscale).
 * 
 * @param {ColorToken} color The color token to test if it is achromatic or not.
 * @returns {boolean}
 * @example

import { achromatic } from "huetiful-js";

 achromatic('pink')
// false

let sample = [
  "#164100",
  "#ffff00",
  "#310000",
  'pink'
];

console.log(sample.map(achromatic));

// [false, false, false,false]

achromatic('gray')
// Returns true

// We can expand this example by interpolating between black and white and then getting some samples to iterate through.

import { interpolator } from "huetiful-js"

// we create an interpolation using black and white with 12 samples
let grays = interpolator(["black", "white"],{ num:12 });

console.log(grays.map(achromatic));

//
 [false, true, true,
  true,  true, true,
  true,  true, true,
  true,  true, false
]

 */
function achromatic(color) {
  color = token(color, { kind: "obj", targetMode: "lch" });

  // If a color has no lightness then it has no hue so its technically not achromatic since white and black are not grayscale
  let isFalsy = (x) => or(or(eq(typeof x, "undefined"), eq(x, 0)), isNaN(x));

  return or(
    and(
      and(
        or(isFalsy(color["l"]), gte(color["l"], 100)),
        or(!isFalsy(color["c"], isFalsy(color["c"])))
      ),
      false
    ),
    or(and(isFalsy(color["c"]), true), false)
  );
}

/**
 * Darkens the color by reducing the `lightness` channel by `amount` of the channel. For example `0.3` means reduce the lightness by `0.3` of the channel's current value.
 * @param {ColorToken} color The color to darken.
 * @param {number} amount The amount to darken with. The value is expected to be in the range `[0,1]`. Default is `0.1`.
 * @returns {string}
 * @example
 *
 *  import { lightness } from "huetiful-js";
 * 
 // darkening a color
console.log(lightness('blue', 0.3, true));

// '#464646'

// brightening a color, we can omit the final param 
// because it's false by default.
console.log(brighten('blue', 0.3));
//#464646


 */
function lightness(color, amount, darken = false) {
  let f = () => {
    // @ts-ignore
    let colorObject = token(color, { kind: "obj", targetMode: "lab65" });
    if (typeof amount === "number") {
      // @ts-ignore
      colorObject["l"] = (darken ? max : min)([
        100,
        colorObject["l"] + 100 * (darken ? -amount : amount),
      ]);
    }
    // @ts-ignore
    return token(colorObject);
  };
  // @ts-ignore
  return f();
}

/**
 * Parses any recognizable color to the specified `kind` of `ColorToken` type.
 *
 * The `kind` option supports the following types as options:
 *
 * * `'arr'` - Parses the color token to an array of channel values with the `colorspace` as the first element if the `omitMode` parameter is set to `false` in the `options` object.
 *
 * * `'num'` - Parses the color token to its numerical equivalent to a number between `0` and `16,777,215`.
 *
 * The `numberType` can be used to specify which type of number to return if the `kind` option is set to `'number'`:
 *  - `'hex'` - Hexadecimal number
 *  - `'bin'` - Binary number
 *  - `'oct'` - Octal number
 *  - `'expo'` - Decimal exponential notation
 *
 * * `'str'` - Parses the color token to its hexadecimal string equivalent.
 *
 * If the color token has an explicit `alpha` (specified by the `alpha` key in color objects and as the fourth and last number in a color array) the string will be 8 characters long instead of 6.
 *
 * * `'obj'` - Parses the color token to a plain color object in the `mode` specified by the `targetMode` parameter in the `options` object.
 * * `'temp'` - Parses the color token to its RGB equivalent and expects the value to be between 0 and 30,000
 *
 * @param {ColorToken} color The color token to parse or convert.
 * @param {import("../types.js").TokenOptions} options Options to customize the parsing and output behaviour.
 * @returns {ColorToken}
 */
function token(color, options = undefined) {
  /*
   * SUPPORTED COLORSPACES
   * huetiful-js does not focus on color conversion but parsing color from a myriad of sources and doing useful stuff
   * This means we only support the colorspaces we use internally. The most accessible token type is the hexadecimal. after that you're on your own
   * Colorspaces are heavy to load in the browser so expect support for certain colorspaces to be dropped
   *
   */
  const modeDefinitions = {
    hsv: modeHsv,
    rgb: modeLrgb,
    lab: modeLab,
    lch65: modeLch65,
    lab65: modeLab65,
    oklch: modeOklch,
    lch: modeLch,
    xyz: modeXyz65,
    jch: modeJch,
  };
  let {
      srcMode,
      targetMode,
      omitMode,
      kind,
      numType,
      omitAlpha,
      normalizeRgb,
    } = options || {},
    parseToken = (m, a) => useMode(modeDefinitions[m])(or(a, c2str()));

  /**
   *
   * 					* GLOBAL DEFAULTS (listed respectively to declarations)
   *
   * 							* color - if a color is a string we lowercase it
   * 							* kind - return the color as hexadecimal by default
   * 							* omitMode - return the array with the colorpace string by default
   * 							* numType - return it as an ordinary integer if numType is undefined
   * 							* srcMode - the mode the color was parsed in. Default is lch
   * 							* targetMode - the mode to output the color token in. It is ignored for hex and number
   * 							* omitAlpha - Omit the alpha channel from the color tuple. Default is false
   * 							* normalizeRgb - Normalize RGB values above 1 as if in the range [0,255] back to the [0,1] range
   */

  kind = or(kind?.toLowerCase(), "str");

  omitMode = or(omitMode, false);

  numType = or(numType?.toLowerCase(), undefined);

  srcMode = getSrcMode(color, srcMode);

  targetMode = or(targetMode, "lch");

  omitAlpha = or(omitAlpha, false);

  normalizeRgb = or(normalizeRgb, false);

  // if the color is an array turn it to an object
  /**
   * an array of channel keys from the source colorspace. If undefined it defaults to LCH
   * @type {string[]}
   */
  let channelKeys = gmchn(or(srcMode, targetMode)),
    /**
     * @type {number[]}
     * an array of channel values
     */
    channelValues = isArray(color)
      ? color?.filter((a) => eq(typeof a, "number"))
      : eq(typeof color, "object")
      ? channelKeys?.map((a) => color[a])
      : undefined,
    // if the color is an array just take the values whilst optionally omitting the colorspace (if specified)
    // step 2 get the alpha

    // check if the alpha channel is explicitly specified else cast 1 as the default

    /**
     * the alpha channel captured if it exists in the color token
     * @type{number}
     */

    alphaValue = alpha(color);

  // if its a string and has 8 or more characters (ignoring #) and is not a CSS named colortake the last two characters and convert them from hex
  let result = {};
  if (channelValues) {
    // convert the color to an object (including alpha) without the mode

    for (const channel of channelKeys) {
      result[channel] = channelValues[channelKeys.indexOf(channel)];
    }

    // color["alpha"] = eq(y?.length, 4) ? y[3] : 1;
    if (and(srcMode.includes("rgb"), normalizeRgb)) {
      /**
       *  Normalize the color back to the rgb gamut supported by culori
       * @type {boolean}
       * */
      let checkGamut = channelKeys.some((c) => gt(Math.abs(color[c]), 1));

      if (checkGamut) {
        for (const k of channelKeys) {
          result[k] /= 255;
        }
      }
    }
  } else {
    result = parseToken(targetMode);
  }

  /**
   *
   * converts any color token to an array or object equivalent
   */
  function c2col() {
    if (eq(kind, "obj")) {
      omitMode ? result : (result["mode"] = targetMode);
      omitAlpha ? result : (result["alpha"] = alphaValue);
      return result;
    } else if (eq(kind, "arr")) {
      let colorArray = [];
      for (const k of channelKeys) {
        colorArray[channelKeys.indexOf(k)] = result[k];
      }

      omitAlpha ? colorArray : colorArray.push(alphaValue);
      omitMode ? colorArray : colorArray.unshift(targetMode);
      return colorArray;
    }
  }

  /**
   *
   * converts a color token to its numerical equivalent
   */
  function c2num() {
    const rgbObject = parseToken("rgb");

    /**
     * @type {number|string}
     */
    // @ts-ignore
    const result =
      ((255 * rgbObject["r"]) << 16) +
      ((255 * rgbObject["g"]) << 8) +
      255 * rgbObject["b"];

    return or(
      and(
        numType,
        result.toString(
          { bin: 2, hex: 16, expo: 6, oct: 8 }[numType?.toLowerCase()]
        )
      ),
      result
    );
  }

  /**
   *
   * converts any color token to hexadecimal
   */
  function c2str() {
    let colorHex = {
      boolean: or(and(eq(color, true), "#ffffff"), "#000000"),
      number: num2c(),
      object: formatHex(color),
      // @ts-ignore
      string: or(colorsNamed?.color, formatHex(color)),
    }[typeof color];

    return omitAlpha ? colorHex : formatHex8(color);
  }

  /**
   *
   * converts a number to an RGB color object
   */
  function num2c() {
    // Ported from chroma-js with slight modifications
    //
    //
    return and(
      and(eq(typeof color, "number"), gte(color, 0)),
      lte(color, 0xffffff)
    )
      ? {
          // @ts-ignore
          r: (color >> 16) / 255,
          // @ts-ignore
          g: ((color >> 8) & 0xff) / 255,
          // @ts-ignore
          b: (color & 0xff) / 255,
          mode: "rgb",
        }
      : Error("unknown num color: " + color);
  }

  return {
    obj: c2col,
    arr: c2col,
    str: c2str,
    num: c2num,
  }[kind]();
}

/**
 * Gets the luminance of the passed in color token.
 * 
 * If the `amount` parameter is not passed in else it will adjust the luminance by interpolating the color with black (to decrease luminance) or white (to increase the luminance) by the specified `amount`.
 * @param { ColorToken } color The color to retrieve or adjust luminance.
 * @param { number } [amount=undefined] The amount of luminance to set. The value range is normalised between [0,1]
 * @returns { ColorToken  | number} 
 * @example
 *
 * import { luminance } from 'huetiful-js'

// Getting the luminance

console.log(luminance('#a1bd2f'))
// 0.4417749513730954

console.log(colors('all', '400').map((c) => luminance(c)));

// [
   0.3595097699638928,  0.3635745068550118,
   0.3596908494424909,  0.3662525955988395,
  0.36634113914916244, 0.32958967582076004,
  0.41393242740130043,  0.5789820793721787,
   0.6356386777636567,  0.6463720036841869,
   0.5525691083297639,  0.4961850321908156,
   0.5140644334784611,  0.4401325598899415,
  0.36299191043315415,  0.3358285501372504,
  0.34737270839643575, 0.37670102542883394,
   0.3464512307705231, 0.34012939384198054
]

// setting the luminance

let myColor = luminance('#a1bd2f', 0.5)

console.log(luminance(myColor))
// 0.4999999136285792
 */
function luminance(color, amount) {
  color = token(color);
  let result;
  if (!amount) {
    // @ts-ignore
    return wcagLuminance(color);
  } else {
    const w = "#ffffff",
      b = "#000000";

    const EPS = 1e-7;
    let MAX_ITER = 20;

    if (eq(typeof amount, "number")) {
      // compute new color using...

      const currentLuminance = wcagLuminance(color);

      //Must add the overrides object to change parameters like easings, fixups, and the mode to perform the computations in.
      // use a bilinear interpolation

      const f = (u, v) => {
        const [mid, low] = [
          interpolate([u, v])(0.5),
          // @ts-ignore
          wcagLuminance(color),
        ];

        // @ts-ignore
        if (Math.abs(amount - low > EPS) || !MAX_ITER--) {
          // close enough
          return mid;
        }

        if (gt(low, amount)) {
          return f(u, mid);
        } else {
          return f(mid, v);
        }
      };

      if (gt(currentLuminance, amount)) {
        result = f(b, color);
      } else {
        result = f(color, w);
      }
    }
    // @ts-ignore
    return token(result);
  }
}

/**
 * Gets the hue family which a color belongs to with the overtone included (if it has one.).
 * 
 * For example `'red'` or `'blue-green'`. If the color is achromatic it returns the string `'gray'`.
 * @param {ColorToken} color The color to query its shade or hue family.
 * @returns {import("../types.js").HueFamily}
 * @example
 *
 * import { family } from 'huetiful-js'


console.log(family("#310000"))
// 'red'
 */
function family(color) {
  if (neq(achromatic(color), true)) {
    let [hueAngle, hueFamilies] = [mc(`lch.h`)(color), keys(hue)];

    // @ts-ignore
    return hueFamilies.find((o) => {
      const hueRanges = customConcat(hue[o]);
      return inRange(hueAngle, min(hueRanges), max(hueRanges));
    });
  }

  // @ts-ignore
  return "gray";
}

/**
 * Returns a rough estimation of a color's temperature as either `'cool'` or `'warm'` using the `'lch'` colorspace.
 * 
 * @param {ColorToken} color The color to check the temperature.
 * @returns {'cool' | 'warm'} True if the color is cool else false.
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
function temp(color) {
  return or(
    and(
      keys(hue).some((hueFamily) =>
        inRange(
          floorCeil(mc("lch.h")(color)),
          hue[hueFamily]["cool"][0],
          hue[hueFamily]["cool"][1]
        )
      ),
      "cool"
    ),
    "warm"
  );
}

/**
 * Returns the name of the hue family which is biasing the passed in color using the `'lch'` colorspace.
 * 
 * * If an achromatic color is passed in it returns the string `'gray'`
 * * If the color has no bias it returns `false`.
 * @param {ColorToken} color The color to query its overtone.
 * @returns {string | false}
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
function overtone(color) {
  const hueFamily = family(color);

  // We check if the color can be found in the defined ranges
  // @ts-ignore
  return or(
    and(achromatic(color), "gray"),
    // @ts-ignore
    or(and(/-/.test(hueFamily), hueFamily.split("-")[1]), false)
  );
}

/**
 * Returns the complimentary color of the passed in color token. A complimentary color is 180 degrees away on the hue channel.
 * 
 * The object (if the `obj` parameter is `true`) returns:
 * 
 * * The complimentary color for the passed in color token
 * * The hue family from which the complimentary color was found.
 * 
 * The function is not guarded against achromatic colors which means no action will be done on a gray color and it will be returned as is. Pure black or white (`'#000000'` and `'#ffffff'` respectively) may return unexpected results.
 * 
 * @param {ColorToken} baseColor The color to retrieve its complimentary equivalent.
 * @param {boolean} obj Optional boolean whether to return an object with the result color's hue family or just the result color. Default is `false`.
 * @returns {ColorToken|import("../types.js").FactObject}
 * @example
 * 
 * import { complimentary } from "huetiful-js";
 *
 *
console.log(complimentary("pink", true))
//// { hue: 'blue-green', color: '#97dfd7ff' }

console.log(complimentary("purple"))
// #005700
 */
function complimentary(baseColor, obj = false) {
  const complimentaryHueAngle = adjustHue(
    mc("lch.h")(baseColor) + 180 * rand(0.965, 1)
  );

  const result = or(
    and(!achromatic(baseColor), {
      hue: family(complimentaryHueAngle),
      // @ts-ignore
      color: token(mc("lch.h")(baseColor, complimentaryHueAngle)),
    }),
    { hue: "gray", color: baseColor }
  );
  // @ts-ignore
  return (obj && result) || result["color"];
}

export {
  token,
  achromatic,
  complimentary,
  overtone,
  temp,
  family,
  alpha,
  luminance,
  lightness,
  mc,
};