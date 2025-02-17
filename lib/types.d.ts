/**
 * @author ディーン・タリサイ
 * Type definitions.
 */

/**
 * An array of channel values for a color token with the `mode` (first element of type `string`) and `alpha` (last element of type `number` in the [0,1] range) being optional.
 *
 * It can also be in different variants as shown below:
 *
 * @example
 * // The first element can either be a string `mode` which denotes the colorspace the channel values are valid in.
 * const colorTuple = ['rgb',0.1,0.5,0.8]
 * const colorTupleWithAlpha = ['rgb',0.1,0.5,0.8,0.5]
 * const colorTupleWithAlphaButNoMode = [0.1,0.5,0.8,0.5]
 * const colorTupleWithNoAlphaAndMode = [0.1,0.5,0.8]
 *
 * When omitting the `mode` from the color tuple, be sure to specify the `srcMode` option in when passing it to `token()` or any function that has access to `TokenOptions`.
 */
export type ColorTuple = Array<number | string>;

/**
 * The order to insert elements back into the result collection either ascending (`'asc'`) or descending (`'desc'`).
 */
export type Order = "asc" | "desc";

/**
 * The value of the `factor` being queried usually a number but can also be falsy like `NaN` for edge cases or an object with the value of the factor and the color token associated with it.
 */
export type Fact<F> = F extends true ? {
    factor: number;
    color: ColorToken;
  }
  : number;

/**
 * The scheme to use when creating base palettes.
 */
export type SchemeType =
  | "analogous"
  | "triadic"
  | "tetradic"
  | "complementary";

/**
 * Any collection with enumerable keys that can be used to iterate through it to get the values which are expected to be valid color tokens.
 */
export type Collection =
  | Array<ColorToken>
  | Map<string | number, ColorToken>
  | Set<ColorToken>
  | object;

export type NearestOptions = {
  against?: ColorToken;
  num?: number;
};

/**
 * Properties on an instance of the `Color` class. Some of these properties have corresponding methods.
 */
export type ColorOptions = {
  alpha?: number;
  lightness?: number;
  temp?: number;
  colorspace?: Colorspaces;
  luminance?: number;
  saturation?: number;
  implicitReturn?: boolean;
  lightMode?: ColorToken;
  darkMode?: ColorToken;

  contrast?: number;
  mode?: Colorspaces;
};

/**
 * @type
 * This object returns the lightMode and darkMode optimized version of a color with support to add color vision deficiency simulation to the final color result.
 */
export type AdaptivePaletteOptions = {
  backgroundColor?: {
    light?: ColorToken;
    dark?: ColorToken;
  };
  colorBlind?: boolean;
};

/**
 * Options for customizing the color interpolator behaviour. It is extended by some palette utilities
 */
export type InterpolatorOptions = {
  /**
   * The positions of color stops to use during interpolation. Each number in the array is assigned to the colors in the collection according to the order the colors are passed in.
   *
   * Plain objects as collects do not remember insertion order so it may return unexpected results. Preferably use an ArrayLike or Map object.
   */
  stops?: Array<number>;

  /**
   * The colorspace to perform the color space in. Prefer uniform color spaces for better results such as Lch or Jch.
   */
  colorspace?: Colorspaces;
  /**
   * Specify the parsing behaviour and change output type of the `ColorToken`.
   */
  tokenOptions?: TokenOptions;
  /**
   * The easing function to use.
   * @param  t Any value between 0 and 1
   * @returns A number.
   */
  easingFn?: (t: number) => number;

  /**
   * The type of hue fixup to apply to the hue channels during interpolation.
   */
  hueFixup?: "longer" | "shorter";

  /**
   * The amount of samples to return in the result collection.
   */
  num?: number;

  /**
   * The type of the spline interpolation method. Default is basis.
   */
  kind?: "basis" | "monotone" | "natural";
  /**
     Optional parameter to return the `'closed'` variant of the 'kind' of interpolation method which can be useful for cyclical color scales. Default is `false`
     */
  closed?: boolean;
};

