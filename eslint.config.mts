import antfu from '@antfu/eslint-config'

// Change the following line to dynamically change the loader
// @eslint-ts-patch-loader jiti

const a: string = 'Hello'

// eslint-disable-next-line no-console
console.log(`${a} from TS!`)

export default antfu(
  {
    ignores: [
      // eslint ignore globs here
    ],
  },
  {
    rules: {
      // overrides
    },
  },
)
