import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/service/src/index.ts'],
  outDir: 'build/service',
  target: 'es2020',
  format: ['cjs'],
  splitting: false,
  sourcemap: true,
  minify: false,
  shims: true,
  dts: false,
})
