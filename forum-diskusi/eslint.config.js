import dicodingacademy from 'eslint-config-dicodingacademy';
import globals from 'globals';

export default [
  {
    ignores: ['dist/', 'node_modules/'],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...dicodingacademy.rules,
      'no-unused-vars': 'warn',
      'no-undef': 'error',
    },
  },
];
