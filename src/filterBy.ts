/** 
 * @license
 * filterBy.ts - Utilities for filtering collections of colors.
Copyright 2023 Dean Tarisai.
This file is licensed to you under the Apache License, Version 2.0 (the 'License');
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { differenceHyab } from 'culori/fn';
import { toHex } from './converters';
import type { ColorToken, HueColorSpaces, Factor } from './types';
import { getLuminance, getContrast, getChannel } from './utils';
import {
  matchChromaChannel,
  matchLightnessChannel,
  filteredArr,
  normalize,
  matchComparator,
  matchDigits,
  checkArg
} from './helpers';

/**
 * @internal
 *
 * @param factor The color property in query.
 * @param cb The predicate to get the equatable value used during comparison
 * @param colors The collection to map over. Can either be an array or object whose values are valid color tokens.
 * @param start The minimum end of the filtering range.
 * @param end The maximum end of the filtering range. It can also be omitted and all colors greater than the starting value of the factor being queried will be returned.
 * @returns The collection of colors. Its generic and will return Maps for collections passed as objects.
 */
function baseFilterBy(
  factor: Factor,
  cb: (color: ColorToken) => number,
  collection: ColorToken[] | object | object,
  start: string | number,
  end?: number,
  colorspace?: HueColorSpaces
) {
  const normalizableFactors = {
    saturation: matchChromaChannel,
    lightness: matchLightnessChannel
  };

  // make case insensitive
  factor = factor.toLowerCase();
  // @ts-ignore
  colorspace = checkArg(colorspace, 'lch65').toLowerCase();

  var [sym, startVal] = [
    matchComparator(start as string),
    matchDigits(start as string)
  ];

  if (normalizableFactors[factor]) {
    startVal = normalize(startVal, normalizableFactors[factor](colorspace));
    end = normalize(end, normalizableFactors[factor](colorspace));
  }

  if (typeof start === 'string' && sym) {
    // @ts-ignore
    startVal = sym.concat(startVal.toString());
  }

  return filteredArr(factor, cb)(collection, startVal, end);
}

/**
 *  
 * Returns an array of colors in the specified saturation range. 
 * 
 * The range is internally normalized to the supported ranges by the `colorspace` in use if it is out of range.
 * This means a value in the range `[0,1]` will return, for example if you pass startSaturation as `0.3` it means `0.3 (or 30%)` of the channel's supported range. But if the value of either start or end is above 1 AND the `colorspace` in use has an end range higher than 1 then the value is treated as if in the unnormalized range else the value is treated as if in the range `[0,100]` and will return the normalized value.
 * @param  collection The collection of colors to filter.
 * @param  startSaturation The minimum end of the saturation range. Supports expression strings e.g `'>=0.5'`. The supported symbols are `== | === | != | !== | >= | <= | < | >` 
 * @param  endSaturation The maximum end of the saturation range.
 * @param colorspace The color space to fetch the saturation value from. Any color space with a chroma channel e.g 'lch' or 'hsl' will do.
 * @returns Collection of filtered colors.
 * @example
 * import { filterBySaturation } from 'huetiful-js'


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
  '#720000'
];

console.log(filterBySaturation(sample, 0.1));

// [ '#00ff78', '#00c000', '#007e00', '#ffff00' ]
 */

function filterBySaturation(
  collection: ColorToken[] | object,
  startSaturation = 0.05,
  endSaturation = 1,
  colorspace?: HueColorSpaces
): ColorToken[] {
  const modeChannel = matchChromaChannel(colorspace);

  const factor: Factor = 'saturation';

  return baseFilterBy(
    factor,
    getChannel(modeChannel),
    collection,
    startSaturation,
    endSaturation,
    colorspace
  );
}

