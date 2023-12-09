#!/usr/bin/env node

const path = require('node:path')

const packageJson = require.resolve('eslint-vanilla/package.json')
const eslintRoot = path.dirname(packageJson)

const bin = path.join(eslintRoot, 'bin', 'eslint.js')

require('../lib/register.js')

require(bin)