/**
 * Options for the `pair()` palette generator function.
 */
export type PairedSchemeOptions = InterpolatorOptions & {
  /**
   * The color to pass through during interpolation.
   */
  via?: Tone;

  /**
   * The hue angle to increment each iteration with.
   */
  hueStep?: number;
};

/**
 * Options for the `earthtone()` palette generator function.
 */
export type EarthtoneOptions = InterpolatorOptions & {
  /**
   * *  earthtone The earthtone to interpolate with.
   */
  earthtones?:
    | "light-gray"
    | "silver"
    | "sand"
    | "tupe"
    | "mahogany"
    | "brick-red"
    | "clay"
    | "cocoa"
    | "dark-brown"
    | "dark";
};
/**
 * Override for factor distributed palettes.
 */
export type DistributionOptions =
  & Pick<
    InterpolatorOptions,
    "hueFixup"
  >
  & {
    /**
     * The colorspace to distribute the specified factor in. Defaults to `lch` when the passed in mode has no `'chroma' | 'hue' | 'lightness'` channel
     */
    colorspace?: Colorspaces;
    /**
     * The extreme end for the `factor`  we wish to distribute. If `mean` is picked, it will map the `average` value of that factor in the passed in collection.
     */
    extremum?: "min" | "max" | "mean";

    /**
     * Exclude grayscale colors from the distribution operation. Default is `false`
     */
    excludeAchromatic?: boolean;
    /**
     * Specify the parsing behaviour and change output type of the `ColorToken`.
     */
    token?: TokenOptions;
    /**
     * Exclude the color with the specified `extremum` from the distribution operation. Default is `false`
     */
    excludeSelf?: boolean;

    /**
     * The factor(s) to distribute amongst each color token in the passed in collection.
     */
    factor: Array<Factor>;
  };

/**
 * Overrides for setting filtering criterion, expected ranges and other behaviour.
 */
export type FilterByOptions = {
  /**
   * The factor to use as a filtering criterion.
   *
   * Default is `'hue'`
   */
  factor?: Array<Factor>;

  /**
   * Return an array of {factor:number, color:ColorToken} objects instead of just color tokens.
   * Default is `false`.
   */
  factorObject?: boolean;

  /**
   * The targeted start and end ranges for the factor:
   *
   * * If a single `factor` is specified, `ranges` is expected to be an array.
   * * If multiple `factor`s are specified then `ranges` is expected to be an object with the factor(s) as keys and an array of the start and end as values.
   * * The start and end values can be either numbers or string expressions.
   * The end value is optional but the range value(s) are expected to be in an array.
   */
  ranges?:
    | {
      [F in Factor]?: Array<number | string>;
    }
    | Array<number | string>;

  /**
   * The color to compare the `factor` with. All the `factor`s are calculated between this color and the ones in the colors array. Only works for the `'distance'` and `'contrast'` factor.
   */
  against?: ColorToken;
  /**
   *  The mode colorspace to perform the sorting operation in. It is ignored when the factor is `'luminance' | 'contrast' | 'distance'`.
   */
  colorspace?: Colorspaces;
};

/**
 * Options for the `discover()` palette generator function.
 */
export type DiscoverOptions = {
  /**
   * The palette type to return.
   * Default is `undefined`
   */
  kind?: Array<SchemeType> | undefined;
  /**
   * The minimum distance between colors. May affect finally palette results.
   * Default is 0
   */
  minDistance?: number;

  /**
   * The minimum distance between colors. May affect finally palette results
   * Default is the `jnd` internal constant.
   */
  maxDistance?: number;

  /**
   * The colorspace to retrieve channel values from.
   */
  colorspace?: Colorspaces;
  /**
   * Specify the parsing behaviour and change output type of the `ColorToken`.
   */
  token?: TokenOptions;
};

