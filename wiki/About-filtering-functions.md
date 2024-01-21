
# About filtering functions

The library has a `filterBy` module which has functions for filtering collections of colors using different properties of color.

The functions take  `start` and `end` to define the range value to pass as truthy. It can also take expression strings as the `start` parameter. The `end` parameter accepts a `number` only at the moment.

If the `end` is smaller than the `start` then the values are swapped. This helps avoid returning empty arrays or other weird outputs.

## Normalizable factors and ranges

The normalizable factors at the time of writing are `saturation/chroma` and `lightness`. More details about the behaviour is in the docs and [can be seen here]()

Though this behaviour will try to make sense of the input, try to pass in the expected ranges [as defined here in the Colorspaces section of the Culori docs]()

## Gotchas

One of the common pitfalls are when you pass in range(s) that have qualifying color in the collection in which case you'll just get an empty array. For example, if you pass in the starting range as `0.5` in a collection that has colors with the factor being queried smaller than it.

Be sure to pass in your expected ranges cautiously.

## Defaults

The `end` is the maximum value of the factor being queried. For example, for lightness in the `colorspace` Lch its 100 and for contrast its 21 (black on white)
