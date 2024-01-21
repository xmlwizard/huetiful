/* 
 * @license
 * colors.ts - Colors and schemes for huetiful-js.
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

import tailwindHues from './color-maps/swatches/tailwind.ts';
import type {
  SequentialScheme,
  DivergingScheme,
  QualitativeScheme,
  TailwindColorFamilies,
  ScaleValues,
  ColorDistanceOptions,
  ColorToken,
  HueColorSpaces,
  InterpolatorOptions,
  ColorOptions,
  EarthtoneOptions,
  HueFamily,
  HueShiftOptions,
  PairedSchemeOptions
} from './types';

import * as filterBy from './filterBy';
import * as sortBy from './sortBy';
import {
  discoverPalettes as nativeDiscoverPalettes,
  getFarthestHue as nativeMaxHue,
  getNearestHue as nativeMinHue,
  getNearestLightness as nativeMaxLightness,
  getFarthestLightness as nativeMinLightness,
  alpha as nativeAlpha,
  brighten as nativeBrighten,
  darken as nativeDarken,
  isAchromatic as nativeIsAchromatic,
  isCool as nativeIsCool,
  isWarm as nativeIsWarm,
  getFarthestChroma as nativeGetFarthestChroma,
  getFarthestHue as nativeGetFarthestHue,
  getFarthestLightness as nativeGetFarthestLightness,
  getNearestHue as nativeGetNearestHue,
  getNearestChroma as nativeGetNearestChroma,
  getNearestLightness as nativeGetNearestLightness,
  overtone as nativeOvertone,
  toHex as nativeToHex,
  getChannel as nativeGetChannel,
  getContrast,
  getLuminance,
  setChannel as nativeSetChannel,
  setLuminance,
  checkArg,
  matchChromaChannel,
  scheme as nativeScheme,
  pastel as nativePastel,
  hueShift as nativeHueShift,
  getHueFamily as nativeGetHue,
  pairedScheme as nativePairedScheme,
  earthtone as nativeEarthtone,
  getComplimentaryHue as nativeGetComplimentaryHue,
  colorDeficiency as nativeColorDeficiency,
  interpolator,
  interpolateSpline as nativeInterpolatorSpline
} from './index';

import { interpolatorConfig } from './helpers';

class ColorArray {
  constructor(colors: ColorToken[]) {
    this['colors'] = colors;
    return this;
  }

  /**
   *
   *  Returns a spline based interpolator function with customizable interpolation methods (passed in as 'kind') and optional channel specific overrides.If a color has a falsy channel for example black has an undefined hue channel some interpolation methods may return NaN affecting the final result.
   * @param colorspace The colorspace to perform the color space in. Prefer uniform color spaces for better results such as Lch or Jch.
   * @param kind The type of the spline interpolation method. Default is basis.
   * @param closed Optional parameter to return the 'closed' variant of the 'kind' of interpolation method which can be useful for cyclical color scales. Default is false
   * @param options Optional channel specific overrides.
   * @returns A hexadecimal representation of the resultant color.
   */
  interpolateSpline(
    colorspace?: HueColorSpaces,
    samples?: number,
    kind?: 'natural' | 'monotone' | 'basis',
    closed?: boolean,
    options?: InterpolatorOptions
  ): ColorToken[] {
    this['colors'] = nativeInterpolatorSpline(
      this['colors'],
      colorspace,
      samples,
      kind,
      closed,
      options
    );
    // @ts-ignore
    return this;
  }

  /**
 * 
 *  Takes an array of colors and finds the best matches for a set of predefined palettes. The function does not work on achromatic colors, you may use isAchromatic to filter grays from your collection before passing it to the function.
 * @param schemeType (Optional) The palette type you want to return.
 * @returns An array of colors if the scheme parameter is specified else it returns an object of all the palette types as keys and their values as an array of colors. If no colors are valid for the palette types it returns an empty array for the palette results.
 * @example
 * 
 * import { discoverPalettes } from 'huetiful-js'

let sample = [
  "#ffff00",
  "#00ffdc",
  "#00ff78",
  "#00c000",
  "#007e00",
  "#164100",
  "#720000",
  "#600000",
  "#4e0000",
  "#3e0000",
  "#310000",
]

console.log(load(sample).discoverPalettes(sample, "tetradic").output())
// [ '#ffff00ff', '#00ffdcff', '#310000ff', '#720000ff' ]
 */
  discoverPalettes(
    schemeType?: 'analogous' | 'triadic' | 'tetradic' | 'complementary'
  ): ColorToken[] | object {
    this['colors'] = nativeDiscoverPalettes(this['colors'], schemeType);
    return this;
  }

  /**
 *
 *  Gets the largest hue value from the passed in colors.
 * @param colorSpace The mode color space to perform the computation in.
 * @param colorObj Optional boolean that makes the function return a custom object with factor (hue) and name of the color as keys. Default is false.
 * @returns The largest hue value in the colors passed in or a custom object.
 * @example
 * 
 * import { getFarthestHue } from 'huetiful-js'
let sample = ['b2c3f1', '#a1bd2f', '#f3bac1']

console.log(load(output).getFarthestHue('lch'))
// 273.54920266436477
 */
  getFarthestHue(
    colorSpace?: HueColorSpaces,
    colorObj = false
  ): number | { factor: number; color: ColorToken } {
    return nativeMaxHue(this['colors'], colorSpace, colorObj);
  }

  /**
 *
 *  Gets the smallest hue value from the passed in colors.
 * @param colors The array of colors to query the color with the smallest hue value.
 * @param colorSpace The mode color space to perform the computation in.
 * @param colorObj Optional boolean that makes the function return a custom object with factor (hue) and name of the color as keys. Default is false.
 * @returns The smallest hue value in the colors passed in or a custom object.
 * @example
 * 
 * import { getNearestHue } from 'huetiful-js'

let sample = ['b2c3f1', '#a1bd2f', '#f3bac1']

console.log(load(sample).getNearestHue('lch'))
// 12.462831644544274
 */
  getNearestHue(
    colorSpace?: HueColorSpaces,
    colorObj = false
  ): number | { factor: number; color: ColorToken } {
    return nativeMinHue(this['colors'], colorSpace, colorObj);
  }

  /**
 *
 *  Gets the smallest lightness value from the passed in colors.
 * @param colorObj Optional boolean that makes the function return a custom object with factor (lightness) and name of the color as keys. Default is false.
 * @returns The smallest lightness value in the colors passed in or a custom object.
 * @example
 * 
 * import { minLightness } from 'huetiful-js'

let sample = ["b2c3f1", "#a1bd2f", "#f3bac1"]

console.log(load(sample).getNearestLightness('lch', true))

// { lightness: 72.61647882089876, name: '#a1bd2f' }

 */
  getNearestLightness(
    colorspace?: HueColorSpaces,
    colorObj = false
  ): number | { factor: number; color: ColorToken } {
    return nativeMinLightness(this['colors'], colorspace, colorObj);
  }

  /**
 *
 *  Gets the largest lightness value from the passed in colors.
 * @param colors The array of colors to query the color with the largest lightness value.
 * @param colorObj Optional boolean that makes the function return a custom object with factor (lightness) and name of the color as keys. Default is false.
 * @returns The largest lightness value in the colors passed in or a custom object.
 * @example 
 * 
 * import { maxLightness } from 'huetiful-js'

let sample = ["b2c3f1", "#a1bd2f", "#f3bac1"]

console.log(load(sample).getFarthestLightness('lch', true))

// { lightness: 80.94668903360088, name: '#f3bac1' }

 */
  getFarthestLightness(
    colorspace?: HueColorSpaces,
    colorObj = false
  ): number | { factor: number; color: ColorToken } {
    return nativeMaxLightness(this['colors'], colorspace, colorObj);
  }

  /**
 * 
 *  Returns an array of colors in the specified saturation range. The range is normalised to [0,1].
 * @param  startSaturation The minimum end of the saturation range.
 * @param  endSaturation The maximum end of the saturation range.
 * @param mode The color space to fetch the saturation value from. Any color space with a chroma channel e.g 'lch' or 'hsl' will do.
 * @returns Array of filtered colors.
 * @example
 * import { filterByContrast } from 'huetiful-js'

let sample = [
  '#00ffdc',
  '#00ff78',
  '#00c000',
  '#007e00',
  '#164100',
  '#ffff00',
  '#310000',
  '#3e0000',
  '#4e0000',
  '#600000',
  '#720000',
]

console.log(filterByContrast(sample, 'green', '>=3'))
// [ '#00ffdc', '#00ff78', '#ffff00', '#310000', '#3e0000', '#4e0000' ]
 */

  filterBySaturation(
    startSaturation = 0.05,
    endSaturation = 1,
    mode?: HueColorSpaces
  ): ColorArray {
    // @ts-ignore

    this['colors'] = filterBy.filterBySaturation(
      this['colors'],
      startSaturation,
      endSaturation,
      mode
    );
    return this;
  }

  /**
 * 
 *  Returns an array of colors in the specified lightness range. The range is between 0 and 100.
 * @param  startLightness The minimum end of the lightness range.
 * @param  endLightness The maximum end of the lightness range.
 * @returns Array of filtered colors.
 * @example
 * 
 * import { filterByLightness } from 'huetiful-js'
let sample = [
  '#00ffdc',
  '#00ff78',
  '#00c000',
  '#007e00',
  '#164100',
  '#ffff00',
  '#310000',
  '#3e0000',
  '#4e0000',
  '#600000',
  '#720000',
]

filterByLightness(sample, 20, 80)

// [ '#00c000', '#007e00', '#164100', '#720000' ]
 */
  filterByLightness(startLightness = 5, endLightness = 100): ColorArray {
    this['colors'] = filterBy.filterByLightness(
      this['colors'],
      startLightness,
      endLightness
    );
    return this;
  }
  /**
 * 
 *  Returns an array of colors with the specified distance range. The distance is tested against a comparison color (the 'against' param) and the specified distance ranges.
 * @param  startDistance The minimum end of the distance range.
 * @param  endDistance The maximum end of the distance range.
 * @param weights The weighting values to pass to the Euclidean function. Default is [1,1,1,0].
 * @param mode The color space to calculate the distance in .
 * @returns Array of filtered colors.
 * @example
 * import { filterByDistance } from 'huetiful-js'

let sample = [
  "#ffff00",
  "#00ffdc",
  "#00ff78",
  "#00c000",
  "#007e00",
  "#164100",
  "#720000",
  "#600000",
]

console.log(filterByDistance(sample, "yellow", 0.1))
// [ '#ffff00' ]
 */

  filterByDistance(
    against: ColorToken,
    startDistance = 0.05,
    endDistance?: number
  ): ColorArray {
    this['colors'] = filterBy.filterByDistance(
      this['colors'],
      against,
      startDistance,
      endDistance
    );
    return this;
  }

  /**
   * 
 * 
 *  Returns an array of colors with the specified contrast range. The contrast is tested against a comparison color (the 'against' param) and the specified contrast ranges.
 * @param  startContrast The minimum end of the contrast range.
 * @param  endContrast The maximum end of the contrast range.
 * @returns Array of filtered colors.
 * 
 * @example
 * 
 * import { filterByContrast } from 'huetiful-js'

let sample = [
  '#00ffdc',
  '#00ff78',
  '#00c000',
  '#007e00',
  '#164100',
  '#ffff00',
  '#310000',
  '#3e0000',
  '#4e0000',
  '#600000',
  '#720000',
]

console.log(filterByContrast(sample, 'green', '>=3'))
// [ '#00ffdc', '#00ff78', '#ffff00', '#310000', '#3e0000', '#4e0000' ]
 */

  filterByContrast(
    against: ColorToken,
    startContrast = 0.05,
    endContrast?: number
  ): ColorArray {
    this['colors'] = filterBy.filterByContrast(
      this['colors'],
      against,
      startContrast,
      endContrast
    );

    return this;
  }
  /**
 * 
 *  Returns colors in the specified hue ranges between 0 to 360.
 * @param  startHue The minimum end of the hue range.
 * @param  endHue The maximum end of the hue range.
 * @returns  Array of the filtered colors.
 * @example
 * let sample = [
  '#00ffdc',
  '#00ff78',
  '#00c000',
  '#007e00',
  '#164100',
  '#ffff00',
  '#310000',
  '#3e0000',
  '#4e0000',
  '#600000',
  '#720000',
]

filterByHue(sample, 20, 80)

// [ '#310000', '#3e0000', '#4e0000', '#600000', '#720000' ]
 */

  filterByHue(startHue = 0, endHue = 360): ColorArray {
    this['colors'] = filterBy.filterByHue(this['colors'], startHue, endHue);
    return this;
  }
  /**
 *  
 *  Returns an array of colors in the specified luminance range. The range is normalised to [0,1].
 * @param  startLuminance The minimum end of the luminance range.
 * @param  endLuminance The maximum end of the luminance range.
 * @returns Array of filtered colors.
 * @example
 * 
 * import { filterByLuminance } from 'huetiful-js'
let sample = [
  '#00ffdc',
  '#00ff78',
  '#00c000',
  '#007e00',
  '#164100',
  '#ffff00',
  '#310000',
  '#3e0000',
  '#4e0000',
  '#600000',
  '#720000',
]

filterByLuminance(sample, 0.4, 0.9)

// [ '#00ffdc', '#00ff78' ]
 */

  filterByLuminance(startLuminance = 0.05, endLuminance = 1): ColorArray {
    this['colors'] = filterBy.filterByLuminance(
      this['colors'],
      startLuminance,
      endLuminance
    );
    return this;
  }

  /**
 * 
 *  Sorts colors according to their lightness.
 * @param  colors The array of colors to sort
 * @param  order The expected order of arrangement. Either 'asc' or 'desc'. Default is ascending ('asc')
 * @returns An array of the sorted color values.
 * @example
 * import { sortByLightness } from "huetiful-js";

let sample = [
  "#00ffdc",
  "#00ff78",
  "#00c000",
  "#007e00",
  "#164100",
  "#ffff00",
  "#310000",
  "#3e0000",
  "#4e0000",
  "#600000",
  "#720000",
]

sortByLightness(sample)

// [
  '#310000', '#3e0000',
  '#4e0000', '#600000',
  '#720000', '#164100',
  '#007e00', '#00c000',
  '#00ff78', '#00ffdc',
  '#ffff00'
]


sortByLightness(sample,'desc')

// [
  '#ffff00', '#00ffdc',
  '#00ff78', '#00c000',
  '#007e00', '#164100',
  '#720000', '#600000',
  '#4e0000', '#3e0000',
  '#310000'
]

 */

  sortByLightness(order?: 'asc' | 'desc'): ColorArray {
    // @ts-ignore

    this['colors'] = sortBy.sortByLightness(this['colors'], order);
    return this;
  }
  /**
 * 
 *  Sorts colors according to their Euclidean distance. The distance factor is determined by the color space used (some color spaces are not symmetrical meaning that the distance between colorA and colorB is not equal to the distance between colorB and colorA ). The distance is computed from against a color which is used for comparison for all the colors in the array i.e it sorts the colors against the dist
 * @param against The color to compare the distance with. All the distances are calculated between this color and the ones in the colors array.
 * @param  order The expected order of arrangement. Either 'asc' or 'desc'. Default is ascending ('asc')
 * @param weights The weighting values to pass to the Euclidean function. Default is [1,1,1,0].
 * @param mode The color space to calculate the distance in . The default is the cylindrical variant of the CIELUV colorspace ('lchuv')
 * @returns An array of the sorted color values.
 * @example
 * import { sortByDistance } from 'huetiful-js'

let sample = ['purple', 'green', 'red', 'brown']
console.log(
  sortByDistance(sample, 'yellow', 'asc', {
    mode: 'lch',
  })
)

// [ 'brown', 'red', 'green', 'purple' ]

let sample = ['purple', 'green', 'red', 'brown']
console.log(
  sortByDistance(sample, 'yellow', 'asc', {
    mode: 'lch',
  })
)

// [ 'green', 'brown', 'red', 'purple' ]
 */

  sortByDistance(
    against: ColorToken,
    order?: 'asc' | 'desc',
    options?: ColorDistanceOptions
  ): ColorArray {
    this['colors'] = sortBy.sortByDistance(
      this['colors'],
      against,
      order,
      options
    );

    return this;
  }

  /**
 * 
 *  Sorts colors according to the relative brightness as defined by WCAG definition.
 * @param  colors The array of colors to sort
 * @param  order The expected order of arrangement. Either 'asc' or 'desc'. Default is ascending ('asc')
 * @returns An array of the sorted color values.
 * @example
 * import { sortByLuminance } from "huetiful-js";
let sample = [
  "#00ffdc",
  "#00ff78",
  "#00c000",
  "#007e00",
  "#164100",
  "#ffff00",
  "#310000",
  "#3e0000",
  "#4e0000",
  "#600000",
  "#720000",
];



let sorted = sortByLuminance(sample)
console.log(sorted)
// [
  '#310000', '#3e0000',
  '#4e0000', '#600000',
  '#720000', '#164100',
  '#007e00', '#00c000',
  '#00ff78', '#00ffdc',
  '#ffff00'
]

let sortedDescending = sortByLuminance(sample, "desc");
console.log(sortedDescending)
// [
  '#ffff00', '#00ffdc',
  '#00ff78', '#00c000',
  '#007e00', '#164100',
  '#720000', '#600000',
  '#4e0000', '#3e0000',
  '#310000'
]

 
 */

  sortByLuminance(order?: 'asc' | 'desc'): ColorArray {
    this['colors'] = sortBy.sortByLuminance(this['colors'], order);
    return this;
  }
  /**
 * 
 *  Sorts colors according to their saturation.
 * @param  colors The array of colors to sort
 * @param  order The expected order of arrangement. Either 'asc' or 'desc'. Default is ascending ('asc')
 * @param mode The mode color space to compute the saturation value in. The default is jch .
 * @returns An array of the sorted color values.
 * @example
 * import { sortBySaturation } from "huetiful-js";
let sample = [
  "#00ffdc",
  "#00ff78",
  "#00c000",
  "#007e00",
  "#164100",
  "#ffff00",
  "#310000",
  "#3e0000",
  "#4e0000",
  "#600000",
  "#720000",
];

let sorted = sortBySaturation(sample);
console.log(sorted);

// [
  '#310000', '#3e0000',
  '#164100', '#4e0000',
  '#600000', '#720000',
  '#00ffdc', '#007e00',
  '#00ff78', '#00c000',
  '#ffff00'
]

let sortedDescending = sortBySaturation(sample,'desc');
console.log(sortedDescending)
// [
  '#ffff00', '#00c000',
  '#00ff78', '#007e00',
  '#00ffdc', '#720000',
  '#600000', '#4e0000',
  '#164100', '#3e0000',
  '#310000'
]

 */

  sortBySaturation(order: 'asc' | 'desc', mode?: HueColorSpaces): ColorArray {
    this['colors'] = sortBy.sortBySaturation(this['colors'], order, mode);
    return this;
  }

  /**
 * 
 *  Sorts colors according to their contrast value as defined by WCAG. The contrast is tested against a comparison color (the 'against' param)
 * @param  colors The array of colors to sort
 * @param  order The expected order of arrangement. Either 'asc' or 'desc'. Default is ascending ('asc')
 * @returns An array of the sorted color values.
 * @example
 * 
 * import { sortByContrast } from 'huetiful-js'

let sample = ['purple', 'green', 'red', 'brown']
console.log(sortByContrast(sample, 'yellow'))
// [ 'red', 'green', 'brown', 'purple' ]

console.log(sortByContrast(sample, 'yellow', 'desc'))
// [ 'purple', 'brown', 'green', 'red' ]
 
 */

  sortByContrast(against: ColorToken, order?: 'asc' | 'desc'): ColorArray {
    this['colors'] = sortBy.sortByContrast(this['colors'], against, order);
    return this;
  }
  /**
 * 
 *  Sorts colors according to hue values. It works with any color space with a hue channel. Note that hue values between HSL and Lch do not align. Achromatic colors are not supported
 * @param order The expected order of arrangement. Either 'asc' or 'desc'. Default is ascending ('asc')
* @param colorspace The color space to compute the color distances in. All colors within the collection will be converted to mode. Also note that because differences in hue mapping certain color spaces such as HSL and LCH hue values do not align. Keep such quirks in mind to avoid weird results. 
* @returns  An array of the sorted color values.
 * @example
 * let sample = [
  "#00ffdc",
  "#00ff78",
  "#00c000",
  "#007e00",
  "#164100",
  "#ffff00",
  "#310000",
  "#3e0000",
  "#4e0000",
  "#600000",
  "#720000",
];


let sorted = sortByHue(sample);
console.log(sorted)
// [
  '#310000', '#3e0000',
  '#4e0000', '#600000',
  '#720000', '#ffff00',
  '#164100', '#00c000',
  '#007e00', '#00ff78',
  '#00ffdc'
]

let sortedDescending = sortByHue(sample,'desc');
console.log(sortedDescending)
// [
  '#00ffdc', '#00ff78',
  '#007e00', '#00c000',
  '#164100', '#ffff00',
  '#720000', '#600000',
  '#4e0000', '#3e0000',
  '#310000'
]

 */

  // Todo: Add the mode param so that users can select mode to work with. The default is lch
  sortByHue(order: 'asc' | 'desc', colorspace: HueColorSpaces): ColorArray {
    this['colors'] = sortBy.sortByHue(this['colors'], order, colorspace);
    return this;
  }

  /**
   * @method
   * @returns Returns the result value from the chain.
   */
  output(): ColorToken {
    return this['colors'];
  }
}

