/* eslint-disable no-ternary */
/**
 * @preserve 
 * @license
 * helpers.ts - Helper functions for huetiful-js.
 * Contains colors from TailwindCSS released under the MIT permissive licence.
 * Contains parts of chroma.js released under the Apache-2.0 license.
Copyright 2023 Dean Tarisai.
This file is licensed to you under the Apache License, Version 2.0 (the 'License');
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { getChannel } from './utils';
import type {
  callback,
  Factor,
  ColorToken,
  HueColorSpaces,
  Order,
  Options,
  Colorspaces
} from './types';
import modeRanges from './color-maps/samples/modeRanges';

import {
  interpolatorSplineNatural,
  fixupHueShorter,
  interpolatorSplineBasisClosed,
  interpolatorSplineMonotone,
  easingSmoothstep
} from 'culori/fn';
import { ucsConverter } from './converters';

/**
 * @internal
 *  Returns the first truthy value.
 * @param arg The value to check
 * @param def The value to cast if arg is falsy
 * @returns The first truthy value
 */
function checkArg(arg: unknown, def: unknown): unknown {
  return arg || def;
}

// Global interpolator options defaults
let {
  chromaInterpolator,
  easingFunc,
  hueFixup,
  hueInterpolator,
  lightnessInterpolator
}: Options = {};

chromaInterpolator = interpolatorSplineNatural;
hueFixup = fixupHueShorter;
hueInterpolator = interpolatorSplineBasisClosed;
easingFunc = easingSmoothstep;
lightnessInterpolator = interpolatorSplineMonotone;

const interpolatorConfig = {
  easingFunc,
  chromaInterpolator,
  hueFixup,
  hueInterpolator,
  lightnessInterpolator
};

/**
 * @internal
 *  Gets the clipped string of a passed in colorspace by removing non-channel characters.
 * @param colorspace  The colorspace to get the channel keys.
 * @param index Optional index to return a single specified channel.
 * @returns A string.
 * 
 @example

 console.log(getModeChannel("oklch"));
// lch

console.log(getModeChannel("okhsl", 2));
// l

 */
function getModeChannel(colorspace: Colorspaces | string, index?: number) {
  const result = colorspace.substring(colorspace.length - 3);

  return (index && result.charAt(index)) || result;
}

/**
 * @internal
 * Takes an arithmetic operator followed by a value and passes the result of the expression to the specified channel. Currently supports addition,subtraction,division and multiplication symbols only.
 * @param color The color.
 * @param modeChannel The colorspace channel to set.
 * @param expression The expression assignment as a string.
 * @example
 *
 * console.log(lch('blue'));
// { mode: 'lch',l: 29.568297153444703,c: 131.2014771995311,h: 301.36428148973533}

console.log(expressionParser('blue', 'lch.l', '*0.3'));
// { mode: 'lch',l: 8.87048914603341,c: 131.2014771995311,h: 301.36428148973533 }

 */
function expressionParser(
  color: ColorToken,
  modeChannel: string,
  expression: string
): number {
  // regExp to match arithmetic operator and the value
  const sign = /^(\*|\+|\-|\/)/.exec(expression)['0'],
    value = /[0-9]*\.?[0-9]+/.exec(expression)['0'];
  const [mode, channel] = modeChannel.split('.');

  // @ts-ignore
  color = ucsConverter(mode.toString().toLowerCase())(color);
  const cb = (value: string) => parseFloat(value);

  // Match an operator against the first truthy case and perform the relevant math operation
  switch (sign) {
    case '+':
      color[channel] += +cb(value);
      break;
    case '-':
      color[channel] -= +cb(value);
      break;
    case '*':
      color[channel] *= +cb(value);
      break;
    case '/':
      color[channel] /= +cb(value);
      break;
    // throw error alert
  }

  // @ts-ignore
  return color;
}

/**
 * @internal
 * @function
 * Matches the chroma/saturation channel of any compliant color space
 * @param colorspace The color space to match saturation/chroma channel. Default is Lch
 * @returns The mode channel string passed to getChannel()
 * @example
 * 
 * import { matchChromaChannel } from 'huetiful-js'
 * console.log(matchChromaChannel("jch"));
// jch.c

console.log(matchChromaChannel("okhsl"));
// okhsl.s
 */
