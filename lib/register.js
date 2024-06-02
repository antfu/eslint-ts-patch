/**
 * This file add a Node CJS register hook to kinda hijack ESLint's internal module
 * to add `.mjs`, `.cjs`, `.ts`, `.cts`, and `.mts` support.
 *
 * @info Last tested on ESLint 8.57.0
 * @commit 1813aecc4660582b0678cf32ba466eb9674266c4 - 8.57.0
 * @commit 3a22236f8d10af8a5bcafe56092651d3d681c99d - 8.56.0
 *
 * @info Fix for 8.57.0 change of `FLAT_CONFIG_FILENAME` to `FLAT_CONFIG_FILENAMES[]`
 * @commit dca7d0f1c262bc72310147bcefe1d04ecf60acbc
 *         feat: Enable eslint.config.mjs and eslint.config.cjs (#18066)
 *
 * @info Seems like a solution will also go straight into ESLint soon:
 *       (2024-02-22) feat: Add support for TS config files #18134
 *       https://github.com/eslint/eslint/pull/18134
 *
 */
const Module = require('node:module')
const fs = require('node:fs')
const process = require('node:process')
const debug = require('debug')('eslint-ts-patch')

const js = String.raw

const supportedTsLoaders = ['auto', 'native', 'jiti', 'tsx', 'bundle-require']
const defaultLoader = process.env.ESLINT_TS_PATCH_LOADER || 'auto'

function snippets(defaultLoader) {
  return js`

/** --- patched by eslint-ts-patch --- */
let config;
if (/\.[cm]?ts$/.test(filePath)) {
  let supportedTsLoaders = ${JSON.stringify(supportedTsLoaders)};
  let loader = ${JSON.stringify(defaultLoader)};
  const fs = require('fs/promises');
  const content = await fs.readFile(fileURL, 'utf-8');
  const loaderMatch = content.match(/@eslint-ts-patch-loader ([\w-]+)/)
  if (loaderMatch?.[1] && loaderMatch[1] !== 'default') {
    loader = loaderMatch[1];
    console.log('[eslint-ts-patch] Using loader "' + loader + '" from comment')
  }
  if (!supportedTsLoaders.includes(loader))
    throw new Error('[eslint-ts-patch] Loader "' + loader + '" is not supported. Supported loaders are: ' + supportedTsLoaders.join(', '));
  config = await import('importx').then(x => x.import(fileURL, { loader, parentURL: __filename }));
} else {
  config = await import(fileURL);
}
if (config.default) config = await config.default;
/** --- patched by eslint-ts-patch --- */

`.trim()
}

const REPLACERS = [
  {
    paths: [
      // ESLint v9.2.0
      '/eslint/lib/eslint/eslint.js',
      // ESLint v8.56.0
      '/eslint/lib/eslint/flat-eslint.js',
    ],
    replace: content => content
      /**
       * This allows ESLint to scan for `.mjs`, `.cjs`, `.ts`, `.cts`, and `.mts` files as the trigger of Flat Config.
       *
       * Will match for <= v8.56.0
       * https://github.com/eslint/eslint/blob/3a22236f8d10af8a5bcafe56092651d3d681c99d/lib/eslint/flat-eslint.js#L94
       */
      .replace(
        'const FLAT_CONFIG_FILENAME = "eslint.config.js";',
        'const FLAT_CONFIG_FILENAME = ["eslint.config.js", "eslint.config.mjs", "eslint.config.cjs", "eslint.config.ts", "eslint.config.mts", "eslint.config.cts"];',
      )
      /**
       * Will match for >= v8.57
       * https://github.com/eslint/eslint/blob/1813aecc4660582b0678cf32ba466eb9674266c4/lib/eslint/flat-eslint.js#L94
       */
      .replace(
        /const FLAT_CONFIG_FILENAMES = \[\s*"eslint.config.js",\s*"eslint.config.mjs",\s*"eslint.config.cjs"\s*\];/,
        'const FLAT_CONFIG_FILENAMES = ["eslint.config.js", "eslint.config.mjs", "eslint.config.cjs", "eslint.config.ts", "eslint.config.mts", "eslint.config.cts"];',
      )
      /**
       * https://github.com/eslint/eslint/blob/3a22236f8d10af8a5bcafe56092651d3d681c99d/lib/eslint/flat-eslint.js#L299
       *
       * We use native `import` to load javascript files, and corresponding loaders for `.ts`.
       * An extra `.default` interop.
       */
      .replace(
        'const config = (await import(fileURL)).default;',
        snippets(defaultLoader),
      ),
  },
]

const extensions = Module._extensions
const originalRegister = extensions['.js']
extensions['.js'] = function (module, filename) {
  if (!/node_modules[\\/]eslint/.test(filename))
    return originalRegister(module, filename)
  const slashed = filename.replace(/\\/g, '/')
  const replacer = REPLACERS.find(replacer => replacer.paths.some(i => slashed.endsWith(i)))
  if (replacer) {
    const content = fs.readFileSync(filename, 'utf-8')
    const replaced = replacer.replace(content)
    if (replaced === content)
      throw new Error(`[eslint-ts-patch] ${slashed} is not patched! It might because ESLint changes the internal code structure. Please report this to https://github.com/antfu/eslint-ts-patch`)
    debug(`patched ${slashed} with default loader "${defaultLoader}"`)
    module._compile(replaced, filename)
    return
  }
  return originalRegister(module, filename)
}

if (debug.enabled)
  debug(`initialized v${require('../package.json').version}`)
