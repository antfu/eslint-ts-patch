/**
 * This file add a Node CJS register hook to kinda hijack ESLint's internal module
 * to add `.mjs`, `.cjs`, `.ts`, `.cts`, and `.mts` support.
 */
const Module = require('node:module')
const fs = require('node:fs')
const path = require('node:path')

const eslintRoot = path.dirname(require.resolve('eslint-vanilla/package.json'))
const extensions = Module._extensions
const defaultLoader = extensions['.js']

const replacers = {
  'lib/eslint/flat-eslint.js': content => content
  /**
   * https://github.com/eslint/eslint/blob/3a22236f8d10af8a5bcafe56092651d3d681c99d/lib/eslint/flat-eslint.js#L94
   *
   * This allows ESLint to scan for `.mjs`, `.cjs`, `.ts`, `.cts`, and `.mts` files as the trigger of Flat Config.
   */
    .replace(
      'const FLAT_CONFIG_FILENAME = "eslint.config.js";',
      'const FLAT_CONFIG_FILENAME = ["eslint.config.js", "eslint.config.cjs", "eslint.config.mjs", "eslint.config.ts", "eslint.config.cts", "eslint.config.mts"];',
    )
  /**
   * https://github.com/eslint/eslint/blob/3a22236f8d10af8a5bcafe56092651d3d681c99d/lib/eslint/flat-eslint.js#L299
   *
   * We use `jiti` to load typescript files, and use native `import` to load javascript files.
   * An extra `.default` interop.
   */
    .replace(
      'const config = (await import(fileURL)).default;',
      [
        'let config',
        'if (/\\.[cm]?ts$/.test(fileURL.pathname)) {',
        '  const JITI = require("jiti")(null, { esmResolve: true, interopDefault: true });',
        '  config = await JITI(fileURL.pathname);',
        '} else {',
        '  config = await import(fileURL);',
        '}',
        'if (config.default) config = await config.default;',
      ].join('\n'),
    ),
}

extensions['.js'] = function (module, filename) {
  if (filename.startsWith(eslintRoot)) {
    const pathname = path.relative(eslintRoot, filename)
    const replacer = replacers[pathname]
    if (replacer) {
      const content = fs.readFileSync(filename, 'utf-8')
      const replaced = replacer(content)
      if (replaced === content)
        throw new Error(`[eslint-ts] ${pathname} is not patched! It might because ESLint changes the internal code structure. Please report this to https://github.com/antfu/eslint-ts`)

      module._compile(replaced, filename)
      return
    }
  }
  return defaultLoader(module, filename)
}