function matchChromaChannel(colorspace: HueColorSpaces | string): string {
  // Matches any string with c or s
  colorspace = checkArg(colorspace, 'lch') as HueColorSpaces;
  const reChroma = /(s|c)/i;
  // @ts-ignore
  const ch = reChroma.exec(colorspace)['0'];

  // @ts-ignore
  if (reChroma.test(colorspace)) {
    return `${colorspace}.${ch}`;
  } else {
    throw Error(
      `The color space ${colorspace} has no chroma/saturation channel.`
    );
  }
}

/**
 * @internal
 * @function
 * Matches the lightness channel of any compliant color space
 * @param colorspace The color space to match lightness channel. Default is Lch
 * @returns The mode channel string passed to getChannel
 * 
 * @example
 * 
 * console.log(matchLightnessChannel("jch"));
// jch.j

console.log(matchLightnessChannel("okhsl"));
// okhsl.l
 */
function matchLightnessChannel(colorspace: HueColorSpaces | string): string {
  // Matches any string with c or s
  colorspace = checkArg(colorspace, 'lch') as HueColorSpaces;
  const reLightness = /(j|l)/i;
  // @ts-ignore
  const ch = reLightness.exec(colorspace)['0'];

  // @ts-ignore
  if (reLightness.test(colorspace)) {
    // @ts-ignore
    return `${colorspace}.${ch}`;
  } else {
    throw Error(`The color space ${colorspace} has no lightness channel.`);
  }
}

function colorObj(factor: Factor, callback: callback) {
  return (color: ColorToken) => {
    // @ts-ignore
    return { [factor]: callback(color), color: color };
  };
}

/**
 * @internal

 *
 * @private
 * @param {Array|Object} collection The collection to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} factor The value to compare against
 * @returns {*} Returns the found element or its key, else `undefined`.
 */
function customFindKey(collection: object, factor: number) {
  // If the color is achromatic return the string gray
  const propKeys = Object.keys(collection);

  const result: string | undefined = propKeys
    .filter((key) => {
      const hueVals = customConcat(collection[key]);
      // @ts-ignore
      const minVal = min(...hueVals);
      // @ts-ignore
      const maxVal = max(...hueVals);
      // Capture the min and max values and see if the passed in color is within that range
      return inRange(factor, minVal, maxVal);
    })
    .toString();

  return result;
}

function customConcat(hue: object): number[] {
  const res = [];
  const { keys } = Object;
  if (typeof hue == 'object') {
    const hueKeys = keys(hue);

    //@ts-ignore
    res.push(...hueKeys.map((key) => hue[key]));
  }
  // @ts-ignore
  return res.flat(1);
}

/**
 * @internal
 *
 * @param value The hue angle to normalize.
 * @returns The normalized hue angle or passed in value if it was within [0,360]
 *
 * @example
 * 
 * console.log(adjustHue(4));
// 4

console.log(adjustHue(444));
// 84
 */
function adjustHue(value: number) {
  return (value > 0 && (value += Math.ceil(-value / 360) * 360)) || value % 360;
}

/**
 * @internal
 * Returns the channel value difference between the passed in colors. They are both converted to the colorspace in the modeChannel parameter before values are computed.
 * @param color The color to subtract values from/
 * @param modeChannel The colorspace and channel string to perform the operation in.
 * @returns The difference between the color channel(s)
 * @example
 *
 *
 */
function channelDifference(color: ColorToken, modeChannel: string) {
  /**
   * @internal
   * @param subtrahend The color to use as subtrahend
   */
  return (subtrahend: ColorToken) => {
    const cb = (color: ColorToken) => getChannel(modeChannel)(color);
    if (cb(color) < cb(subtrahend)) {
      return cb(subtrahend) - cb(color);
    } else {
      return cb(color) - cb(subtrahend);
    }
  };
}

// Comparison operators
function gt(x: number, y: number): boolean {
  return x > y;
}
function lt(x: number, y: number): boolean {
  return x < y;
}
function gte(x: number, y: number): boolean {
  return x >= y;
}
function lte(x: number, y: number): boolean {
  return x <= y;
}
function eq(x: number, y: number): boolean {
  return x === y;
}
function neq(x: number, y: number): boolean {
  return !(x === y);
}

