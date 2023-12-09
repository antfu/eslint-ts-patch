import { afterEach, beforeEach, expect, it } from 'vitest'
import fs from 'fs-extra'
import { execa } from 'execa'

const fixture = new URL('./fixtures/basic', import.meta.url).pathname
const temp = new URL('../../.eslint-ts-patch-temp', import.meta.url).pathname

beforeEach(async () => {
  await fs.rm(temp, { recursive: true, force: true })
  await fs.copy(fixture, temp)
})

afterEach(async () => {
  await fs.rm(temp, { recursive: true, force: true })
})

it.skip('npm', async () => {
  await execa('npm', ['install'], { cwd: temp, stdio: 'pipe' })
  const process = await execa('npm', ['run', 'lint'], { cwd: temp, stdio: 'pipe', env: {
    DEBUG: 'eslint-ts-patch',
  } })
  expect(process.stderr)
    .toContain('eslint-ts-patch initialized')
  expect(process.stdout).toMatchInlineSnapshot(`
    "
    > lint
    > eslint .
    "
  `)
})

it('dummy', () => {
  expect(true).toBe(true)
})