/**
 *  
 *  Returns an array of colors in the specified luminance range.
 * @param  collection The collection of colors to filter.
 * @param  startLuminance The minimum end of the luminance range.Supports expression strings e.g `'>=0.5'`. The supported symbols are `== | === | != | !== | >= | <= | < | >` 
 * @param  endLuminance The maximum end of the luminance range.
 * @returns Collection of filtered colors.
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

function filterByLuminance(
  collection: ColorToken[] | object,
  startLuminance = 0.05,
  endLuminance = 1
): ColorToken[] {
  return baseFilterBy(
    'luminance',
    getLuminance,
    collection,
    startLuminance,
    endLuminance
  );
}

/**
 *  
 *  Returns an array of colors in the specified lightness range.
 * 
 * The range is internally normalized to the supported ranges by the `colorspace` in use if it is out of range.
 * This means a value in the range `[0,1]` will return, for example if you pass `startLightness` as `0.3` it means `0.3 (or 30%)` of the channel's supported range. But if the value of either start or end is above 1 AND the `colorspace` in use has an end range higher than 1 then the value is treated as is else the value is treated as if in the range `[0,100]` and will return the normalized value.
 * @param  collection The collection of colors to filter.
 * @param  startLightness The minimum end of the lightness range. Supports expression strings e.g `'>=0.5'`. The supported symbols are `== | === | != | !== | >= | <= | < | >` 
 * @param  endLightness The maximum end of the lightness range.
 * @param colorspace The mode colorspace to retrieve the lightness value from. The default is lch65
 * @returns Collection of filtered colors.
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

function filterByLightness(
  collection: ColorToken[] | object,
  startLightness = 5,
  endLightness = 100,
  colorspace?: HueColorSpaces
): ColorToken[] {
  const factor: Factor = 'lightness';

  return baseFilterBy(
    factor,
    getChannel(matchLightnessChannel(colorspace)),
    collection,
    startLightness,
    endLightness,
    colorspace
  );
}

//filterByHue takes an array of colors and
/**
 * 
 * Returns colors in the specified hue ranges between 0 to 360.
 * @param collection The collection of colors to filter.
 * @param  startHue The minimum end of the hue range. Supports expression strings e.g `'>=0.5'`. The supported symbols are `== | === | != | !== | >= | <= | < | >` 
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

function filterByHue(
  collection: ColorToken[] | object,
  startHue = 0,
  endHue = 360,
  colorspace?: HueColorSpaces
): ColorToken[] {
  return baseFilterBy(
    'hue',
    getChannel(`${colorspace}.h`),
    collection,
    startHue,
    endHue
  );
}

/**
 *  
 * Returns an array of colors with the specified distance range. The distance is tested against a comparison color (the 'against' param) and the specified distance ranges. Uses the differenceHyab metric for calculating the distances.
 * @param  collection The collection of colors to filter.
 * @param  startDistance The minimum end of the distance range.Supports expression strings e.g `'>=0.5'`. The supported symbols are `== | === | != | !== | >= | <= | < | >` 
 * @param  endDistance The maximum end of the distance range.
 * @returns Collection of filtered colors.
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

function filterByDistance(
  collection: ColorToken[] | object,
  against: ColorToken,
  startDistance = 0.05,
  endDistance?: number
): ColorToken[] {
  const cb = (against) => (color) => differenceHyab()(against, color);

  return baseFilterBy(
    'distance',
    cb(toHex(against)),
    collection,
    startDistance,
    endDistance
  );
}

/**
 *  
 * Returns an array of colors with the specified contrast range. The contrast is tested against a comparison color (the 'against' param) and the specified contrast ranges.
 * @param  collection The collection of colors to filter.
 * @param  startContrast The minimum end of the contrast range.Supports expression strings e.g `'>=0.5'`. The supported symbols are `== | === | != | !== | >= | <= | < | >` 
 * @param  endContrast The maximum end of the contrast range.
 * @returns Collection of filtered colors.
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

function filterByContrast(
  collection: ColorToken[] | object,
  against: ColorToken,
  startContrast = 1,
  endContrast = 21
): ColorToken[] {
  const cb = (against: ColorToken) => (color: ColorToken) =>
    getContrast(color, against);
  return baseFilterBy(
    'contrast',
    cb(against),
    collection,
    startContrast,
    endContrast
  );
}

export {
  filterByContrast,
  filterByDistance,
  filterByLuminance,
  filterBySaturation,
  filterByHue,
  filterByLightness
};