/**
 * @class
 *  A class that takes an array of colors and exposes all the utilities that handle collections of colors as methods. The methods can be chained as long as `this` being returned can be iterated on. Works like Array object.
 * @param colors An array of colors to chain the array methods on. Every element in the array will be parsed as a color token.
 */
function load(colors: ColorToken[]): ColorArray {
  return new ColorArray(colors);
}

//Check if the scheme object has the passed in scheme
function schemeMapper(scheme: string, schemesObject: object): ColorToken[] {
  const cb = (str: string) => str.toLowerCase();
  const { keys } = Object;
  // Map all schemes keys to lower case
  const schemeOptions = keys(schemesObject).map(cb);

  scheme = cb(scheme);
  // Check if passed in scheme is available
  if (schemeOptions.indexOf(scheme) > -1) {
    return schemesObject[scheme];
  } else {
    // Else throw error:Invalid scheme
    throw Error(`${scheme} is an invalid scheme option.`);
  }
}

/**
 * 
 *  A wrapper function for ColorBrewer's map of sequential color schemes.
 * @param scheme The name of the scheme
 * @returns An array of colors in hex represantation.
 * @example
 * import { sequential } from 'huetiful-js


console.log(sequential("OrRd"))

// [
  '#fff7ec', '#fee8c8',
  '#fdd49e', '#fdbb84',
  '#fc8d59', '#ef6548',
  '#d7301f', '#b30000',
  '#7f0000'
]



 */
