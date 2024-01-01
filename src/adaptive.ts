/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import type { Color, AdaptivePaletteOptions } from '../types';
// This module will make use of contrast ratio to create adaptive palettes

// Things I need to understand first:
// 1. What is adaptive color exactly
// -> Adaptive color is meant to adjust to luminance changes in the surrounding colors (or simply background)

// 2. What makes color adaptive
// -> Being able to look perceptually similar between different themes or backgrounds. For example a certain color looks over saturated in a dark theme. We can change the color's luminance to compensate for this shortfall whilt maintaining the hue and saturation constraints in our design system.

// 3. What is contrast and how does it affect adaptive color
// -> Contrast is the perceived difference in color i.e the ability of one color to stand out from another. This allows colors to be readible on different backgrounds.

// 4. What are the specifics of contrast ratio in relation to design elements
// -> Contrast ratios allow us to define the contrast relationship between the colors we're working with. For example certain text must meet a minimum contrast ratio in order for it to be easily viewable to a wider userbase.

// 5. What are the nuances of dark/light mode. How is the color corrected when we switch themes
// -> Certain colors will diverge from our color system if we tune them up. For example yellow will turn dark yellow if we adjust it to meet WCAG requirements in light mode. Therefore such colors cannot be used for text.

// 6. How can this be implemented in code

// Providing a min luminance contrast ratio between text and background.
//

// adaptive returns an object of the adjusted colors
// {lightMode/darkMode:Color[]}

// Possible params
// 1. backgroundColor -> The backgroundColor to compare against
// 2. colors -> The colors to tune
// 3. viewingConditions

// First I need to declare some constants to serve as starting points
////// Approach was adapted from Adobe's Leonardo tool

/////// Rough concept of adaptive color

// Dark theme factors to consider
// 1. if color is darker than background. It means that color is not legible and will be tuned up
// 2. if color is lighter than background. it means its legible

// Light theme factors to consider
// 1. if a color is lighter than background. This means color is not compliant and will be fixed up.
// 2. if a color is darker than background. It means its legible

// Constants
// - baseluminance
// - colorluminance

// Find contrast colors
// find contrast color pairs that are harmonius

// The relative luminance returned should be compliant to the defined ratio

// The correlates are channels in short  "QJMCshH"

// First convert cam to xyz then rgb

const adaptivePalette = (colors: Color[], options?: AdaptivePaletteOptions) => {
  // return customMystery;
};

//   let { light, dark } = undefined || {};
// let  = options
//   light = checkArg(light, tailwindColors('gray')('100'));

//   // First get the contrast between the passed in color and the backgrounds
//   dark = checkArg(dark, tailwindColors('stone')('800'));
//   const lightContrast = getContrast(colors, light);
//   const darkContrast = getContrast(colors, dark);
//   const colorLuminance = getLuminance(color);
//   const lightLuminance = getLuminance(light);
//   const darkLuminance = getLuminance(dark);
//   colors = colors.map((color) => toJch(color));
