import dicodingacademy from 'eslint-config-dicodingacademy';
import globals from 'globals';

export default [
  {
    ignores: ['dist/', 'node_modules/', 'storybook-static/', 'cypress/screenshots/', 'cypress/videos/'],
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
  {
    files: ['**/*.test.{js,jsx}', '**/*.stories.{js,jsx}', 'cypress/**/*.js', '.storybook/**/*.js', 'cypress.config.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        vi: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        cy: 'readonly',
        Cypress: 'readonly',
      },
    },
    rules: {
      ...dicodingacademy.rules,
      'no-unused-vars': 'warn',
      'no-undef': 'off',
    },
  },
];
