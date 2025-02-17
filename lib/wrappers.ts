import { contrast, deficiency } from "./accessibility.ts";
import { filterBy, sortBy, stats } from "./collection.ts";
import {
  discover,
  earthtone,
  hueshift,
  interpolator,
  pair,
  pastel,
  scheme,
} from "./generators.ts";
import { mcchn, or } from "./internal.ts";
import { colors, nearest } from "./palettes.ts";
import type {
  BiasedHues,
  Collection,
  ColorFamily,
  ColorOptions,
  ColorToken,
  DeficiencyOptions,
  DiscoverOptions,
  EarthtoneOptions,
  FilterByOptions,
  HueshiftOptions,
  InterpolatorOptions,
  NearestOptions,
  PairedSchemeOptions,
  SchemeOptions,
  SortByOptions,
  StatsOptions,
  TokenOptions,
} from "./types.d.ts";
import {
  achromatic,
  alpha as _opac,
  family,
  lightness,
  luminance as _lmnce,
  mc,
  temp,
  token,
} from "./utils.ts";

/**
* Creates a lazy chain wrapper over a collection of colors that has all the array methods (functions that take a collection of colors as their first argument).
*
:::tip

The `ColorArray` class is also exposed via a wrapper function `load()`,
if you prefer not to explicitly instantiate a `new ColorArray`.

:::
* @example
*
* import { ColorArray } from 'huetiful-js';
* let sample = ['blue', 'pink', 'yellow', 'green'];
* let wrapper = new ColorArray(sample);
* // We can even chain the methods and get the result by calling `.output()`
* // [ 'blue', 'green', 'yellow', 'pink' ]

 */
class ColorArray<C extends Collection, Options extends object> {
  colors: Collection;
  implicitReturn: boolean;
  /**
   * @param colors The collection of colors to bind.
   */
  constructor(colors: C, implicitReturn?: boolean) {
    this.colors = colors;
    this.implicitReturn = or(implicitReturn, false) as boolean;
    return;
  }

