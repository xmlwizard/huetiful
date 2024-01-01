export type UniformColorSpaces = 'lch' | 'jch';
export type ColorTuple = [string, number, number, number, number?];

export type ColorObject = { mode: ColorSpaces; alpha?: number };
export type ColorOptions = {
  alpha?: number;
  lightness?: number;
  temperature?: number;
  colorspace?: HueColorSpaces;
  luminance?: number;
  saturation?: number;
  illuminant?: 'D50' | 'D65';

  lightMode?: ColorToken;
  darkMode?: ColorToken;

  contrast?: number;
  colorSpace?: HueColorSpaces;
};
export type ColorDistanceOptions = {
  weights?: [number, number, number, number];
  mode?: ColorSpaces;
};

/**
 * @type
 * @description This object returns the lightMode and darkMode optimized version of a color with support to add color vision deficiency simulation to the final color result.
 */
export type AdaptivePaletteOptions = {
  backgroundColor?: { light?: ColorToken; dark?: ColorToken };
  viewingConditions?: ViewingConditions;
  colorBlind?: boolean;
};

export type InterpolatorOptions = Pick<
  Options,
  | 'easingFunc'
  | 'hueInterpolator'
  | 'chromaInterpolator'
  | 'hueFixup'
  | 'lightnessInterpolator'
>;

/**
 * @type
 * @description The override parameters for palette functions.
 */
type Options = {
  /**
   * The easing function to use.
   * @param t Any value between 0 and 1
   * @returns A number.
   */
  easingFunc?: (t: number) => number;

  /**
   *@param The interpolation method to use on the hue channel.
   */
  hueInterpolator?: Interpolator;

  /**
   *@param The interpolation method to use on the chroma channel.
   */
  chromaInterpolator?: Interpolator;

  /**
   *@param The type of hue fixup to apply to the hue channels during interpolation.
   */
  hueFixup?: (arr: number[]) => number[];

  /**
   *@param The interpolation method to use on the lightness channel.
   */
  lightnessInterpolator?: Interpolator;
  /**
   *@param The color to pass through during interpolation.
   */
  via?: Tone;

  /**
   *@param The amount of hue angles to increment each iteration with.
   */
  hueStep?: number;

  /**
   * * @param earthtone The earthtone to interpolate with.
   */
  earthtones?:
    | 'light-gray'
    | 'silver'
    | 'sand'
    | 'tupe'
    | 'mahogany'
    | 'brick-red'
    | 'clay'
    | 'cocoa'
    | 'dark-brown'
    | 'dark';

  /**
   *@param The amount of samples to return in the result collection.
   */
  samples?: number;

  /**
   * * @param minLightness  Minimum lightness value (range 0-100).
   */
  minLightness?: number;
  /**
   * @param maxLightness  Maximum lightness value (range 0-100).
   */
  maxLightness?: number;
};

type ViewingConditions = {
  adaptingLuminance?: number;
  backgroundLuminance?: number;
  discounting?: boolean;
  surroundType?: 'dim' | 'dark' | 'average';
  whitePoint?: Illuminant;
};
export type PairedSchemeOptions = Omit<
  Options,
  'earthtones' | 'maxLightness' | 'minLightness'
>;
export type EarthtoneOptions = Omit<
  Options,
  'hueStep' | 'via' | 'maxLightness' | 'minLightness'
>;

export type HueShiftOptions = Omit<Options, 'via' | 'earthtones' | ''> &
  InterpolatorOptions;
export type Interpolator = (arr: number[]) => (t: number) => number;
export type Tone = 'light' | 'dark';
export type DeficiencyType = 'red' | 'blue' | 'green' | 'monochromacy';
export type HueFamily =
  | 'red-purple'
  | 'red'
  | 'yellow-red'
  | 'yellow'
  | 'green-yellow'
  | 'green'
  | 'blue-green'
  | 'blue'
  | 'purple-blue'
  | 'purple';

export type DivergingScheme =
  | 'Spectral'
  | 'RdYlGn'
  | 'RdBu'
  | 'PiYG'
  | 'PRGn'
  | 'RdYlBu'
  | 'BrBG'
  | 'RdGy'
  | 'PuOr';
export type QualitativeScheme =
  | 'Set2'
  | 'Accent'
  | 'Set1'
  | 'Set3'
  | 'Dark2'
  | 'Paired'
  | 'Pastel2'
  | 'Pastel1';

export type SequentialScheme =
  | 'OrRd'
  | 'PuBu'
  | 'BuPu'
  | 'Oranges'
  | 'BuGn'
  | 'YlOrBr'
  | 'YlGn'
  | 'Reds'
  | 'RdPu'
  | 'Greens'
  | 'YlGnBu'
  | 'Purples'
  | 'GnBu'
  | 'Greys'
  | 'YlOrRd'
  | 'PuRd'
  | 'Blues'
  | 'PuBuGn'
  | 'Viridis';

/**
 * @type
 * @description Any recognizable color token.
 */
export type ColorToken = number | string | object | ColorTuple;

/**
 * @param
 * An array of baseColor tokens (in short, just an array of valid colors)
 */

/**
 * @type
 * The property being queried. Used in utilities that perform operations on collections.
 */
export type Factor =
  | 'luminance'
  | 'temp'
  | 'saturation'
  | 'contrast'
  | 'distance'
  | 'lightness'
  | 'hue';