function sequential(scheme: SequentialScheme): ColorToken[] {
  const schemes = {
    OrRd: [
      '#fff7ec',
      '#fee8c8',
      '#fdd49e',
      '#fdbb84',
      '#fc8d59',
      '#ef6548',
      '#d7301f',
      '#b30000',
      '#7f0000'
    ],
    PuBu: [
      '#fff7fb',
      '#ece7f2',
      '#d0d1e6',
      '#a6bddb',
      '#74a9cf',
      '#3690c0',
      '#0570b0',
      '#045a8d',
      '#023858'
    ],
    BuPu: [
      '#f7fcfd',
      '#e0ecf4',
      '#bfd3e6',
      '#9ebcda',
      '#8c96c6',
      '#8c6bb1',
      '#88419d',
      '#810f7c',
      '#4d004b'
    ],
    Oranges: [
      '#fff5eb',
      '#fee6ce',
      '#fdd0a2',
      '#fdae6b',
      '#fd8d3c',
      '#f16913',
      '#d94801',
      '#a63603',
      '#7f2704'
    ],
    BuGn: [
      '#f7fcfd',
      '#e5f5f9',
      '#ccece6',
      '#99d8c9',
      '#66c2a4',
      '#41ae76',
      '#238b45',
      '#006d2c',
      '#00441b'
    ],
    YlOrBr: [
      '#ffffe5',
      '#fff7bc',
      '#fee391',
      '#fec44f',
      '#fe9929',
      '#ec7014',
      '#cc4c02',
      '#993404',
      '#662506'
    ],
    YlGn: [
      '#ffffe5',
      '#f7fcb9',
      '#d9f0a3',
      '#addd8e',
      '#78c679',
      '#41ab5d',
      '#238443',
      '#006837',
      '#004529'
    ],
    Reds: [
      '#fff5f0',
      '#fee0d2',
      '#fcbba1',
      '#fc9272',
      '#fb6a4a',
      '#ef3b2c',
      '#cb181d',
      '#a50f15',
      '#67000d'
    ],
    RdPu: [
      '#fff7f3',
      '#fde0dd',
      '#fcc5c0',
      '#fa9fb5',
      '#f768a1',
      '#dd3497',
      '#ae017e',
      '#7a0177',
      '#49006a'
    ],
    Greens: [
      '#f7fcf5',
      '#e5f5e0',
      '#c7e9c0',
      '#a1d99b',
      '#74c476',
      '#41ab5d',
      '#238b45',
      '#006d2c',
      '#00441b'
    ],
    YlGnBu: [
      '#ffffd9',
      '#edf8b1',
      '#c7e9b4',
      '#7fcdbb',
      '#41b6c4',
      '#1d91c0',
      '#225ea8',
      '#253494',
      '#081d58'
    ],
    Purples: [
      '#fcfbfd',
      '#efedf5',
      '#dadaeb',
      '#bcbddc',
      '#9e9ac8',
      '#807dba',
      '#6a51a3',
      '#54278f',
      '#3f007d'
    ],
    GnBu: [
      '#f7fcf0',
      '#e0f3db',
      '#ccebc5',
      '#a8ddb5',
      '#7bccc4',
      '#4eb3d3',
      '#2b8cbe',
      '#0868ac',
      '#084081'
    ],
    Greys: [
      '#ffffff',
      '#f0f0f0',
      '#d9d9d9',
      '#bdbdbd',
      '#969696',
      '#737373',
      '#525252',
      '#252525',
      '#000000'
    ],
    YlOrRd: [
      '#ffffcc',
      '#ffeda0',
      '#fed976',
      '#feb24c',
      '#fd8d3c',
      '#fc4e2a',
      '#e31a1c',
      '#bd0026',
      '#800026'
    ],
    PuRd: [
      '#f7f4f9',
      '#e7e1ef',
      '#d4b9da',
      '#c994c7',
      '#df65b0',
      '#e7298a',
      '#ce1256',
      '#980043',
      '#67001f'
    ],
    Blues: [
      '#f7fbff',
      '#deebf7',
      '#c6dbef',
      '#9ecae1',
      '#6baed6',
      '#4292c6',
      '#2171b5',
      '#08519c',
      '#08306b'
    ],
    PuBuGn: [
      '#fff7fb',
      '#ece2f0',
      '#d0d1e6',
      '#a6bddb',
      '#67a9cf',
      '#3690c0',
      '#02818a',
      '#016c59',
      '#014636'
    ],
    Viridis: [
      '#440154',
      '#482777',
      '#3f4a8a',
      '#31678e',
      '#26838f',
      '#1f9d8a',
      '#6cce5a',
      '#b6de2b',
      '#fee825'
    ]
  };

  return schemeMapper(scheme, schemes);
}

