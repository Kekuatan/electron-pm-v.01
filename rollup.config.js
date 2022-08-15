// import svelte from 'rollup-plugin-svelte';
// import commonjs from '@rollup/plugin-commonjs';
// import resolve from '@rollup/plugin-node-resolve';
// import livereload from 'rollup-plugin-livereload';
// import {terser} from 'rollup-plugin-terser';
// import css from 'rollup-plugin-css-only';
//  import  svelteNavigator  from "svelte-navigator";
// import { Router, Route, Link } from "svelte-navigator";
// import {config} from 'dotenv';
// import replace from '@rollup/plugin-replace';
// import typescript from "rollup-plugin-typescript2";
// config()
//
// const production = !process.env.ROLLUP_WATCH;
// console.log('is production :' + production);
// console.log('is token :' + process.env.ACCESS_TOKEN);
// console.log('is tokaen :' + config().parsed);
//
//
// function serve() {
//     let server;
//
//     function toExit() {
//         if (server) server.kill(0);
//     }
//
//     return {
//         writeBundle() {
//             if (server) return;
//             server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
//                 stdio: ['ignore', 'inherit', 'inherit'],
//                 shell: true
//             });
//
//             process.on('SIGTERM', toExit);
//             process.on('exit', toExit);
//         }
//     };
//
// }
//
// function envArray() {
//     let envArray = {
//         preventAssignment: true,
//         'process.env.NODE_ENV': JSON.stringify(process.env.ACCESS_TOKEN)
//     }
//     const env = config().parsed
//     Object.keys(env).forEach((d) => {
//         envArray['process.env.' + d] = JSON.stringify(env[d])
//     })
//     return envArray
// }
//
//
// export default {
//     input: 'src/main.js',
//     output: {
//         sourcemap: true,
//         format: 'iife',
//         name: 'app',
//         file: 'public/build/bundle.js',
//     },
//     plugins: [
//
//         replace(envArray()),
//         svelte({
//             include: 'src/**/*.svelte',
//             compilerOptions: {
//                 // enable run-time checks when not in production
//                 dev: !production,
//             },
//
//         }),
//         // we'll extract any component CSS out into
//         // a separate file - better for performance
//         css({output: 'bundle.css'}),
//
//         // If you have external dependencies installed from
//         // npm, you'll most likely need these plugins. In
//         // some cases you'll need additional configuration -
//         // consult the documentation for details:
//         // https://github.com/rollup/plugins/tree/master/packages/commonjs
//         resolve({
//             browser: true,
//             dedupe: ['svelte'],
//             extensions: ['.svelte', '.js']
//
//         }),
//         commonjs(),
//         // typescript({ module: "ESNext" }),
//         // In dev mode, call `npm run start` once
//         // the bundle has been generated
//         !production && serve(),
//
//         // Watch the `public` directory and refresh the
//         // browser on changes when not in production
//         !production && livereload('public'),
//
//         // If we're building for production (npm run build
//         // instead of npm run dev), minify
//         production && terser()
//     ],
//     watch: {
//         clearScreen: false
//     }
// };



import livereload from 'rollup-plugin-livereload';
import { Router, Route, Link } from "svelte-navigator";
import {config} from 'dotenv';
import replace from '@rollup/plugin-replace';
config()

const production = !process.env.ROLLUP_WATCH;
console.log('is production :' + production);
console.log('is token :' + process.env.ACCESS_TOKEN);
console.log('is tokaen :' + config().parsed);
import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import css from "rollup-plugin-css-only";
import { terser } from "rollup-plugin-terser";
import { optimizeImports } from "carbon-preprocess-svelte";


function envArray() {
    let envArray = {
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify(process.env.ACCESS_TOKEN)
    }
    const env = config().parsed
    Object.keys(env).forEach((d) => {
        envArray['process.env.' + d] = JSON.stringify(env[d])
    })
    return envArray
}
export default {
    input: "src/main.js",
    inlineDynamicImports: true,
    output: {
        sourcemap: !production,
        format: "iife",
        name: "app",
        file: 'public/build/bundle.js',
    },
    plugins: [
        svelte({
            preprocess: [optimizeImports()],
            compilerOptions: { dev: !production },
        }),
        replace(envArray()),
        resolve({ browser: true, dedupe: ["svelte"] }),
        commonjs(),
        css({ output: "bundle.css" }),
        production && terser(),
    ],
};