type Order = 'asc' | 'desc';

type callback = unknown;

type FactorMapper = (
  factor: Factor,
  callback: callback,
  order?: Order,
  colorObj?: boolean
) => (colors: ColorToken[]) => ColorToken[];

export type ColorSpaces =
  | 'a98'
  | 'cubehelix'
  | 'dlab'
  | 'dlch'
  | 'hsi'
  | 'hsl'
  | 'hsv'
  | 'hwb'
  | 'jab'
  | 'jch'
  | 'lab'
  | 'lab65'
  | 'lch'
  | 'lch65'
  | 'lchuv'
  | 'lrgb'
  | 'luv'
  | 'okhsl'
  | 'okhsv'
  | 'oklab'
  | 'rgb';

export type HueColorSpaces =
  | 'jch'
  | 'hsl'
  | 'hsv'
  | 'hsi'
  | 'oklch'
  | 'lch'
  | 'hwb'
  | 'okhsl'
  | 'okhsv'
  | 'lch65'
  | 'lchuv'
  | 'dlch';

export type ScaleValues =
  | '100'
  | '50'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900';

export type HueMap = {
  indigo: {
    '50': string;
    '100': string;
    '200': string;
    '300': string;
    '400': string;
    '500': string;
    '600': string;
    '700': string;
    '800': string;
    '900': string;
  };
  gray: {
    '50': string;
    '100': string;
    '200': string;
    '300': string;
    '400': string;
    '500': string;
    '600': string;
    '700': string;
    '800': string;
    '900': string;
  };

  zinc: {
    '50': string;
    '100': string;
    '200': string;
    '300': string;
    '400': string;
    '500': string;
    '600': string;
    '700': string;
    '800': string;
    '900': string;
  };

  neutral: {
    '50': string;
    '100': string;
    '200': string;
    '300': string;
    '400': string;
    '500': string;
    '600': string;
    '700': string;
    '800': string;
    '900': string;
  };

  stone: {
    '50': string;
    '100': string;
    '200': string;
    '300': string;
    '400': string;
    '500': string;
    '600': string;
    '700': string;
    '800': string;
    '900': string;
  };

  red: {
    '50': string;
    '100': string;
    '200': string;
    '300': string;
    '400': string;
    '500': string;
    '600': string;
    '700': string;
    '800': string;
    '900': string;
  };

  orange: {
    '50': string;
    '100': string;
    '200': string;
    '300': string;
    '400': string;
    '500': string;
    '600': string;
    '700': string;
    '800': string;
    '900': string;
  };

  amber: {
    '50': string;
    '100': string;
    '200': string;
    '300': string;
    '400': string;
    '500': string;
    '600': string;
    '700': string;
    '800': string;
    '900': string;
  };

  yellow: {
    '50': string;
    '100': string;
    '200': string;
    '300': string;
    '400': string;
    '500': string;
    '600': string;
    '700': string;
    '800': string;
    '900': string;
  };

  lime: {
    '50': string;
    '100': string;
    '200': string;
    '300': string;
    '400': string;
    '500': string;
    '600': string;
    '700': string;
    '800': string;
    '900': string;
  };

  green: {
    '50': string;
    '100': string;
    '200': string;
    '300': string;
    '400': string;
    '500': string;
    '600': string;
    '700': string;
    '800': string;
    '900': string;
  };

  emerald: {
    '50': string;
    '100': string;
    '200': string;
    '300': string;
    '400': string;
    '500': string;
    '600': string;
    '700': string;
    '800': string;
    '900': string;
  };

  teal: {
    '50': string;
    '100': string;
    '200': string;
    '300': string;
    '400': string;
    '500': string;
    '600': string;
    '700': string;
    '800': string;
    '900': string;
  };

  sky: {
    '50': string;
    '100': string;
    '200': string;
    '300': string;
    '400': string;
    '500': string;
    '600': string;
    '700': string;
    '800': string;
    '900': string;
  };

  blue: {
    '50': string;
    '100': string;
    '200': string;
    '300': string;
    '400': string;
    '500': string;
    '600': string;
    '700': string;
    '800': string;
    '900': string;
  };

  violet: {
    '50': string;
    '100': string;
    '200': string;
    '300': string;
    '400': string;
    '500': string;
    '600': string;
    '700': string;
    '800': string;
    '900': string;
  };

  purple: {
    '50': string;
    '100': string;
    '200': string;
    '300': string;
    '400': string;
    '500': string;
    '600': string;
    '700': string;
    '800': string;
    '900': string;
  };

  fuchsia: {
    '50': string;
    '100': string;
    '200': string;
    '300': string;
    '400': string;
    '500': string;
    '600': string;
    '700': string;
    '800': string;
    '900': string;
  };

  pink: {
    '50': string;
    '100': string;
    '200': string;
    '300': string;
    '400': string;
    '500': string;
    '600': string;
    '700': string;
    '800': string;
    '900': string;
  };

  rose: {
    '50': string;
    '100': string;
    '200': string;
    '300': string;
    '400': string;
    '500': string;
    '600': string;
    '700': string;
    '800': string;
    '900': string;
  };
};

type ColorTemp = 'warm' | 'cool' | 'daylight' | 'incadescent' | 'fluorescent';
