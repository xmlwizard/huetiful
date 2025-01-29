// import { token } from './lib/utils.ts'

import { diverging, sortBy, filterBy, stats, colors } from "./lib/index.ts";
import { achromatic, family, mc, token } from "./lib/utils.ts";

// console.log(stats(colors('all', '600'), {
//     factor: ['chroma', 'hue'], colorspace: 'lch'zzzzzzz
// }))


// console.info(filterBy(colors('all', '500'), {
//     factor: ['chroma', 'hue'], ranges: {
//         hue: ['<100'], chroma: [20]
//     }, colorspace: 'lch'
// }))


//console.info(sortBy(['purple', 'blue'], { relative: true, factor: ['chroma', 'hue'] }))
// * fix this
// ! fix this
// ? fix this
// todo

//console.log(mc('rgb.b')(['rgb', 0.4, 0.3, 0.1]))
// console.log(mc('lch.h')({ r: 0.2, g: 0.4, b: 0.5, mode: 'rgb' }))
// console.log(token({ r: 0.2, g: 0.4, b: 0.5, mode: 'rgb' }, { kind: 'obj', targetMode: 'lch' }))


console.log(family('#97dfd7ff'))