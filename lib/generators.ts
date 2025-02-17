import {
  averageNumber,
  easingSmoothstep,
  fixupHueLonger,
  fixupHueShorter,
  interpolate,
  interpolatorSplineBasis,
  interpolatorSplineBasisClosed,
  interpolatorSplineMonotone,
  interpolatorSplineMonotoneClosed,
  interpolatorSplineNatural,
  interpolatorSplineNaturalClosed,
  random,
  samples,
} from "culori/fn";
import {
  adjustHue,
  and,
  ci,
  dstnce,
  ef,
  entries,
  eq,
  gt,
  gte,
  hi,
  inRange,
  iterator,
  keys,
  li,
  lt,
  lte,
  max,
  mcchn,
  min,
  not,
  or,
  rand,
  values,
} from "./internal.ts";
import { mc, token } from "./utils.ts";
import type {
  Collection,
  ColorToken,
  DiscoverOptions,
  EarthtoneOptions,
  HueshiftOptions,
  InterpolatorOptions,
  PairedSchemeOptions,
  SchemeOptions,
} from "./types.d.ts";

/**
 * Creates a palette of hue shifted colors from the passed in color.
 *
 * :::tip
 *
 * Hue shifting means that:
 *
 * * As a color becomes lighter, its hue shifts up (increases).
 * * As a color becomes darker its hue shifts down (decreases).
 *
 * The `minLightness` and `maxLightness` values determine how dark or light our color will be at either extremum respectively.'
 *
 * :::
 *
 *  The length of the resultant array is the number of samples (`num`) multiplied by 2 plus the base color passed in or simply `(num * 2) + 1`.
 *
 * @param baseColor The color to use as the base of the palette.
 * @param options The optional overrides object.

 * @example
 * import { hueshift } from "huetiful-js";

let hueShiftedPalette = hueShift("#3e0000");

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
function hueshift(
  baseColor?: ColorToken,
  options: HueshiftOptions = {},
): Collection {
  let { num, hueStep, minLightness, maxLightness, easingFn, tokenOptions } = or(
    options,
    {},
  ) as HueshiftOptions;

  easingFn = or(easingFn, ef);
  // @ts-ignore:
  num = or(num, 6) + 1;
  hueStep = or(hueStep, 5);
  baseColor = token(baseColor, {
    kind: "obj",
    targetMode: "lch",
  }) as ColorToken;
  const z = [baseColor];

  // // if value is beyond max normalize all the values ensuring that the end is higher than start
  // // and that if minval was less than max range we will get that channel's equivalent value on the [0,100] scale.

  // @ts-ignore:
  maxLightness = lte(maxLightness, 95) ? maxLightness : 90;
  // @ts-ignore:
  minLightness = lte(minLightness, maxLightness) ? minLightness : 5;

  /**
   * @internal
   * Normalizes any value in the range [0,1] to the ranges supported by the colorspace
   */
  const f = (i: number, e1: number, e2: number) =>
    Math.abs(
      // @ts-ignore:
      ((i - 0) / (e1 - 0)) * (e2 - baseColor?.l) + baseColor?.l,
    );

  // Maximum number of iterations possible.
  //Each iteration add a darker shade to the start of the array and a lighter tint to the end.

  for (let i = 1, j = i / num; i < num; i++) {
    //adjustHue checks hue values are clamped.
    // Here we use lightnessMapper to calculate our lightness values which takes a number that exists in range [0,1].
    const [y, x] = [
      { // @ts-ignore:
        l: f(i, num, minLightness),
        // @ts-ignore:
        c: baseColor?.c,
        // @ts-ignore:
        h: adjustHue(baseColor.h - hueStep * easingFn(j)),
        mode: "lch",
      },
      { // @ts-ignore:
        l: f(i, num, maxLightness),
        // @ts-ignore:
        c: baseColor?.c,
        // @ts-ignore:
        h: adjustHue(baseColor.h + hueStep) * easingFn(j),
        mode: "lch",
      },
    ];

    z.push(x as ColorToken);
    z.unshift(y as ColorToken);
  }

  return Array.from(new Set(z)).map((c) => token(c, tokenOptions));
}

/**
 * Returns a random pastel variant of the passed in color token.
 *
 * :::tip
 * Pastel colors are those soft hued colors like baby blue,pink and mauve.
 *
 * :::
 *
 * @param baseColor The color to return a pastel variant of.
 * @param options
 * @example
 *
import { pastel } from 'huetiful-js'

console.log(pastel("green"))

// #036103ff
 */
