// @ts-check

import svelte from 'rollup-plugin-svelte';
// import commonjs from '@rollup/plugin-commonjs';
// import resolve from '@rollup/plugin-node-resolve';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
// import { less } from 'svelte-preprocess-less';
import sveltePreprocess from 'svelte-preprocess';
// import typescript from '@rollup/plugin-typescript';
// import typescript from "rollup-plugin-typescript2";
// import { svelteSVG } from "rollup-plugin-svelte-svg";
// import html from '@web/rollup-plugin-html';
// import html from 'rollup-plugin-template-html';

import { writeFileSync } from 'fs';

// import livereload from 'rollup-plugin-livereload';

let release = false;

// release = true;
// const production = !process.env.ROLLUP_WATCH;

module.exports = {
  input: './examples/app.js',
  output: {
    format: 'iife',
    name: 'app',
    file: './examples/build/app.js',
    // file: './scripts/dialogs_app.js',

    sourcemap: true
    // sourcemapPathTransform: mapfile => `maps/${mapfile}`
  },
  plugins: [
	// svelteSVG({
	// 	// optional SVGO options
	// 	// pass empty object to enable defaults
	// 	svgo: {}
	// }),
   //  typescript({
   //    // rootDir: './source',
   //    sourceMap: !release
   //    // typescript: require("typescript"),
   //    // verbosity: 3
   //  }),
    svelte({
      // preprocess: {
      // 	// style: less({}),
      // },
      preprocess: sveltePreprocess({
        sourceMap: !release
      //   defaults: {
      //     style: 'stylus'
      //   }
      }),
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !release
      }
		// extensions: ['.svelte', '.ts', '.js', '.svg']
		// extensions: ['.svelte', '.ts', '.svg']
		// extensions: ['.svelte', '.ts']
    }),

    // css
    css({
		/* eslint-disable-next-line */
      output: function (styles, styleNodes) {
			writeFileSync('examples/app.css', styles);
		}
      // output: 'styles/dialog_app.css'
    }),
    nodeResolve({
      browser: true,
      dedupe: ['svelte']
    }),
   //  commonjs(),

    release && terser()
  ],
  watch: {
    clearScreen: false
  }
};
