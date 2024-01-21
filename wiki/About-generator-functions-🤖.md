
<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [What are generators](#what-are-generators)
  - [Uniform colorspaces](#uniform-colorspaces)
  - [Tips for generating palettes](#tips-for-generating-palettes)
    - [Tweak the default options](#tweak-the-default-options)
    - [Subtle adjustments usually yield better results](#subtle-adjustments-usually-yield-better-results)
    - [Use a base scheme](#use-a-base-scheme)
  - [Gotchas](#gotchas)

<!-- /code_chunk_output -->


# What are generators

These are functions that produce static swatches using customizable parameters to tweak the final output. Most of the library generator functions come along with an optional overrides object with the customizable properties as keys. Since this library is wwritten in TypeScript, you''ll get autocomplete and IntelliSense predictions (or similar feature depending on the code editor you are using) when you are typing.

Let's take a look at the `InterpolatorOptions`  overrides for example which is used by functions that use Culori's `interpolate()` function under the hood

```js
type InterpolatorOptions = {
    easingFunc?: (t: number) => number;
    hueInterpolator?: Interpolator;
    chromaInterpolator?: Interpolator;
    hueFixup?: (arr: number[]) => number[];
    lightnessInterpolator?: Interpolator;
}

```

All the above options are optional but can be tweaked to get a more customized output. [See the docs for more options supported]() by the generator functions.

## Uniform colorspaces

Perceptually uniform colorspaces make mapping the hue channel easier since the hue range taken by each hue family is more or less more equal than RGB based color models such as HSL or HWB. And on that note, the lightness of the colors is more consistent throughout the hue families. [George Francis explains this in his blogpost](https://tympanus.net/codrops/2021/12/07/coloring-with-code-a-programmatic-approach-to-design/)

All generator functions use the LCH colorspace with the D50 standard illuminant by default. This can be changed by tweaking the `colorspace` parameter.

## Tips for generating palettes

### Tweak the default options

In most cases, you're more likely to get pleasing results if you adjust the default options. The library depends on the creativity of the user to exploit the best possible end results.

### Subtle adjustments usually yield better results

For example, you may want to keep options like `hueStep` value low so that the colors produced are more harmonious and less clashing.

### Use a base scheme

If you want to explore the best possible color palettes consider starting from a base palette using `scheme()` and then mapping through the result array passing each color to a generator function. For example lets use `earthtone()`:

## Gotchas

There are scenarios where the generator functions may return duplicate colors in the returned result array.


If the `hueStep` multiplied by the number of `iterations` is greater than 360, the function will try to deduplicate the result array by converting it to an ES6  `Set()` object first. This may return fewer colors than expected from the passed in `iterations`. Caution and descretion should be kept in mind to minimize funky results.

A simple formula you can use to get the maximum number of safe iterations is `360 / hueStep`.