function pastel(
  baseColor?: ColorToken,
): ColorToken {
  const w = [
      [0.3582677165354331, 0.996078431372549, 16538982.504333857],
      [0.4395161290322581, 0.9725490196078431, 15694401.836627495],
      [0.472, 0.9803921568627451, 15986490.838712374],
      [0.3305785123966942, 0.9490196078431372, 14834893.772825705],
      [0.2992125984251969, 0.996078431372549, 7446012.731034764],
      [0.38818565400843885, 0.9294117647058824, 8247112.202928809],
    ],
    [u, v] = [w.map((o) => o[0]), w.map((o) => o[1])];

  const t = {
    ms: averageNumber(u),
    ml: averageNumber(v),
    mns: min(u),
    mxs: max(u),
    mnv: min(v),
    mxv: max(v),
  };
  // @ts-ignore:

  const q = random("hsv", {
    s: [t.mns, t.mxs],
    v: [t.mnv, t.mxv],
    // @ts-ignore:
    h: token(baseColor, { targetMode: "hsv", kind: "obj" }).h,
  });

  return q;
}

/**
 * Creates a palette that consists of a `baseColor` that is incremented by a `hueStep` to get the final color to pair with.
 * The colors are then spline interpolated via white or black.
 *
 * :::tip
 *
 * A negative `hueStep` will pick a color that is `hueStep` degrees behind the base color.
 *
 * :::
 * @param baseColor The color to return a paired color scheme from.
 * @param options The optional overrides object to customize per channel options like interpolation methods and channel fixups.

 * @example
 *
 * import { pair } from 'huetiful-js'

console.log(pair("green",{hueStep:6,num:4,tone:'dark'}))
// [ '#008116ff', '#006945ff', '#184b4eff', '#007606ff' ]
 */
function pair(
  baseColor?: ColorToken,
  options?: PairedSchemeOptions,
): Collection | ColorToken {
  let { num, via, hueStep, colorspace } = options as PairedSchemeOptions;
  via = or(via, "light");
  hueStep = or(hueStep, 5);
  colorspace = or(colorspace, "lch65");

  // get the hue of the passed in color and add it to the step which will result in the final color to pair with
  const destinationColor = mc(`${colorspace}.h`)(
    baseColor,
    // @ts-ignore:
    Math.abs(
      // @ts-ignore:
      mc(`${colorspace}.h`)(baseColor) + (lt(hueStep, 0) ? -hueStep : hueStep),
    ),
  );

  const tone = {
    dark: { l: 0, c: 0, h: 0, mode: colorspace },
    light: { l: 100, c: 0, h: 0, mode: colorspace },
  }[via as string];

  return interpolator([baseColor, tone, destinationColor], {
    colorspace: "lch",
    // @ts-ignore:
    num: num * 2,
    tokenOptions: options?.tokenOptions,
    // @ts-ignore:
  }).slice(0, num);
}

/**
 * Interpolates the passed in colors and returns a color scale that is evenly split into `num` amount of samples.
 *
 * The interpolation behaviour can be overidden allowing us to get slightly different effects from the same `baseColors`.
 *
 * The behaviour of the interpolation can be customized by:
 *
 * * Changing the `kind` of interpolation
 *
 * 	* natural
 * 	* basis
 * 	* monotone
 * * Changing the easing function (`easingFn`)
 *
 * :::tip
 * * To create a color scale for cyclic values pass `true` to the `closed` parameter in the `options` object.
 * * If `num` is 1 then a single color is returned from the resulting interpolation with the internal `t` value at `0.5` else a collection of the `num` of color scales is returned.
 * * If the collection of colors contains an achromatic color, the resulting samples may all be grayscale or pure black.
 * :::
 *
 * @param baseColors The collection of colors to interpolate. If a color has a falsy channel for example black has an undefined hue channel some interpolation methods may return NaN affecting the final result or making all the colors in the resulting interpolation gray.
 * @param  options Optional overrides to customize parameters such as interpolation methods and per channel eeasings.
 * @returns
 *
 * @example
 *
 * import { interpolator } from 'huetiful-js';

console.log(interpolator(['pink', 'blue'], { num:8 }));

// [
  '#ffc0cb', '#ff9ebe',
  '#f97bbb', '#ed57bf',
  '#d830c9', '#b800d9',
  '#8700eb', '#0000ff'
]
 *
 */
