import { FlatCompat } from '@eslint/eslintrc';
import nextPlugin from '@next/eslint-plugin-next';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const config = [
  { ignores: ['.next/**', 'coverage/**', 'node_modules/**', 'public/**', 'scripts/**', 'eslint.config.mjs'] },
  ...compat.extends('next', 'next/core-web-vitals'),
  {
    plugins: { '@next/next': nextPlugin },
    rules: {
      '@next/next/no-img-element': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
];

export default config;