/**
 * 
 *  A wrapper function for ColorBrewer's map of diverging color schemes.
 * @param scheme The name of the scheme.
 * @returns An array of colors in hex represantation.
 * @example
 * 
 * import { diverging } from 'huetiful-js'



console.log(diverging("Spectral"))
//[
  '#7fc97f', '#beaed4',
  '#fdc086', '#ffff99',
  '#386cb0', '#f0027f',
  '#bf5b17', '#666666'
]
 */

function diverging(scheme: DivergingScheme): ColorToken[] {
  const schemes = {
    Spectral: [
      '#9e0142',
      '#d53e4f',
      '#f46d43',
      '#fdae61',
      '#fee08b',
      '#ffffbf',
      '#e6f598',
      '#abdda4',
      '#66c2a5',
      '#3288bd',
      '#5e4fa2'
    ],
    RdYlGn: [
      '#a50026',
      '#d73027',
      '#f46d43',
      '#fdae61',
      '#fee08b',
      '#ffffbf',
      '#d9ef8b',
      '#a6d96a',
      '#66bd63',
      '#1a9850',
      '#006837'
    ],
    RdBu: [
      '#67001f',
      '#b2182b',
      '#d6604d',
      '#f4a582',
      '#fddbc7',
      '#f7f7f7',
      '#d1e5f0',
      '#92c5de',
      '#4393c3',
      '#2166ac',
      '#053061'
    ],
    PiYG: [
      '#8e0152',
      '#c51b7d',
      '#de77ae',
      '#f1b6da',
      '#fde0ef',
      '#f7f7f7',
      '#e6f5d0',
      '#b8e186',
      '#7fbc41',
      '#4d9221',
      '#276419'
    ],
    PRGn: [
      '#40004b',
      '#762a83',
      '#9970ab',
      '#c2a5cf',
      '#e7d4e8',
      '#f7f7f7',
      '#d9f0d3',
      '#a6dba0',
      '#5aae61',
      '#1b7837',
      '#00441b'
    ],
    RdYlBu: [
      '#a50026',
      '#d73027',
      '#f46d43',
      '#fdae61',
      '#fee090',
      '#ffffbf',
      '#e0f3f8',
      '#abd9e9',
      '#74add1',
      '#4575b4',
      '#313695'
    ],
    BrBG: [
      '#543005',
      '#8c510a',
      '#bf812d',
      '#dfc27d',
      '#f6e8c3',
      '#f5f5f5',
      '#c7eae5',
      '#80cdc1',
      '#35978f',
      '#01665e',
      '#003c30'
    ],
    RdGy: [
      '#67001f',
      '#b2182b',
      '#d6604d',
      '#f4a582',
      '#fddbc7',
      '#ffffff',
      '#e0e0e0',
      '#bababa',
      '#878787',
      '#4d4d4d',
      '#1a1a1a'
    ],
    PuOr: [
      '#7f3b08',
      '#b35806',
      '#e08214',
      '#fdb863',
      '#fee0b6',
      '#f7f7f7',
      '#d8daeb',
      '#b2abd2',
      '#8073ac',
      '#542788',
      '#2d004b'
    ]
  };

  return schemeMapper(scheme, schemes);
}

