import { defineConfig } from 'bumpp'
import { dependencies } from './package.json'

export default defineConfig({
  customVersion: (version) => {
    const eslintVersion = dependencies.eslint.replace('^', '')
    let [mainVersion, subVersion] = version.split('-')
    if (!subVersion)
      subVersion = '0'

    if (mainVersion !== eslintVersion) {
      mainVersion = eslintVersion
      subVersion = '0'
    }
    else {
      subVersion = String(Number(subVersion) + 1)
    }

    return `${mainVersion}-${subVersion}`
  },
})
