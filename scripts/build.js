// esbuild script
//@ts-nocheck


const { build } = require('esbuild')
const { dependencies, peerDependencies } = require('../package.json')
const { Generator } = require('npm-dts')

new Generator({
    entry: '/src/index.mts',
    output: './build/index.d.ts'
}).generate()




const sharedConfig = {
    entryPoints: ['.//src/core-utils/purify.mts'],
    bundle: true,
    minify: false,
    //  external: Object.keys(dependencies).concat(Object.keys(peerDependencies))
}

build({ ...sharedConfig, platform: 'node', outfile: './/dist/huetiful.cjs' })
build({ ...sharedConfig, platform: 'neutral', format: 'esm', outfile: './/dist/huetiful.esm.js' })