/**
 * @internal
 * @function
 *  Checks if a value is within the start and end range.
 * @param number The number to check.
 * @param start The minimum or starting value.
 * @param end The maximum or starting value.
 * @returns True if the number is in range else false.
 */

function inRange(number: number, start: number, end?: number): boolean {
  /* Built-in method references for those with the same name as other `lodash` methods. */
  Math.min;
  return number >= Math.min(start, end) && number < Math.max(start, end);
}

/**
 * @internal
 *  Checks if a number is an integer or float.
 * @param num The number to query
 * @returns True if the number is an integer else false if it is a float.
 */
function isInteger(num: number | string) {
  const reInt = /^-?[0-9]+$/;
  return reInt.test(num.toString());
}

/**
 * @internal
 * @function
 *  Normalizes passed in channel value to a range accepted by color spaces as defined in Culori.
 * @param value The value to chec if its in the accepted range for the passed in mode channel
 * @param modeChannel A string defining the mode and channel ranges to use for comparison
 * @returns The normalized channel value or the passed in value if it was within range
 */
function normalize(value: number, modeChannel: string): number {
  const [mode, channel]: string[] = modeChannel.split('.');
  const [start, end]: number[] = modeRanges[mode][channel];
  const range = inRange(value, start, end);

  if (!range) {
    if (lte(value, 1)) {
      value = end * value;
    } else {
      value = (lte(end, 100) && end * (value / 100)) || end * (value / end);
    }
  }
  return value;
}

/**
 * @internal
 * @function
 *  Returns a random number between minimum and maximum bounds.
 * @param min The lower bound.
 * @param max The upper bound.
 * @returns A number.
 */
function random(min: number, max: number): number {
  if (min > max) {
    const mn = min;
    const mx = max;
    max = mn;
    min = mx;
  } else {
    return Math.random() * (max - min) + min;
  }
}

const { ceil, floor } = Math;
/**
 * @internal
 * @function
 * Rounds up or down a number based on the float value.
 * @param num The number to round up or down.
 * @returns An integer
 * @example
 * console.log(floorCeil(1.45));
// 1
console.log(floorCeil(1.501));
// 2

 */

function floorCeil(num: number): number {
  if (!isInteger(num)) {
    const strArr = num.toString().split('.');
    const float = strArr[1];

    //If the decimal value is .4  and below it will be rounded down else it will be rounded up.
    const reFloorCeil = (float: string) => /^[0-4]$/.test(float.charAt(0));

    if (reFloorCeil(float)) {
      num = floor(num);
    } else {
      num = ceil(num);
    }
  }

  return num;
}

/**
 * @internal
 *  Helper function for native sorting method for arrays.
 * @param factor The property to query.
 * @param order Either ascending or descending.
 * @returns A sorted array.
 */
function customSort(order: Order, factor?: Factor | string) {
  //  Special thanks to deechris27 on youtube
  // a-b gives asc order & b-a gives desc order
  factor = factor || 'factor';
  return (a, b) => {
    if (order === 'asc') {
      return a[factor] - b[factor];
    } else if (order === 'desc') {
      return b[factor] - a[factor];
    }
  };
}

/*
 * @function
 * Creates a custom object with a factor to pass to the predicate function.
 * @param factor The quality being queried.
 * @param cb The callback function for computing the factor's start.
 * @returns An array of objects.
 */
function colorObjArr(factor: Factor, callback) {
  /**
   * @internal
   *
   * @param collection The array or object of colors to iterate over. If an object is passed, its values are expected to be valid color tokens.
   */
  return (
    collection: ColorToken[] | object | object
  ): Array<{ factor: Factor; color: ColorToken }> => {
    const cb = colorObj(factor, callback);
    // @ts-ignore
    return Object.keys(collection).map((color) => cb(collection[color]));
  };
}

/**
 * @internal
 * Returns the passed in value
 * @param value The value to return
 * @returns
 */
function identity(value) {
  return value;
}
function baseExtremum(array: number[], iteratee, comparator) {
  var [index, length] = [-1, array.length];

  while (++index < length) {
    var [value, current] = [array[index], iteratee(value)];

    if (
      current != null &&
      (computed === undefined
        ? current === current
        : comparator(current, computed))
    ) {
      var computed = current,
        result = value;
    }
  }
  return result;
}
/**
 * @internal
 *  Gets the smallest value in an array
 * @param array The array to retrieve minimum value
 * @returns The smallest number in the array
 * @example
 * console.log(min([0, 3, 4]));
// 0
 * 
 */