  #setThis(
    callback: (x: Collection, y: unknown) => Collection,
    options: unknown,
  ) {
    this.colors = callback(this.colors, options);
    // @ts-ignore:
    return this.implicitReturn ? this.output() : this;
  }

  /**
 * Returns the nearest color(s) in the bound collection against
 * the entire collection is returned with colors ordered in ascending order using the `differenceHyab` metric.
 * @example

 * import { load,colors } from 'huetiful-js';
 *
 * let cols = colors('all', '500')
 *
console.log(load(cols).nearest('blue', 3));
 // [ '#a855f7', '#8b5cf6', '#d946ef' ]
 */
  nearest(options?: NearestOptions): Collection | this {
    // @ts-ignore:
    return this.#setThis(nearest, options);
  }

  /**
 *
 * Interpolates the passed in colors and returns a collection of colors from the interpolation.
 *
 * :::tip
 *
 * * To create a color scale for cyclic values pass `true` to the `closed` parameter in the `options` object.
 * * If `num` is 1 then a single color is returned from the resulting interpolation with the internal `t` value at `0.5` else a collection of the `num` of color scales is returned.
 * * If the collection of colors contains an achromatic color, the resulting samples may all be grayscale or pure black.
 * :::
 *
 * @param  options Optional channel specific overrides.
 *
 * @example
 *
 * import { load } from 'huetiful-js';

   *
   */

  interpolator(options?: InterpolatorOptions): Collection | this {
    // @ts-ignore:
    return this.#setThis(interpolator, options);
  }

  /**
   *
 * Takes a collection of colors and finds the nearest matches using the `differenceHyab()` color difference metric for a set of predefined palettes.
 *
 * The function returns different values based on the `kind` parameter passed in:
 *
 * * An array of colors for the `kind` of scheme, if the `kind` parameter is specified.
 * * Else it returns an object of all the palette types as keys and their values as an array of colors.
 *
 * If no colors are valid for the palette types it returns an empty array for the palette results. It does not work with achromatic colors thus they're excluded from the resulting collection.
 * @param options
 * @example

 * import { load } from 'huetiful-js';

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

  console.log(load(sample).discover({kind:'tetradic'}).output())
  // [ '#ffff00ff', '#00ffdcff', '#310000ff', '#720000ff' ]
   */
  discover(options?: DiscoverOptions): Collection | this {
    // @ts-ignore:
    return this.#setThis(discover, options);
  }

  /**
   *
 * Filters a collection of colors using the specified `factor` as the criterion. The supported options are:
 * * `'contrast'` - Returns colors with the specified contrast range. The contrast is tested against a comparison color (the 'against' param) and the specified contrast ranges.
 * * `'lightness'` - Returns colors in the specified lightness range.
 * * `'chroma'` - Returns colors in the specified `saturation` or `chroma` range. The range is internally normalized to the supported ranges by the `colorspace` in use if it is out of range.

 * * `'distance'` - Returns colors with the specified `distance` range. The `distance` is tested against a comparison color (the 'against' param) and the specified `distance` ranges. Uses the `differenceHyab` metric for calculating the distances.
 * * `luminance` - Returns colors in the specified luminance range.
 * * `'hue'` - Returns colors in the specified hue ranges between 0 to 360.
 *
 :::tip
 *
 * For the `chroma` and `lightness` factors, the range is internally normalized to the supported ranges by the `colorspace` in use if it is out of range.
 * This means a value in the range `[0,1]` will return, for example if you pass `startLightness` as `0.3` it means `0.3 (or 30%)` of the channel's supported range.
 * But if the value of either start or end is above 1 AND the `colorspace` in use has an end range higher than 1 then the value is treated as is else the value is treated as if in the range `[0,100]` and will return the normalized value.
:::
*
 *
 * @see https://culorijs.org/color-spaces/ For the expected ranges per colorspace.
 * Supports expression strings e.g `'>=0.5'`. The supported symbols are `== | === | != | !== | >= | <= | < | >`
* @param options
* @example

import { filterBy } from 'huetiful-js';
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
// Filtering colors by their relative contrast against 'green'.
// The collection will include colors with a relative contrast equal to 3 or greater.

console.log(load(sample).filterBy({start:'>=3', factor:'contrast',against:'green' }))
// [ '#00ffdc', '#00ff78', '#ffff00', '#310000', '#3e0000', '#4e0000' ]

 */
  filterBy(options?: FilterByOptions): Collection | this {
    // @ts-ignore:
    return this.#setThis(filterBy, options);
  }

  /**
 * Sorts colors according to the specified `factor`. The supported options are:
 *
 * * `'contrast'` - Sorts colors according to their contrast value as defined by WCAG.
 * The contrast is tested `against` a comparison color  which can be specified in the `options` object.
 * * `'lightness'` - Sorts colors according to their lightness.
 * * `'chroma'` - Sorts colors according to the intensity of their `chroma` in the `colorspace` specified in the `options` object.
 * * `'distance'` - Sorts colors according to their distance.
 * The distance is computed from the `against` color token which is used for comparison for all the colors in the `collection`.
 * * `luminance` - Sorts colors according to their relative brightness as defined by the WCAG3 definition.
 *
 * The return type is determined by the type of `collection`:
 *
 * * Plain objects are returned as `Map` objects because they remember insertion order. `Map` objects are returned as is.
 * * `ArrayLike` objects are returned as plain arrays. Plain arrays are returned as is.
 * @param options
 * @example
 import { sortBy } from 'huetiful-js';

let sample = ['purple', 'green', 'red', 'brown']

console.log(
  load(sample).sortBy({ against:'yellow' factor:'distance',order:'desc'})
)

// [ 'brown', 'red', 'green', 'purple' ]
 */

  sortBy(options?: SortByOptions): Collection | this {
    // @ts-ignore:
    return this.#setThis(sortBy, options);
  }

  /**
   * Computes statistical values about the passed in color collection.
   *
   * The topmost properties from each returned `factor` object are:
   *
   * * `against` - The color being used for comparison.
   *
   * Required for the `distance` and `contrast` factors.
   * If `relativeMean` is `false`, other factors that take the comparison color token as an overload will have this property's value as `null`.
   * * `colorspace` - The colorspace in which the factors were computed in. It has no effect on the `contrast` or `distance` factors (for now).
   *
   * * `extremums` - An array of the minimum and the maximum value (respectively) of the `factor`.
   * * `colors` - An array of color tokens that have the minimum and maximum `extremum` values respectively.
   * * `mean` - The average value for the `factor`.
   * * `displayable` - The percentage of the displayable or colors with channel ranges that can be rendered in  that colorspace when converted to RGB.
   *
   * The `mean` property can be overloaded by the `relativeMean` option:
   *
   * * If `relativeMean` is `true`, the `against` option will be used as a subtrahend for calculating the distance between each `extremum`.
   * For example, it will mean "Get the largest/smallest distance between `factor` as compared `against` this color token otherwise just get the smallest/largest `factor` from thr passed in collection."
   *
   * @param  options Optional parameters to specify how the data should be computed.
   */
  stats(options?: StatsOptions): Collection | this {
    // @ts-ignore:
    return this.#setThis(stats, options);
  }

  // distribute(options?: DistributionOptions) {
  //   return this.#setThis(distribute, options);
  // }
  /**
   * Returns the result value from the chain.
   * Can be omitted from invocation when `implicitReturn` is set to true.
   */
  output(): Collection {
    return this.colors;
  }
}

