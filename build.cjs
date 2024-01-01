/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
// esbuild script
//@ts-nocheck

// eslint-disable-next-line no-undef
var { build } = require('esbuild');
var { dependencies } = require('./package.json');

const sharedConfig = {
  entryPoints: ['.//src/index.ts'],
  bundle: true,
  minify: false
};

// commonJS import
build({
  format: 'cjs',
  ...sharedConfig,
  outfile: './lib/huetiful.cjs',
  external: Object.keys(dependencies)
});

//Bundled ESM
build({
  ...sharedConfig,
  platform: 'neutral',
  format: 'esm',
  outfile: './lib/huetiful.esm.mjs'
});

//Bundled IIFE
build({
  ...sharedConfig,
  platform: 'browser',
  format: 'iife',
  outfile: './lib/huetiful.umd.js',
  globalName: 'huetiful',
  minifySyntax: true
});
