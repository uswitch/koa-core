import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import promisePlugin from 'eslint-plugin-promise';
import nPlugin from 'eslint-plugin-n';
import jestPlugin from 'eslint-plugin-jest';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.mjs'],
    plugins: {
      import: importPlugin,
      promise: promisePlugin,
      n: nPlugin,
      jest: jestPlugin,
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        // Node.js globals
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        // Browser globals (if needed)
        window: 'readonly',
        document: 'readonly',
        // Jest globals
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
        // Timer functions
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        setImmediate: 'readonly',
        clearImmediate: 'readonly',
      },
    },
    rules: {
      // ESLint recommended rules are already included via js.configs.recommended

      // Import plugin rules (standard-like)
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/namespace': 'error',
      'import/no-named-as-default': 'warn',
      'import/no-named-as-default-member': 'warn',
      'import/no-duplicates': 'error',

      // Promise plugin rules
      'promise/always-return': 'error',
      'promise/catch-or-return': 'error',
      'promise/param-names': 'error',
      'promise/no-return-wrap': 'error',

      // Node plugin rules (n)
      'n/no-deprecated-api': 'error',
      'n/process-exit-as-throw': 'error',

      // Jest plugin rules
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/valid-expect': 'error',
    },
  },
  {
    ignores: ['build/', 'node_modules/', 'dist/', '*.min.js'],
  },
];
