import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // PocketBase migrations run in its JS VM and reference its generated types.
    files: ['pocketbase/pb_migrations/**/*.js'],
    rules: { '@typescript-eslint/triple-slash-reference': 'off' },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', '.pocketbase/**']),
])