/**
 * Overrides to specify the type of color blindness and filter intensity.
 */
export type DeficiencyOptions = {
  /**
   * The type of color vision deficiency.  Default is `'red'`
   */
  kind?: DeficiencyType;
  /**
   * The intensity of the filter. The exepected value is between [0,1]. Default is `0.1`.
   */
  severity?: number;
  /**
   * Specify the parsing behaviour and change output type of the `ColorToken`.
   */
  token?: TokenOptions;
};

/**
 * Overrides to customize the parsing and output behaviour.
 */
export type TokenOptions = {
  /**
   * The type of color token to return. Default is `'str'`.
   */
  kind?: "num" | "arr" | "obj" | "str";
  /**
   * If the `kind` is set to `'arr'` it will remove the mode string from color tuple. Default is `false`.
   */
  omitMode?: boolean;

  /**
   * If the `kind` is set to `'arr'` it will remove the alpha channel value from color tuple. Default is `false`.
   */
  omitAlpha?: boolean;

  /**
   * If `true` and the passed in color token is an array or plain object and in the `srcMode` of `'rgb'` or `'lrgb'`,
   * it will have all channels normalized back to [0,1] range if any of the channe values is beyond 1.
   *
   * This can help the parser to recognize RGB colors in the [0,255] range which Culori doesn't handle.
   *
   * Default is `true`.
   */
  normalizeRgb?: boolean;

  /**
   * The type of number to return. Only valid if kind is set to `'number'`. Default is `'literal'`
   */
  numType?: "expo" | "hex" | "oct" | "bin";

  /**
   *  The mode in which the channel values are valid in. It is used for color arrays if they have the `colorspace` string ommitted. Default is `'rgb'`.
   */
  srcMode?: Colorspaces;

  /**
   * The colorspace in which to return the color object or array in. Default is `'lch'`.
   */
  targetMode?: Colorspaces;
};

/**
 * The default structure of a `Stats` object as returned by `stats()` when invoked with default `options`.
 */
export type Stats = {
  [T in Factor]: {
    extremums?: Array<number>;
    colors?: ColorToken[];
    against?: ColorToken | null;
    mean?: number;
    families?: Array<BiasedHues | "gray">;
  } & {
    colorspace?: Colorspaces;
    achromatic?: number;
  };
};

export type IdentityFunc = (
  x: unknown,
) => unknown;

/**
 * Options for specifying sorting conditions.
 */
export type SortByOptions = {
  /**
   * Use the `against` comparison color when ordering the color tokens.
   *
   * It has no effect on `contrast` and `distance` factors because they're already relative.
   */
  relative?: boolean;

  /**
   * Return an array of {factor:number, color:ColorToken} objects instead of just color tokens.
   * Default is `false`.
   */
  factorObject?: boolean;

  /**

   * The factor to use for sorting the colors.
   */
  factor?: Array<Factor>;
  /**
   * The arrangement order of the colors either `asc | desc`. Default is ascending (`asc`).
   */
  order?: "asc" | "desc";
  /**
   * The color to compare the `factor` with.
   * All the `factor`s are calculated between this color and the ones in the colors array.
   * Only works for the `'distance'` and `'contrast'` factor.
   */
  against?: ColorToken;
  /**
   * The colorspace to perform the sorting operation in. It is ignored when the factor is `'luminance' | 'contrast' | 'distance'`.
   */
  colorspace?: Colorspaces;
};

/**
 * Optional parameters to specify how the data should be computed.
 */
export type StatsOptions = {
  /**
   * The color to compare the `factor` with. All the `factor`s are calculated between this color and the ones in the colors array. Only works for the `'distance'` and `'contrast'` factor.
   */
  against?: ColorToken;
  /**
   * The colorspace to perform the sorting operation in. It is ignored when the factor is `'luminance' | 'contrast' | 'distance'`.
   */
  colorspace?: Colorspaces;

  /**
   * Choose whether to use the `against` color token for factors that support it as an overload (that is, all factors except `distance` and `contrast)
   */
  relative?: boolean;
  factor?: Array<Factor>;
};