/**
 *
 * Creates a lazy chain wrapper over a single color token that has all the functions that take a `ColorToken` as their first argument.
 *
 * @example
 *
 import { Color } from 'huetiful-js'

 let wrapper = new Color('pink');

console.log(wrapper.color2hex());
// #ffc0cb
 */
class Color {
  /**
   * @param c The color to bind.
   * @param options Optional overrides and properties for the bound color.
   */
  constructor(c: ColorToken = "cyan", options?: ColorOptions) {
    const {
      alpha,
      colorspace,
      luminance,
      saturation,
      lightMode,
      darkMode,
      lightness,
      implicitReturn,
    } = or(options, {}) as ColorOptions;

    // Set the alpha of the color if its not explicitly passed in.
    // @ts-ignore:
    this.alpha = or(alpha, _opac(c));

    // if the color is undefined we cast pure black
    // @ts-ignore:
    this._color = c;

    // set the color's luminance if its not explicitly passed in
    // @ts-ignore:
    this._luminance = or(luminance, _lmnce(c));

    // set the color's lightness if its not explicitly passed in the default lightness is in Lch but will be refactored soon
    // @ts-ignore:
    this._lightness = or(lightness, mc("lch.l")(c));
    // @ts-ignore:
    // set the default color space as jch if a color space is not specified. TODO: get the mode from object and array
    this.colorspace = or(colorspace, "lch");
    // @ts-ignore:
    // set the default saturation to that of the passed in color if the value is not explicitly set
    this._saturation = or(
      saturation,
      // @ts-ignore:
      mc(mcchn("c", this.colorspace))(c),
    );
    // @ts-ignore:
    // light mode default is gray-100
    this.lightMode = or(lightMode, colors("gray", "100"));
    // @ts-ignore:
    // dark mode default is gray-800
    this.darkMode = or(darkMode, colors("gray", "800"));
    // @ts-ignore:
    this.implicitReturn = or(implicitReturn, false) as boolean;
  }
  // @ts-ignore:

