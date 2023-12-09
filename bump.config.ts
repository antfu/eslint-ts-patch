import { defineConfig } from 'bumpp'
import { dependencies } from './package.json'

export default defineConfig({
  customVersion: (version) => {
    const eslintVersion = dependencies.eslint.replace('^', '')
    let [mainVersion, subVersion] = version.split('-')
    if (!subVersion)
      subVersion = '0'

    if (Number.isNaN(Number(subVersion)))
      return

    if (mainVersion !== eslintVersion) {
      mainVersion = eslintVersion
      subVersion = '0'
    }
    else {
      subVersion = String(Number(subVersion) + 1)
    }
    if (subVersion === '0')
      return mainVersion
    else
      return `${mainVersion}-${subVersion}`
  },
})