/**
 * 
 *  A wrapper function for ColorBrewer's map of qualitative color schemes.
 * @param scheme The name of the scheme
 * @returns An array of colors in hex represantation.
 * @example
 * 
 * import { qualitative } from 'huetiful-js'


console.log(qualitative("Accent"))
// [
  '#7fc97f', '#beaed4',
  '#fdc086', '#ffff99',
  '#386cb0', '#f0027f',
  '#bf5b17', '#666666'
]

 */

function qualitative(scheme: QualitativeScheme): ColorToken[] {
  const schemes = {
    Set2: [
      '#66c2a5',
      '#fc8d62',
      '#8da0cb',
      '#e78ac3',
      '#a6d854',
      '#ffd92f',
      '#e5c494',
      '#b3b3b3'
    ],
    Accent: [
      '#7fc97f',
      '#beaed4',
      '#fdc086',
      '#ffff99',
      '#386cb0',
      '#f0027f',
      '#bf5b17',
      '#666666'
    ],
    Set1: [
      '#e41a1c',
      '#377eb8',
      '#4daf4a',
      '#984ea3',
      '#ff7f00',
      '#ffff33',
      '#a65628',
      '#f781bf',
      '#999999'
    ],
    Set3: [
      '#8dd3c7',
      '#ffffb3',
      '#bebada',
      '#fb8072',
      '#80b1d3',
      '#fdb462',
      '#b3de69',
      '#fccde5',
      '#d9d9d9',
      '#bc80bd',
      '#ccebc5',
      '#ffed6f'
    ],
    Dark2: [
      '#1b9e77',
      '#d95f02',
      '#7570b3',
      '#e7298a',
      '#66a61e',
      '#e6ab02',
      '#a6761d',
      '#666666'
    ],
    Paired: [
      '#a6cee3',
      '#1f78b4',
      '#b2df8a',
      '#33a02c',
      '#fb9a99',
      '#e31a1c',
      '#fdbf6f',
      '#ff7f00',
      '#cab2d6',
      '#6a3d9a',
      '#ffff99',
      '#b15928'
    ],
    Pastel2: [
      '#b3e2cd',
      '#fdcdac',
      '#cbd5e8',
      '#f4cae4',
      '#e6f5c9',
      '#fff2ae',
      '#f1e2cc',
      '#cccccc'
    ],
    Pastel1: [
      '#fbb4ae',
      '#b3cde3',
      '#ccebc5',
      '#decbe4',
      '#fed9a6',
      '#ffffcc',
      '#e5d8bd',
      '#fddaec',
      '#f2f2f2'
    ]
  };
  return schemeMapper(scheme, schemes);
}

