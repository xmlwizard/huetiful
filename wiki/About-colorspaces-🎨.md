
# About colorspaces

This library makes use of the predefined colorspaces provided by Culori. Information about the expected channel ranges, supported colorspaces and other related information on how the library handles them  [can be found here](https://culorijs.org/color-spaces/)

## Channel range normalization

Because of how Culori defines its colorspaces it may feel unintuitive to, let's say for example pass RGB channel values in the range [0,1] since most developers are familiar of the [0,255] range, which isn't compatible with Culori and will return unexpected results:

```js

import { formatHex } from 'culori';

// The range [0,1] expected by Culori
let colorA = { r: 1, g: 0.5, b: 0.05, mode: 'rgb' };
console.log(formatHex(colorA));
// #ff800d

// Also a valid range but not supported by Culori
let colorB = { r: 100, g: 58, b: 43.51, mode: 'rgb' };
console.log(formatHex(colorB));
// #ffffff


```

Note that `colorB` is returned as pure white. This same color token will return the correct color if we pass it to the `toHex` converter, which is generic:

```js

import { toHex } from 'huetiful-js';

let colorB = { r: 100, g: 58, b: 43.51, mode: 'rgb' };

console.log(toHex(colorB));
// #643a2c


```

The `toHex` utility will treat the color to be in the range [0,255] if any of the channel values is greater than 1. This is in contrast to the way Culori handles such a scenario where it will just clamp the values to the [0,1] ranges. The formula is very simple: `channel / 255` which will give us our channel value in the supported range. This behaviour also applies to color tokens passed as arrays.