  #setThis(callback, options?) {
    // @ts-ignore:
    this.color = options
      // @ts-ignore:
      ? callback(this._color, options)
      // @ts-ignore:
      : callback(this._color);
    // @ts-ignore:
    return this.implicitReturn ? this.output() : this as typeof callback;
  }

  /**
   *
   *
   * Sets/Gets the opacity or `alpha` channel of a color. If the `value` parameter is omitted it gets the bound color's `alpha` value.
   * @param amount The value to apply to the opacity channel. The value is normalized to the range [0,1]
   * @example
 import { color } from 'huetiful-js';

  // Getting the alpha
  console.log(color('#a1bd2f0d').alpha())
  // 0.050980392156862744

  // Setting the alpha
  let myColor = color('b2c3f1')alpha(0.5)

  console.log(myColor)

  // #b2c3f180
   */
  alpha(amount?: string | number): ColorToken | number {
    return this.#setThis(_opac, amount);
  }

  /**
   *
   * Sets the value of the specified channel on the passed in color.
   *
   * If the `amount` parameter is `undefined` it gets the value of the specified channel.
    * @param modeChannel The mode and channel to be retrieved. For example `rgb.b` will return the value of the blue channel's value in the RGB color space of that color.
    * @param value The value to set on the queried channel. Also supports expressions as strings e.g `"#fc23a1"` `"*0.5"`
    *
    * The supported symbols `*` `+` `-` `/`
   * @example

   * import { color } from 'huetiful-js'

  console.log(color('#a1bd2f').mc('rgb.g'))
  // 0.7411764705882353
   *
  */
  mc(modeChannel: string, value?: string | number): ColorToken | number {
    const cb = (p: ColorToken) => mc(modeChannel)(p, value);
    return this.#setThis(cb);
  }

  /**
     *
     * Interpolates the bound color via the `origin` with the point `t` at `0.5`.
     *
     * @param {ColorToken} origin The color to interpolate via.
     value is in the range [0,1]
      the easing and the interpolation methods /fixups.
     */
  via(origin: ColorToken): ColorToken {
    const cb = (a: ColorToken) =>
      interpolator([origin, a], {
        num: 1,
        // @ts-ignore:
        colorspace: this.colorspace,
      });
    return this.#setThis(cb);
  }

  /**
     *
   *
   * Darkens the bound color by reducing the `lightness` channel by `amount` of the channel. For example `0.3` means reduce the lightness by `0.3` of the channel's current value.
   * @param amount The amount to darken with. The value is expected to be in the range `[0,1]`. Default is `0.1`.
   * @example

   *  import { color } from "huetiful-js";
  console.log(color('blue').darken(0.3));
  //#464646

   */
  lightness(amount?: number, darken = undefined): ColorToken {
    const params = [amount, darken];
    return this.#setThis(lightness, ...params);
  }

  /**
   * Parses any recognizable color to the specified `kind` of `ColorToken` type.
   *
   * The `kind` option supports the following types as options:
   *
   * * `'array'` - Parses the color token to an array of channel values with the `colorspace` as the first element if the `omitMode` parameter is set to `false` in the `options` object.
   *
   * * `'number'` - Parses the color token to its numerical equivalent to a number between `0` and `16,777,215`.
   *
   * The `numberType` can be used to specify which type of number to return if the `kind` option is set to `'number'`:
   *  - `'hexadecimal'`
   *  - `'binary'`
   *  - `'octal'`
   *  - `'decimal'` exponential notation
   *  - `'hex'` - Parses the color token to its hexadecimal string equivalent.
   *
   * If the color token has an explicit `alpha` (specified by the `alpha` key in color objects and as the fourth and last number in a color array) the string will be 8 characters long instead of 6.
   *
   * * `'object'` - Parses the color token to a plain color object in the `mode` specified by the `targetMode` parameter in the `options` object.
   */
  token(options?: TokenOptions): ColorToken {
    return this.#setThis(token, options);
  }

  /**
   *
   * Returns a randomized pastel variant of the bound color token. Preserves the bound `ColorToken` type.
   *
   * @example

   * import { color } from 'huetiful-js';
   *
   * console.log(color("green").pastel())
   *
   * // #036103ff
   *
   */
  pastel(): ColorToken {
    return this.#setThis(pastel);
  }

  /**
     *
    * Creates a palette that consists of a `baseColor` that is incremented by a `hueStep` to get the final color to pair with.
    * The colors are then spline interpolated via white or black.
    *
    * A negative `hueStep` will pick a color that is `hueStep` degrees behind the base color.
    * @param  options The optional overrides object to customize per channel options like interpolation methods and channel fixups.
    * @example

    * import { color } from 'huetiful-js'

    console.log(color("green").pairedScheme({hueStep:6,samples:4,tone:'dark'}))
    // [ '#008116ff', '#006945ff', '#184b4eff', '#007606ff' ]
     */
  pair(options?: PairedSchemeOptions): ColorToken | Collection {
    return this.#setThis(pair, options);
  }

  /**
   *
   * * Creates a palette of hue shifted colors from the passed in color.
   *
   * Hue shifting means that:
   *
   * * As a color becomes lighter, its hue shifts up (increases).
   * * As a color becomes darker its hue shifts down (decreases).
   *
   * The `minLightness` and `maxLightness` values determine how dark or light our color will be at either extreme respectively.
   *
   *  The length of the resultant array is the number of samples (`num`) multiplied by 2 plus the base color passed in or `(num * 2) + 1`.
   *
   * @param options The optional overrides object to customize the `HueShiftOptions` like easing function.
   * @example
  import { color } from "huetiful-js";

    let hueShiftedPalette = color("#3e0000").hueShift({ iterations:1 });

    console.log(hueShiftedPalette);

    // [
      '#ffffe1', '#ffdca5',
      '#ca9a70', '#935c40',
      '#5c2418', '#3e0000',
      '#310000', '#34000f',
      '#38001e', '#3b002c',
      '#3b0c3a'
    ]
     */
  hueshift(options?: HueshiftOptions): Collection {
    return this.#setThis(hueshift, options);
  }

  /**
   * Gets the hue family which a color belongs to with the overtone included (if it has one.).
   *
   * For example `'red'` or `'blue-green'`. If the color is achromatic it returns the string `'gray'`.
   * @example

   * import { color } from 'huetiful-js'


  console.log(color("#310000").family())
  // 'red'
   */
  family(): BiasedHues & ColorFamily | {
    hue: BiasedHues & ColorFamily;
    bias: false | ColorFamily;
  } {
    // @ts-ignore:

    return this.#setThis(family);
  }

  /**
     *
     * Creates a color scale between an earth tone and any color token using spline interpolation.
     *
     * @param options
     *
     * @example

     * import { color } from 'huetiful-js'
     *
     * let base = 'purple'
     *
     * console.log(color(base).earthtone({num:8}))
     *
     ColorArray {
    colors: [
      '#352a21', '#3e2825',
      '#4c2624', '#5f2028',
      '#741033', '#860040',
      '#940049', '#99004b'
    ]
  }

  console.log(color(base).earthtone({ iterations:8 }).output())
     * // call output() to only get results array

  // [
      '#352a21', '#3e2825',
      '#4c2624', '#5f2028',
      '#741033', '#860040',
      '#940049', '#99004b'
    ]
     */
  earthtone(options?: EarthtoneOptions): ColorToken | Collection {
    return this.#setThis(earthtone, options);
  }

  /**
   *
   * Gets the contrast value between the bound and  comparison ( or `against`) color.
   * @param against The color to use for comparison. The default is `'black'`.
   * @example

   * import { color } from 'huetiful-js'
   *
   * console.log(color('pink').contrast('yellow'))
   * // 1.4322318222624262
   */
  contrast(against?: ColorToken): number {
    return this.#setThis(
      contrast,
      // @ts-ignore:
      /light|dark/gi.test(against)
        // @ts-ignore:
        ? {
          // @ts-ignore:
          light: this?.background?.lightMode,
          // @ts-ignore:
          dark: this?.background?.darkMode,
          // @ts-ignore:
        }[against?.toLowerCase()]
        : against,
    );
  }

  /**
   *
   * Gets the luminance of the passed in color token.
   *
   * If the `amount` parameter is not passed in else it will adjust the luminance by interpolating the color with black (to decrease luminance) or white (to increase the luminance) by the specified `amount`.
   * @param amount The `luminance` value to set on the bound color.
   *
   * @example
    import { color } from 'huetiful-js'
   *
  let myColor = 'green';
  console.log(color(myColor).luminance());
  // 0.1543834296814607

  console.log(color(myColor)._luminance);
  // 0.1543834296814607

  console.log(color(myColor).luminance(0.5));

     */
  luminance(amount?: number): number | ColorToken {
    return this.#setThis(_lmnce, amount);
  }

  /**
   *
   * Sets/Gets the saturation value of the bound color.
   * @param amount The amount of `saturation` to set on the bound color token. Also supports string expressions.
   * @example
   *
    import { color } from 'huetiful-js'
   *
   *
   * let myColor = ['lch',60,13,0.5]
   *
   * console.log(color(myColor).saturation())
   * // 13
   *
   * console.log(color(myColor).saturation("*0.3"))
   *
   * // ['lch',60,19.9,0.5]
   *
   */
  saturation(amount?: number): number | ColorToken {
    // @ts-ignore:
    const c = mcchn("c", this.colorspace),
      cb = (a: ColorToken) => mc(c)(a, amount);
    return this.#setThis(cb, amount);
  }

  /**
     *
   * Returns `true` if the bound color has hue or is grayscale elsColorspaces} [colorspace='lch'] The colorspace to use when checking if the `color` is grayscale or not.
   *
   * @example

   * import { color } from "huetiful-js";
  import { formatHex8, interpolate, samples } from "culori"

  var test = c => color(c).isAchromatic()


  test('pink')
  // false

  let sample = [
    "#164100",
    "#ffff00",
    "#310000",
    'pink'
  ];

  console.log(sample.map(test));

  // [false, false, false,false]

  test('gray')

  // true



  // we create an interpolation using black and white
  let f = interpolate(["black", "white"]);

  //We then create 12 evenly spaced samples and pass them to f as the `t` param required by an interpolating function.
  // Lastly we convert the color to hex for brevity for this example (otherwise color objects work fine too.)
  let grays = samples(12).map((c) => formatHex8(f(c)));
  console.log(grays.map(test));

  //
   [ false, true, true,
    true,  true, true,
    true,  true, true,
    true,  true, false
  ]

   */
  achromatic(): boolean {
    return this.#setThis(achromatic);
  }

  /**
    * Returns a rough estimation of a color's temperature as either `'cool'` or `'warm'`.
   * @example

   * import { color } from 'huetiful-js'

  let sample = [
    "#00ffdc",
    "#00ff78",
    "#00c000"
  ];



  console.log(color(sample[2]).temp());
  // 'warm'


   */
  temp(): "warm" | "cool" {
    // @ts-ignore:
    return this.#setThis(temp);
  }

  /**
   *
   * Simulates how a color may be perceived by people with color vision deficiency.
   *
   * To avoid writing the long types, the expected parameters for the `kind` of blindness are simply the colors that are hard to perceive for the type of color blindness:
   *
   * * 'tritanopia' - An inability to distinguish the color 'blue'. The `kind` is `'blue'`.
   * * 'deuteranopia' - An inability to distinguish the color 'green'.. The `kind` is `'green'`.
   * * 'protanopia' - An inability to distinguish the color 'red'. The `kind` is `'red'`.
   *
   * @param options
   *
   * @example

   * import { color } from 'huetiful-js'

    // Here we are simulating color blindness of tritanomaly or we can't see 'blue'.
    // We are passing in our color as an array of channel values in the mode "rgb". The severity is set to 0.1
    let tritanomaly = color(['rgb', 230, 100, 50, 0.5]).colorDeficiency('blue', 0.1)
    console.log(tritanomaly)
    // #dd663680

    // Here we are simulating color blindness of tritanomaly or we can't see 'red'. The severity is not explicitly set so it defaults to 1
    let protanopia = color({ h: 20, w: 50, b: 30, mode: 'hwb' }).colorDeficiency('red')
    console.log(protanopia)
    // #9f9f9f
     */
  deficiency(options?: DeficiencyOptions): ColorToken {
    return this.#setThis(deficiency, options);
  }

  /**
   *
   * Returns a randomised classic color scheme from the bound color.
   * @example
   *
   import { color  } from 'huetiful-js'

  console.log(color("#a1bd2f").scheme("triadic"))
  // [ '#a1bd2fff', '#00caffff', '#ff78c9ff' ]
   */
  scheme(options?: SchemeOptions): Collection {
    return this.#setThis(scheme, options);
  }

  /**
   *
   * Returns the final value from the chain.
   * @example

   * import { color } from 'huetiful-js'

   * let myOutput = color(['rgb',200,34,65]).output()
   *
   * console.log(myOutput)
   * // ['rgb',200,34,65]
   *
   */
  output(): ColorToken {
    // @ts-ignore:
    return this._color;
  }
}

export { Color, ColorArray };