/**
 * 
 *  A wrapper function for the default Tailwind palette. If called with both parameters it return the hex code at the specified shade and value. Else, if called with the shade parameter as "all" it will return all colors from the shades in the palette map at the specified value (if value is undefined it will default to "500"). When called with the shade parameter only it will return all the colors from 100 to 900 of the specified shade.
 * @param shade Any shade in the default TailwindCSS palette e.g amber,blue.
 * @param value Any value from 100 to 900 in increments of 100 e.g "200".
 * @returns color Returns a hex code string or array of hex codes depending on how the function is called.
 * @example
 * 
 * import { colors } from "huetiful-js";

let all300 = colors("all", 300);

console.log(all300)
//[
  '#cbd5e1', '#d1d5db', '#d4d4d8',
  '#d4d4d4', '#d6d3d1', '#fca5a5',
  '#fdba74', '#fcd34d', '#fde047',
  '#bef264', '#86efac', '#6ee7b7',
  '#5eead4', '#7dd3fc', '#93c5fd',
  '#c4b5fd', '#d8b4fe', '#f0abfc',
  '#f9a8d4', '#fda4af'
]

let red = colors("red");
console.log(red);

// [
  '#fef2f2', '#fee2e2',
  '#fecaca', '#fca5a5',
  '#f87171', '#ef4444',
  '#dc2626', '#b91c1c',
  '#991b1b', '#7f1d1d'
]

let red100 = colors("red", 100);

console.log(red100)
// #fee2e2
 */
