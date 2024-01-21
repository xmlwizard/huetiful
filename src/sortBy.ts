/** 
 * @license
 * sortBy.ts - Utilities for sorting collections of colors.
Copyright 2023 Dean Tarisai.
This file is licensed to you under the Apache License, Version 2.0 (the 'License');
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import type {
  Factor,
  ColorToken,
  Colorspaces,
  ColorDistanceOptions,
  HueColorSpaces,
  callback,
  Order
} from './types';
import {
  checkArg,
  sortedArr,
  matchLightnessChannel,
  matchChromaChannel
} from './helpers';
import { wcagContrast, differenceEuclidean } from 'culori/fn';
import { getLuminance, getChannel } from './utils';

function baseSortBy(
  factor: Factor,
  cb: callback,
  order: Order,
  collection: ColorToken[] | object
) {
  return sortedArr(factor, cb, order)(collection);
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

function sortBySaturation(
  collection: ColorToken[] | object,
  order: 'asc' | 'desc',
  mode?: HueColorSpaces
): ColorToken[] {
  return baseSortBy(
    'saturation',
    getChannel(matchChromaChannel(mode)),
    order,
    collection
  );
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

function sortByLuminance(
  collection: ColorToken[] | object,
  order: 'asc' | 'desc'
): ColorToken[] {
  return baseSortBy('luminance', getLuminance, order, collection);
}

/**
 * 
 *  Sorts colors according to their lightness.
 * @param  colors The array of colors to sort
 * @param  order The expected order of arrangement. Either 'asc' or 'desc'. Default is ascending ('asc')
 * @param colorspace The mode colorspace to use for filtering color lightness. Defaut is lch65
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
// For lightness use a different color space
function sortByLightness(
  collection: ColorToken[] | object,
  order?: Order,
  colorspace?: HueColorSpaces
): ColorToken[] {
  return baseSortBy(
    'lightness',
    getChannel(matchLightnessChannel(colorspace)),
    order,
    collection
  );
}

/**
 * 
 *  Sorts colors according to hue values. It works with any color space with a hue channel. Note that hue values between HSL and Lch do not align. Achromatic colors are not supported
 * @param  colors The array of colors to sort
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
function sortByHue(
  collection: ColorToken[] | object,
  order?: Order,
  colorspace?: HueColorSpaces
): ColorToken[] {
  const reHue = /h/i.test(colorspace);
  return (
    reHue &&
    baseSortBy(
      'lightness',
      getChannel(`${checkArg(colorspace, 'jch')}.h`),
      order,
      collection
    )
  );
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

function sortByContrast(
  collection: ColorToken[] | object,
  against: ColorToken,
  order?: Order
): ColorToken[] {
  // @ts-ignore
  const cb = (against: ColorToken) => (color: ColorToken) =>
    wcagContrast(color as string, against as string);
  return baseSortBy('contrast', cb(against), order, collection);
}

/**
 * 
 *  Sorts colors according to their Euclidean distance. The distance factor is determined by the color space used (some color spaces are not symmetrical meaning that the distance between colorA and colorB is not equal to the distance between colorB and colorA ). The distance is computed from against a color which is used for comparison for all the colors in the array i.e it sorts the colors against the dist
 * @param  colors The array of colors to sort.
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

function sortByDistance(
  collection: ColorToken[] | object,
  against: ColorToken,
  order?: 'asc' | 'desc',
  options?: ColorDistanceOptions
): ColorToken[] {
  var { mode, weights } = options || {};

  const cb = (against: string, mode: Colorspaces) => (color: string) => {
    // @ts-ignore
    return differenceEuclidean(
      // @ts-ignore
      checkArg(mode, 'lchuv') as typeof mode,
      checkArg(weights, [1, 1, 1, 0]) as typeof weights
    )(against, color);
  };

  return baseSortBy(
    'contrast',
    cb(against as string, checkArg(mode, 'lchuv') as typeof mode),
    order,
    collection
  );
}

export {
  sortByContrast,
  sortByDistance,
  sortByLightness,
  sortBySaturation,
  sortByHue,
  sortByLuminance
};
