# eslint-ts-patch

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

Support loading `eslint.config.mjs` or `eslint.config.ts` as flat config file for ESLint.

Configure files will be searched in the following order, the first one found will be used:

- `eslint.config.js`
- `eslint.config.mjs`
- `eslint.config.cjs`
- `eslint.config.ts`
- `eslint.config.mts`
- `eslint.config.cts`

For `.js`, `.cjs`, and `.mjs` files, they will be loaded by Node's native `import()`.

For `.ts`, `.cts`, and `.mts` files, they will be loaded using [TypeScript loaders](#typescript-loaders).

Context:
- [~~Unfortunately ESLint team decided to not support the detection of `.cjs` and `.mjs` as flat config~~](https://github.com/eslint/eslint/issues/16580#issuecomment-1419027861).
- Update: [ESLint v8.57.0 added support for `eslint.config.mjs` and `eslint.config.cjs`](https://eslint.org/blog/2024/02/eslint-v8.57.0-released).
- Native TS support in ESLint is coming: [RFC](https://github.com/eslint/rfcs/pull/117#discussion_r1593410239)

## Install

```npm
npm i -D eslint-ts-patch eslint@npm:eslint-ts-patch
```

It should make your `eslint` CLI work for those config files automatically. If it's still not, you can try switching the CLI to `eslint-ts`.

## TypeScript Loaders

There are multiple solutions to load TypeScript files in Node.js at runtime, and each of them consists of different trade-offs. This patch supports the following loaders:

- [`jiti`](https://github.com/unjs/jiti) (default) - Transpile TypeScript files and ESM to CJS and execute them at runtime.
  - **Pros**: Easy to use. No need to install additional dependencies.
  - **Cons**: Everything is in CJS mode. It does not support top-level-await. It May have inconsistent behavior during ESM/CJS interop.
- [`bundle-require`](https://github.com/egoist/bundle-require) - Use `esbuild` to bundle the `eslint.config.ts` file, and import the temporary bundle.
  - **Pros**: Not hacking into Node's internals. ESM and top-level-await are supported.
  - **Cons**: It writes a temporary file to disk.
- [`tsx`](https://github.com/privatenumber/tsx) - Use Node's native ESM loader to load TypeScript files.
  - **Pros**: Use Node's native ESM loader, running in ESM. Should have the most correct behavior.
  - **Cons**: Still experimental. Not yet working well in VS Code extension, etc.

To try out different loaders, you can set the `ESLINT_TS_PATCH_LOADER` environment variable to one of the following values:

```sh
ESLINT_TS_PATCH_LOADER=tsx npx eslint
ESLINT_TS_PATCH_LOADER=bundle-require npx eslint
```

`tsx` and `bundle-require` are not included in the dependencies of this package, you need to install them yourself.

```sh
npm i -D eslint-ts-patch tsx
npm i -D eslint-ts-patch bundle-require
```

## Compatibility

Tested with the following tools:

### Package Managers

- `npm` ✅
- `pnpm` ✅
- `yarn` ✅

### Integrations

- `eslint` CLI ✅
- VSCode ESLint extension ✅ (as it's executing your local `node_modules/.bin/eslint`)

Haven't gotten chance to test with other integrations, contributions are welcome.

## Versioning

This package proxies all ESLint exports, it should be compatible by aliasing the `eslint` package. The version of this package is the same as the latest supported ESLint version in addition to a patch number suffix indicating the patches of this package (e.g. `8.55.0-1`). It's using `^` relaxed dependency of `eslint`, so it should work with any newer versions of ESLint.

## How it works

As the support of `eslint.config.js` seems to be quite hard-coded in ESLint, this package proxies all exports of ESLint and installs [this register](./lib/register.js) beforehand. The register will swap some internal code of ESLint at runtime to make it work.

## Disclaimer

It's only recommended to install this as top-level development dependency (user-aware). For plugin and library authors, it's ok to document the usage of this package for better DX. But we suggest avoiding having this as the dependency of your library or plugin, otherwise, take your own risk.

## Troubleshooting

### Is the Patch Working

This patch is designed to be as transparent as possible. If you want to verify if it's working, you can add `DEBUG="eslint-ts-patch"` environment variable to your command to see the debug logs.

```
➜ DEBUG="eslint-ts-patch" npx eslint -v

  eslint-ts-patch initialized +0ms
  eslint-ts-patch patched lib/eslint/flat-eslint.js +59ms

v8.55.0
```

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