function interpolator(
  baseColors: Collection = [],
  options: InterpolatorOptions = {},
): Array<ColorToken> | ColorToken {
  let { hueFixup, stops, easingFn, kind, closed, colorspace, num } = options ||
    {};
  // Set the internal defaults
  easingFn = or(easingFn, ef);
  kind = or(kind, "basis");
  num = or(num, 1);
  // @ts-ignore:
  hueFixup = hueFixup === "shorter" ? fixupHueShorter : fixupHueLonger;
  const method = {
    basis: or(
      and(closed, interpolatorSplineBasisClosed),
      interpolatorSplineBasis,
    ),
    natural: or(
      and(closed, interpolatorSplineNaturalClosed),
      interpolatorSplineNatural,
    ),
    monotone: or(
      and(closed, interpolatorSplineMonotoneClosed),
      interpolatorSplineMonotone,
    ),
  }[kind as string];

  const len = stops?.length as number;

  const data = gt(len, 0)
    // @ts-ignore:
    ? values(baseColors)?.slice(0, len - 1).map((c, i) => [c, stops[i]]).concat(
      values(baseColors).slice(len),
    )
    : values(baseColors);

  // @ts-ignore:
  const func = interpolate([...data, easingFn], colorspace, {
    // @ts-ignore:
    h: {
      fixup: hueFixup,
      use: or(method, hi),
    },
    [mcchn("l", colorspace, false)]: {
      use: or(method, li),
    },
    [mcchn("c", colorspace, false)]: {
      use: or(method, ci),
    },
  });

  // make sure samples is an absolute integer
  // @ts-ignore:
  num = or(and(gte(num, 1), Math.abs(num)), 1);

  return or(
    and(
      gt(num, 1),
      //  @ts-ignore:
      samples(num).map((s) => token(func(s), options?.tokenOptions)),
    ),
    // @ts-ignore:
    token(func(0.5), options?.tokenOptions),
  );
}

/**
 * Takes a collection of colors and finds the nearest matches using the `differenceHyab()` color difference metric for a set of predefined palettes.
 *
 * The function returns different values based on the `kind` parameter passed in:
 *
 * * An array of colors for the `kind` of scheme, if the `kind` parameter is specified.
 * * Else it returns an object of all the palette types as keys and their values as an array of colors.
 * :::caution
 * If no colors are valid for the palette types it returns an empty array for the palette results. It does not work with achromatic colors thus they're excluded from the resulting collection.
 * :::
 *
 * @param  colors The collection of colors to create palettes from. Preferably use 6 or more colors for better results.
* @param  options
 * @example
 *
 * import { discover } from 'huetiful-js'

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

console.log(discover(sample, { kind:'tetradic' }))
// [ '#ffff00ff', '#00ffdcff', '#310000ff', '#720000ff' ]
 */
function discover(
  colors: Collection = [],
  options: DiscoverOptions = {
    maxDistance: 0.0014,
    minDistance: 0,
    kind: undefined,
  },
): Collection {
  //  Initialize and sanitize parameters
  const colorTokenValues = values(colors),
    colorTokenKeys = keys(colors);
  const { kind, maxDistance, minDistance } = options || {};

  const palettes = {},
    customInRange = (c: string, d: string) =>
      inRange(dstnce(c)(d), minDistance, maxDistance),
    availableColors = (arg: string, obj = {}) =>
      // @ts-ignore:
      obj[arg]?.filter((c) =>
        colorTokenValues.some((d) => not(customInRange(c, d)))
      );
  // Create the classic palettes per valid color token  in the collection

  for (const key of colorTokenKeys) {
    // @ts-ignore:
    palettes[key] = scheme(colors[key], { kind: kind });
  }

  // @ts-ignore:
  let currentPalette = [];
  for (const key of colorTokenKeys) {
    if (eq(typeof kind, "string")) {
      // @ts-ignore:
      palettes[key] = availableColors(key, palettes);
      if (gt(currentPalette.length, 1)) {
        // @ts-ignore:
        palettes[key] = palettes[key].filter((a, b) =>
          // @ts-ignore:
          not(customInRange(a, currentPalette[b]))
        );
      }

      // @ts-ignore:
      currentPalette = palettes[key];
    } else {
      // if the color token value is an object, iterate through the available palette keys
      // @ts-ignore:
      for (const paletteType of keys(palettes[key])) {
        // @ts-ignore:
        palettes[key][paletteType] = availableColors(
          paletteType,
          // @ts-ignore:
          palettes[key],
        );
      }
    }
  }

  // @ts-ignore:
  return palettes;
}

/**
 * Creates a color scale between an earth tone and any color token using spline interpolation.
 * @param  baseColor The color to interpolate an earth tone with.
 * @param  options Optional overrides for customising interpolation and easing functions.
 * @example
 *
 * import { earthtone } from 'huetiful-js'


console.log(earthtone("pink",'lch',{earthtones:'clay',samples:5 }))
// [ '#6a5c52ff', '#8d746aff', '#b38d86ff', '#d9a6a6ff', '#ffc0cbff' ]

 */