function colors(
  shade: TailwindColorFamilies | 'all',
  value?: ScaleValues
): ColorToken | ColorToken[] {
  const { keys } = Object;
  const defaultHue = 'all';
  const hueKeys = keys(tailwindHues);

  // @ts-ignore
  shade = shade.toLowerCase();
  // First do an AND check on hue and val params. If true return the hue at the specified value.
  // If only the hue is defined return the whole array of hex codes for that color.
  // If only the value is defined return that color value for every hue.
  // @ts-ignore
  if (shade === defaultHue) {
    return hueKeys.map((color) => tailwindHues[color][value || '500']);
  } else if (hueKeys.some((hue) => hue === shade) && value) {
    return tailwindHues[shade][value];
  } else if (shade && typeof value == 'undefined') {
    const keyVals = keys(tailwindHues[shade]);
    return keyVals.map((key) => tailwindHues[shade][key]);
  } else if (typeof shade && typeof value == 'undefined') {
    throw Error(`Both shade and value cannot be undefined`);
  }
}

/**
 * 
 *  Wrapper function that returns TailwindCSS color value(s) of the specified shade. If invoked with no parameters it returns an array of colors from 100 to 900. If invoked with parameter will return the specified shade vale,
 * @param  val The tone value of the shade. Values are in incrementals of 100. Both numeric (100) and its string equivalent ('100') are valid.
 * @returns color A hex string value or array of hex strings.
 * @example
 * 
 * import { tailwindColors } from "huetiful-js";

// We pass in red as the target hue.
// It returns a function that can be called with an optional value parameter
let red = tailwindColors("red");
console.log(red());
// [
  '#fef2f2', '#fee2e2',
  '#fecaca', '#fca5a5',
  '#f87171', '#ef4444',
  '#dc2626', '#b91c1c',
  '#991b1b', '#7f1d1d'
]


console.log(red(100));
// '#fee2e2'

console.log(red('900'));
// '#7f1d1d'


 *
 */
function tailwindColors(shade: keyof TailwindColorFamilies) {
  return (val?: ScaleValues): string | string[] => {
    // This is a curried func that takes in the shade and returns a function that takes in a value from 100 thru 900
    // @ts-ignore
    shade = shade.toLowerCase();
    const { keys } = Object;
    // We check if the shade is a valid Tailwind shade if not we return pure black.
    let targetHue: object;

    if (keys(tailwindHues).indexOf(shade as string) != -1) {
      targetHue = tailwindHues[shade];
    } else {
      throw Error(
        `${
          shade as string
        } is not a valid shade in the default Tailwind palette`
      );
    }

    if (typeof val === 'undefined') {
      return keys(targetHue).map((value) => targetHue[value]);
    } else if (keys(targetHue).indexOf(val) > -1) {
      return targetHue[val];
    } else {
      throw Error(
        `${val} is not a valid scale value. Values are in increments of 100 up to 900 e.g "200"`
      );
    }
  };
}

class Color {
  constructor(c: ColorToken, options?: ColorOptions) {
    let {
      alpha,
      colorspace,
      luminance,
      saturation,
      lightMode,
      darkMode,
      lightness
    } = checkArg(options, {}) as ColorOptions;
    c = checkArg(c, '#000') as ColorToken;

    // Set the alpha of the color if its not explicitly passed in.
    //@ts-ignore
    this['alpha'] = checkArg(alpha, nativeAlpha(c));

    // if the color is undefined we cast pure black

    this['_color'] = c;

    // set the color's luminance if its not explicitly passed in
    this['_luminance'] = checkArg(luminance, getLuminance(c));

    // set the color's lightness if its not explicitly passed in the default lightness is in Lch but will be refactored soon
    this['lightness'] = checkArg(lightness, nativeGetChannel('lch.l')(c));

    // set the default color space as jch if a color space is not specified. TODO: get the mode from object and array
    this['colorspace'] = checkArg(colorspace, 'jch');

    // set the default saturation to that of the passed in color if the value is not explicitly set
    this['_saturation'] = checkArg(
      saturation,
      nativeGetChannel(
        `${this['colorspace']}.${matchChromaChannel(this['colorspace'])}`
      )(c)
    );

    // light mode default is gray-100
    this['lightMode'] = checkArg(lightMode, colors('gray', '100'));

    // dark mode default is gray-800
    this['darkMode'] = checkArg(darkMode, colors('gray', '800'));
  }

  alpha(amount?: number | string): Color | number {
    if (amount) {
      this['_color'] = nativeAlpha(this['_color'], amount);
      return this;
    } else {
      return nativeAlpha(this['_color']);
    }
  }
  getChannel(channel: string) {
    return nativeGetChannel(`${this['colorspace']}.${channel.toLowerCase()}`)(
      this['_color']
    );
  }
  setChannel(modeChannel: string, value: number | string): Color {
    this['_color'] = nativeSetChannel(modeChannel)(this['_color'], value);
    return this;
  }

  via(origin: ColorToken, t?: number, options?: typeof interpolatorConfig) {
    const result = interpolator(
      [origin, this['_color']],
      this['colorspace'],
      options
    );

    return nativeToHex(result(t));
  }

  brighten(amount: number | string, colorspace) {
    this['_color'] = nativeBrighten(this['_color'], amount, colorspace);
    return this;
  }
  darken(amount: number | string) {
    this['_color'] = nativeDarken(this['_color'], amount);
    return this;
  }

