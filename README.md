# eslint-ts-patch

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

Support loading `eslint.config.mjs` and `eslint.config.ts` as flat config files for ESLint.

Configure files will be searched in the following order, the first one found will be used:

- `eslint.config.js`
- `eslint.config.cjs`
- `eslint.config.mjs`
- `eslint.config.ts`
- `eslint.config.cts`
- `eslint.config.mts`

For `.js`, `.cjs`, and `.mjs` files, they will be loaded by Node's native `import()`.
For `.ts`, `.cts`, and `.mts` files, they will be loaded using [`jiti`](https://github.com/unjs/jiti/).

## Install

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © 2023-PRESENT [Anthony Fu](https://github.com/antfu)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/eslint-ts-patch?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/eslint-ts-patch
[npm-downloads-src]: https://img.shields.io/npm/dm/eslint-ts-patch?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/eslint-ts-patch
[bundle-src]: https://img.shields.io/bundlephobia/minzip/eslint-ts-patch?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=eslint-ts-patch
[license-src]: https://img.shields.io/github/license/antfu/eslint-ts-patch.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/antfu/eslint-ts-patch/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/eslint-ts-patch
