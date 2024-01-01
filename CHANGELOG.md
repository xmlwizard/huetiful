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

### 1.8.0 (stable)

- Fully treeshakable
- Core-utils directory was split to submodules.
- Added the `load()` utility to create read-manipulate-output chain with all the utilities that take a collection of colos as first input. The chain is lazy.
- Added the Color class which is aliased as `color()` which has all the utilities that take a color as the first argument bound to its prototype as methods. Calling color() simply calls `new IColor()` under the hood.
- Added the `toHex` utility which parses all known color tokens similar to chroma-js
- Eliminated dependancy on lodash.
- Used treeshaken Culori modules to reduce bundle size. Only 20KB when minified!
- Created the `fp` directory with helper functions used in the library grouped by input type.
- More modular codebase
- Simplified code to make it more readable and easier to understand for other developers who may want to contribute
Over 50 utilities in the API now!
- All palette functions have easings for internal computations
Updated the docs!
- Improved the accuracy of temperature based utilities.
- Rewrote the type declarations to make them simpler and more generic.
- All palette functions now take an optional overrides object to fine tune parameters like easing methods, fixups etc.
- Temperature utilities are marked as experiental until a more effecient way of predicting color temperature is discovered
- Rewrote the README and CONTRIBUTING. Added missing licenses for borrowed code.