function earthtone(
  baseColor?: ColorToken,
  options: EarthtoneOptions = {},
): ColorToken | Array<ColorToken> {
  let { num, earthtones, colorspace, kind, closed } = options;

  earthtones = or(earthtones, "dark");
  const earthtoneSamples = {
    "light-gray": "#e5e5e5",
    silver: "#f5f5f5",
    sand: "#c2b2a4",
    tupe: "#a79e8a",
    mahogany: "#958c7c",
    "brick-red": "#7d7065",
    clay: "#6a5c52",
    cocoa: "#584a3e",
    "dark-brown": "#473b31",
    dark: "#352a21",
  };
  // @ts-ignore:
  const currentEarthtone = earthtoneSamples[earthtones.toLowerCase()];

  return interpolator([currentEarthtone, baseColor], {
    colorspace: colorspace,
    num: num,
    closed: closed,
    kind: kind,
    tokenOptions: options?.tokenOptions,
  });
}

/**
 * Generates a randomised classic scheme from the passed in color.
 *
 * The `kind` parameter can either be an array or `undefined`:
 *
 * * If it is an array, each element should be a valid `kind` of scheme.
 * It will return a color map with the array elements (which are valid schemes)  as keys.
 * Duplicate schemes are simply ignored.
 * * If it is falsy it will return a color map of all palettes.
 *
 * :::tip
 *
 * The classic schemes are are:
 *
 * * `triadic` - Picks 3 colors 120 degrees apart.
 * * `tetradic` - Picks 4 colors 90 degrees apart.
 * * `complimentary` - Picks 2 colors 180 degrees apart.
 * * `mono` - Picks `num` amount of colors from the same hue family   .
 * * `analogous` - Picks 3 colors 12 degrees apart.
 * :::
 *
 * :::note
 *
 * Note that the `num` parameter works on the `monochromatic` palette type only. Other schemes will return a constant amount of samples.
 *
 * :::
 *
 * @param baseColor The color to create the palette(s) from.
 * @param options Optional overrides.
 * @example
 *
 import { scheme } from 'huetiful-js'

console.log(scheme("triadic")("#a1bd2f"))
// [ '#a1bd2fff', '#00caffff', '#ff78c9ff' ]
 */
// @ts-ignore:
function scheme(
  baseColor?: ColorToken,
  options: SchemeOptions = {
    colorspace: "lch",
    kind: ["analogous"],
    easingFn: ef,
  },
): Collection {
  const { colorspace, kind, easingFn } = options || {};

  // @ts-ignore:
  baseColor = token(baseColor, { targetMode: colorspace, kind: "obj" });

  // // extremums
  const [lowMin, lowMax, highMin, highMax] = [0.05, 0.495, 0.5, 0.995],
    // @ts-ignore:
    generateSteps = (stops, step) => {
      const res: unknown[] = [];

      for (let [k, v] of entries(samples(stops))) {
        v = adjustHue(
          // @ts-ignore:
          (baseColor.h + step) * (v * or(easingFn, easingSmoothstep)(v)),
        );
        // @ts-ignore:
        res[k] = rand(v * lowMax, v * lowMin) +
          rand(v * highMax, v * highMin) / 2;
      }
      return res;
    },
    PALETTE_TYPES = {
      analogous: generateSteps(3, 12),
      triadic: generateSteps(3, 120),
      tetradic: generateSteps(4, 90),
      complimentary: generateSteps(2, 180),
    },
    // @ts-ignore:
    callback = (kind) => {
      // // For each step return a  random value between lowMin && lowMax multipied by highMin && highMax and 0.9 of the step

      // // The map for steps to obtain the targeted palettes

      const [lightnessChan, chromaChan] = ["l", "c"].map((a) =>
          mcchn(a, colorspace, false)
        ),
        // @ts-ignore:
        palettes = [];
      // @ts-ignore:
      for (const [idx, step] of entries(PALETTE_TYPES[kind])) {
        // @ts-ignore:
        palettes[idx] = token(
          {
            // @ts-ignore:
            [lightnessChan]: baseColor[lightnessChan],
            // @ts-ignore:
            [chromaChan]: baseColor[chromaChan],
            // @ts-ignore:
            h: adjustHue(baseColor.h + step),
            mode: colorspace,
          },
          options?.token,
        );
      }
      // @ts-ignore:
      palettes.shift();
      // @ts-ignore:
      return palettes;
    };

  return iterator(kind, callback, keys(PALETTE_TYPES));
}

export { discover, earthtone, hueshift, interpolator, pair, pastel, scheme };
