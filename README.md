![huetiful-logo](./logo.svg)

[![Deploy GitHub Pages](https://github.com/xml-wizard/huetiful/actions/workflows/deploy-docs.yml/badge.svg?branch=main)](https://github.com/xml-wizard/huetiful/actions/workflows/deploy-docs.yml)
[![NPM publish 📦](https://github.com/xml-wizard/huetiful/actions/workflows/release-please.yml/badge.svg)](https://github.com/xml-wizard/huetiful/actions/workflows/release-please.yml)

[huetiful-js](www.huetiful-js.com) is a **small** (~10kB) & **fast** library for color manipulation written in JavaScript.

It is function oriented and borrows a lot of its features from color theory but tries to hide away the science from the developer.

The library aims to parse colors from as many types as possible allowing freedom to define our color tokens as we see fit as well as parse colors from other source. For instance, methods such as the HTML `Canvas` API's `getImageData()` method. The collection methods try to be as generic as possible by treating `ArrayLike` and `Map`-like objects as valid color collections so long as the values are parseable color tokens.

It uses [Culori](https://culorijs.org/api/) under the hood which provides access to low level functions for color conversions and other necessary bells and whistles that this library depends on. It works both in Node and the browser.

### Features

- [Filtering collections of colors](https://huetiful-js.com/api/filterBy) by using the values of their properties as ranges. For example `distance` against a comparison color and `luminance`.
- [Sorting collections of colors](https://huetiful-js.com/api/sortBy) by their properties. For example using `saturation` or `hue` in either descending or ascending order
- [Creating custom palettes and color scales](https://huetiful-js.com/api/generators)
- [Manipulating individual color tokens](https://huetiful-js.com/api/utils) for example setting and querying properties as well as querying their properties i.e chromaticity.
- [Calculating values of central tendency and other statistical values](https://huetiful-js.com/api/stats) from collections of colors
- [Wrapping collections of colors/individual color tokens](https://huetiful-js.com/api/wrappers) similar to Lodash's `_.chain` utility allowing method chaining before returning our final output.
- [Color maps for Colorbrewer, TailwindCSS and CSS named colors](https://huetiful-js.com/api/colors)
- [Converting colors across different types](https://huetiful-js.com/api/converterters) including numbers, strings (all CSS parseable string represantations of color), plain objects, arrays and even boolean values

## Installation

> As of v3.0.0 the library is ESM only. You can [compile your own UMD build from source](https://github.com/xml-wizard/huetiful) if you want it.

### Using a package manager

Assuming you already have Node already installed, you can add the package using npm/yarn or any other Node based package manager:

```bash
npm i huetiful-js
```

Or:

```bash
yarn add huetiful-js
```

#### Quick check :smile:

```js

import { achromatic, stats, colors } from 'huetiful-js';

let all = colors('all')
let grays = all.filter(achromatic)

console.log(grays)

console.log(stats(all))

```

### In the browser and via CDNs

You can use also a CDN in this example, jsdelivr to load the library remotely:

> Make sure to set the `type` of the script tag to module when you load it in your HTML.

```js
import {...} from 'https://cdn.jsdelivr.net/npm/huetiful-js/lib/huetiful.esm.js'

```

Or load the library asyour HTML file using a `<script>` tag:

```html
# With script tag

<script type='module' src='https://cdn.jsdelivr.net/npm/huetiful-js/dist/huetiful.js'></script


# Or, if you like it this way

<script>

import { colors } from 'https://cdn.jsdelivr.net/npm/huetiful-js/dist/huetiful.esm.js'

let myPalette = colors('all','700')

</script>



```

## Quickstart

[See the Quickstart here](https://huetiful-js.com/quickstart)

## Community

We'd love to hear your feedback and suggestions :rocket:!

[See the discussions](https://github.com/xml-wizard/huetiful/discussions) and just say hi, or share a coding meme (whatever breaks the ice🏔️)

## Contributing

This project is fully open source! Contributions of any kind are greatly appreciated! See🔍 the [contributing page on the documentation site](https://huetiful-js.com/contributing) file for more information on how to get started.

### References

This project is a result of open source resources from many places all over the Internet.

[See some of the references here](https://huetiful-js.com/references)

 <pre>
 License ⚖️

 © 2024, <a href="https://deantarisai.me">Dean Tarisai</a> & <a href="https://github.com/xml-wizard">xml-wizard contributors</a>
 Released under the  <a href="http://www.apache.org/licenses/LICENSE-2.0">Apache 2.0</a> license.</h5>
 🧪 & 🔬 with 🥃 in Crowhill,ZW</pre>
