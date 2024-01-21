# Changelog
Some of the major notable changes in the past releases.Please note that the list of changes is not final and is still a work in progress. More information will be updated from the Git commit history.


### v0.0.5

First publish, lots of broken code. Basically nothing worked well in this release. Deprecated

### v0.0.8

Rewrote the codebase in TypeScript. Eliminated dependancy on chroma-js. Finished the core-utils.
Added Tailwind colors as wrapper functions.

### v0.0.10

Added `filterBy` and `sortBy` modules for filtering and sorting collections of colors respectively. Released first beta documentation.

### 1.0.0

Stable `core-utils` .
Fixed runtime crashes in outdated modules

### 1.2.1

Added `types` . NPM package now has full Typescript/IntelliSense support

### 1.5.3

Palette utilities stable.
Added the `earthtone` and `pairedScheme` utilities
All utilities guarded to convert all input to hex
Added better type definitions for richer IntelliSense in the editor
Changed docs to docsify

### 1.7.9 (unstable)

- Fully treeshakable
- Core-utils directory was split to submodules.
- Added the `load()` utility to create read-manipulate-output chain with all the utilities that take a collection of colos as first input. The chain is lazy.
- Added the Color class which is aliased as `color()` which has all the utilities that take a color as the first argument bound to its prototype as methods. Calling color() simply calls `new Color()` under the hood.
- Added the `toHex` utility which parses all known color tokens similar to chroma-js `chroma()` constructor.
- Eliminated dependancy on lodash.
- Used treeshaken Culori modules to reduce bundle size. Only 20KB when minified!
- Created the `fp` directory with helper functions used in the library grouped by input type.
- More modular codebase
- Simplified code to make it more readable and easier to understand for other developers who may want to contribute
Over 50 utilities in the API now!
- All palette functions (generators) have easing function support.
Updated the docs!
- All palette functions now take an optional overrides object to fine tune parameters like easing methods, fixups etc.
- Rewrote the README and CONTRIBUTING. Added missing licenses for borrowed code.

### 1.79.92

- Deprecated temperature based utilities due to inconsistent results.
- Rewrote the type declarations to make them simpler and more generic.
- Lightness and chroma channels are now normalized against passed in extremums in the filtering utilities.
- `toHex` now supports RGB channel in the [0,255] range and [0,1] as well. Values above 1 are normalized using a simple formula. `ch / 255`.
- Removed unnecessary submodules and joined them into grouped modules
- Added Typedoc as the documentation generator of choice.
- New simpler docs writen in GFM.
- Added `getNearestColor` which uses the differenceHyab metric to get the nearest color against a collection.
- Collection based utilities that took  arrays of colors are now generic! If an object is passed its keys are passsed as an index and the values are treated as valid color tokens. Objects can only have a depth of 1 ie nested properties are not supported (yet).
- Added color vision deficiency simulation support (stable)
- Added a ColorArray class that has all collection based methods on its prototype as methods. The chain is lazy and requires `output()` to be called to retun the final result. Its aliased as `load()` which simply wraps around the class and invoking a new instance under the hood.
-Added some notes to the docs explaining how some of the utilities work as well as other behaviours of the library.
- Slimmer bundle size.
- Fixed import errors. The library is now fully ESM with a UMD build for CDN and minified version for browser.
- Added support for more uniform colorspaces in hueShift. Jch is currently unsupported because of lightness mapping issues. Support is coming soon though.
- Removed cyclic dependencies that caused a stackoverflow error.

### 1.79.96

- filterBy and sortBy modules now support normalization of passed in ranges. This allows us to pass in the same value and still get the same relative percentage or fraction of the range of the factor being queried.
