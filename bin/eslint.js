#!/usr/bin/env node

require('../lib/register.js')

const path = require('node:path')

const packageJson = require.resolve('eslint/package.json')
const eslintRoot = path.dirname(packageJson)

const bin = path.join(eslintRoot, 'bin', 'eslint.js')

require(bin)