/**
 * Options for the `scheme()` palette generator function.
 */
export type SchemeOptions =
  & Pick<
    InterpolatorOptions,
    "easingFn" | "colorspace"
  >
  & {
    kind?: Array<SchemeType> | undefined;
    token?: TokenOptions;
  };

/**
 * Options for the `hueshift()` palette generator function.
 */
export type HueshiftOptions =
  & Pick<
    InterpolatorOptions,
    | "colorspace"
    | "easingFn"
    | "num"
    | "tokenOptions"
  >
  & {
    /**
     * *  minLightness  Minimum lightness value (range 0-100).
     */
    minLightness?: number;
    /**
     *  maxLightness  Maximum lightness value (range 0-100).
     */
    maxLightness?: number;

    /**
     * The hue angle to increment each iteration with.
     */
    hueStep?: number;
  };

/**
 * The tone to use.
 */
export type Tone = "light" | "dark";

/**
 * The type of color vision defeciency.
 */
export type DeficiencyType =
  | "red"
  | "blue"
  | "green"
  | "mono";

/**
 * Hue biases as seen when transitioning from one hue to another on the color wheel (Lch).
 */
export type BiasedHues =
  | "red-purple"
  | "yellow-red"
  | "green-yellow"
  | "blue-green"
  | "purple-blue";

/**
 * The `diverging` color scheme in the ColorBrewer colormap.
 */
export type DivergingScheme =
  | "Spectral"
  | "RdYlGn"
  | "RdBu"
  | "PiYG"
  | "PRGn"
  | "RdYlBu"
  | "BrBG"
  | "RdGy"
  | "PuOr";

/**
 * The `qualitative` color scheme in the ColorBrewer colormap.
 */
export type QualitativeScheme =
  | "Set2"
  | "Accent"
  | "Set1"
  | "Set3"
  | "Dark2"
  | "Paired"
  | "Pastel2"
  | "Pastel1";

/**
 * The `sequential` color scheme in the ColorBrewer colormap.
 */
export type SequentialScheme =
  | "OrRd"
  | "PuBu"
  | "BuPu"
  | "Oranges"
  | "BuGn"
  | "YlOrBr"
  | "YlGn"
  | "Reds"
  | "RdPu"
  | "Greens"
  | "YlGnBu"
  | "Purples"
  | "GnBu"
  | "Greys"
  | "YlOrRd"
  | "PuRd"
  | "Blues"
  | "PuBuGn"
  | "Viridis";

/**
 * Any recognizable color token.
 */
export type ColorToken =
  | number
  | ColorTuple
  | boolean
  | string
  | object;

/**
 * The color property being queried.
 */
export type Factor =
  | "luminance"
  | "chroma"
  | "contrast"
  | "distance"
  | "lightness"
  | "hue";

/**
 * The `colorspace` or `mode` to use.
 */
export type Colorspaces =
  | "lab"
  | "rgb"
  | "lch"
  | "lch65"
  | "xyz65"
  | "xyz"
  | "lrgb"
  | "hsv";
/**
 * The value of the Tailwind color.
 */
export type ScaleValues =
  | "050"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900"
  | "950";

/**
 * Color families in the default TailwindCSS palette.
 */
export type Tailwind =
  | "indigo"
  | "gray"
  | "zinc"
  | "neutral"
  | "stone"
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "sky"
  | "blue"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose";

/**
 * The basic color families (including gray).
 */
export type ColorFamily =
  | "red"
  | "green"
  | "blue"
  | "yellow"
  | "red"
  | "purple"
  | "gray";

export type LightnessOptions = {
  amount?: number;
  darken?: boolean;
};