function min(array: number[]): number {
  return (
    (array && array.length && baseExtremum(array, identity, lt)) || undefined
  );
}
/**
 * @internal
 *  Gets the largest value in an array
 * @param array The array to retrieve maximum value
 * @returns The largest number in the array
 * @example
 * console.log(max([0, 3, 4]));
// 4
 */
function max(array: number[]): number {
  return (
    (array && array.length && baseExtremum(array, identity, gt)) || undefined
  );
}

/**
 * @internal
 * Gets the digits in the expression string
 * @param s The string to match
 * @returns The matched digits, if any, as a number.
 */
function matchDigits(s: string): number {
  s = s.toString();
  var reDigits = /[0-9]*\.?[0-9]+/;
  return (reDigits.test(s) && Number(reDigits.exec(s)['0'])) || undefined;
}

/**
 * @internal
 * Matches the comparison symbols used in the expression string.
 * @param s The string to match.
 * @returns The matched comparator, if any, as a string.
 */
function matchComparator(s: string): string {
  s = s.toString();
  var reComparator = /^(>=|<=|<|>|={1,2}|!={0,2})/;

  return (reComparator.test(s) && reComparator.exec(s)['0']) || undefined;
}

/**
 * @internal
 *  Filters an array of color objects with a "factor"  property whose value is determined by a predicate or getter via the cb param.
 * @param factor The property to query
 * @param callback The function to use for comparison.
 * @returns An array of colors or color objects.
 */
function sortedArr(
  factor: Factor,
  callback: callback,
  order: Order,
  colorObj = false
) {
  return (collection: ColorToken[] | object) => {
    const results: ColorToken[] | Array<{ factor: number; color: ColorToken }> =
      colorObjArr(factor, callback)(collection);

    // Assign the value of colorObj to results variable
    // Sort the array using our customSort helper function
    results.sort(customSort(order, factor));

    // colorObj parameter is true return the array of color objects
    // else just return the color's name value.
    if (colorObj) {
      return results;
    } else {
      return results.map((color) => color['color']);
    }
  };
}

/**
 * @internal
 *  Filters an array according to the value of a color's queried factor
 * @param factor The property to query and use as filtering criteria
 * @param cb The function to use for comparison
 * @returns The filtered array
 */
function filteredArr(factor: Factor, cb?: callback) {
  return (
    collection: ColorToken[] | object,
    start: number | string,
    end?: number
  ): ColorToken[] => {
    let result: ColorToken[];

    if (typeof start === 'number') {
      result = colorObjArr(
        factor,
        cb
      )(collection)
        .filter((color) => inRange(color[factor], start, end))
        .map((color) => color['color']);

      // If string split the the string to an array of signature [sign,value] with sign being the type of predicate returned to mapFilter.
    } else if (typeof start === 'string') {
      //The patterns to match

      const val = matchDigits(start),
        op = matchComparator(start);

      if (op) {
        const mapFilter = (
          test: (x: number, y: number) => boolean
        ): ColorToken[] => {
          return colorObjArr(
            factor,
            cb
          )(collection)
            .filter((el) => test(el[factor], parseFloat(val.toString())))
            .map((el) => el['color']);
        };
        // object with comparison symbols as keys
        var comparisonSymbols = {
          '!=': neq,
          '==': eq,
          '>=': gte,
          '<=': lte,
          '>': gt,
          '<': lt,
          '===': eq,
          '!==': neq
        };
        result = mapFilter(comparisonSymbols[op]);
      }
    }
    return result;
  };
}

export {
  expressionParser,
  matchLightnessChannel,
  matchChromaChannel,
  min,
  max,
  customSort,
  colorObjArr,
  sortedArr,
  filteredArr,
  customFindKey,
  colorObj,
  customConcat,
  inRange,
  random,
  isInteger,
  floorCeil,
  adjustHue,
  channelDifference,
  lt,
  neq,
  gt,
  gte,
  lte,
  eq,
  normalize,
  checkArg,
  getModeChannel,
  interpolatorConfig,
  matchComparator,
  matchDigits
};