  toHex(): Color {
    this['_color'] = nativeToHex(this['_color']);
    return this['_color'];
  }
  pastel(): Color {
    this['_color'] = nativePastel(this['_color']);
    return this;
  }
  pairedScheme(options?: PairedSchemeOptions): ColorArray {
    // @ts-ignore
    this['colors'] = nativePairedScheme(this['_color'], options);

    return new ColorArray(this['colors']);
  }
  hueShift(options?: HueShiftOptions): ColorArray {
    // @ts-ignore
    this['colors'] = nativeHueShift(this['_color'], options);

    return new ColorArray(this['colors']);
  }
  getComplimentaryHue(
    mode?: HueColorSpaces,
    colorObj?: boolean
  ): { hue: HueFamily; color: ColorToken } | ColorToken {
    this['_color'] = nativeGetComplimentaryHue(this['_color'], mode, colorObj);
    return this['_color'];
  }
  earthtone(options?: EarthtoneOptions): ColorArray | ColorToken {
    // @ts-ignore
    this['colors'] = nativeEarthtone(this['_color'], checkArg(options, {}));

    return this['colors'];
  }
  contrast(against: 'lightMode' | 'darkMode' | Color) {
    let result: number;
    switch (against) {
      case 'lightMode':
        result = getContrast(this['_color'], this['background']['lightMode']);

        break;
      case 'darkMode':
        result = getContrast(this['_color'], this['background']['darkMode']);
        break;
      default:
        result = getContrast(this['_color'], this['background']['custom']);
        break;
    }
    return result;
  }
  luminance(amount?: number): number {
    if (amount) {
      this['_luminance'] = amount;
      this['_color'] = setLuminance(this['_color'], this['_color']);
      // @ts-ignore
      return this;
    }
    return getLuminance(this['_color']);
  }

  output() {
    return this['_color'];
  }

  saturation(amount?: string | number) {
    this['_saturation'] = nativeGetChannel(
      `${this['colorspace']}.${matchChromaChannel(this['colorspace'])}`
    )(this['_color']);
    if (amount) {
      this['_color'] = nativeSetChannel(
        `${this['colorspace']}.${matchChromaChannel(this['colorspace'])}`
      )(this['_color'], amount);

      return this;
    } else {
      return this['_saturation'];
    }
  }
  isAchromatic() {
    return nativeIsAchromatic(this['_color']);
  }
  isWarm() {
    return nativeIsWarm(this['_color']);
  }
  isCool() {
    return nativeIsCool(this['_color']);
  }

  /**
 * 
 *  Returns the color as a simulation of the passed in type of color vision deficiency with the deficiency filter's intensity determined by the severity value.
 * @param deficiencyType The type of color vision deficiency. To avoid writing the long types, the expected parameters are simply the colors that are hard to perceive for the type of color blindness. For example those with 'tritanopia' are unable to perceive 'blue' light. Default is 'red' when the defeciency parameter is undefined or any falsy value.
 * @see For a deep dive on  color vision deficiency go to
 * @param color The color to return its deficiency simulated variant.
 * @param severity The intensity of the filter. The exepected value is between [0,1]. For example 0.5
 * @returns The color as its simulated variant as a hexadecimal string.
 * @example
 * 
 * import { colorDeficiency, toHex } from 'huetiful-js'

// Here we are simulating color blindness of tritanomaly or we can't see 'blue'. 
// We are passing in our color as an array of channel values in the mode "rgb". The severity is set to 0.1
let tritanomaly = colorDeficiency('blue')
console.log(tritanomaly(['rgb', 230, 100, 50, 0.5], 0.1))
// #dd663680

// Here we are simulating color blindness of tritanomaly or we can't see 'red'. The severity is not explicitly set so it defaults to 1
let protanopia = colorDeficiency('red')
console.log(protanopia({ h: 20, w: 50, b: 30, mode: 'hwb' }))
// #9f9f9f
 */
  deficiency(
    deficiencyType?: 'red' | 'blue' | 'green' | 'monochromacy',
    severity = 1
  ): ColorToken {
    this['_color'] = nativeColorDeficiency(deficiencyType)(
      this['_color'],
      severity
    );
    return this;
  }

  getFarthestHue(colors: ColorToken[], colorObj?: boolean) {
    return nativeGetFarthestHue(colors, this['colorspace'], colorObj);
  }
  getNearestHue(colors: ColorToken[], colorObj?: boolean) {
    return nativeGetNearestHue(colors, this['colorspace'], colorObj);
  }
  getNearestChroma(colors: ColorToken[]) {
    return nativeGetNearestChroma(colors, this['colorspace']);
  }
  getNearestLightness(colors: ColorToken[], colorObj?: boolean) {
    return nativeGetNearestLightness(colors, this['colorspace'], colorObj);
  }
  getFarthestChroma(colors: ColorToken[], colorObj?: boolean) {
    return nativeGetFarthestChroma(colors, colorObj);
  }
  getFarthestLightness(colors: ColorToken[], colorObj?: boolean) {
    return nativeGetFarthestLightness(colors, this['colorspace'], colorObj);
  }
  ovetone() {
    return nativeOvertone(this['_color']);
  }
  getHue() {
    return nativeGetHue(this['_color']);
  }
  scheme(
    scheme: 'analogous' | 'triadic' | 'tetradic' | 'complementary',
    easingFunc?: (t: number) => number
  ): ColorToken[] | ColorArray {
    return load(nativeScheme(scheme)(this['_color'], easingFunc));
  }
}

/**
 * Wrapper function over the Color class that returns a new Color method chain.
 * @param color The color token to bind.
 * @returns A new Color class with all the utilities that take a single color as the first parameter bound to its prototype.
 */
function color(color: ColorToken) {
  return new Color(color);
}

export {
  diverging,
  qualitative,
  sequential,
  colors,
  tailwindColors,
  ColorArray,
  load,
  Color,
  color
};
