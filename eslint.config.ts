import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import-x';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  globalIgnores([
    '.gadget',
    '.react-router',
    '.lintstagedrc.cjs',
    'node_modules',
    'build',
    'public',
    '*.yml',
    '.shopify',
    '.husky',
    './shared/_generated/*.ts',
    'extensions/theme-extension/assets/*',
    'extensions/**/dist/**/*',
    'extensions/**/shopify.d.ts',
  ]),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.strict,
  {
    files: ['{web,shared,extensions}/**/*.{ts,tsx}'],
    plugins: {
      'react': reactPlugin,
      'react-hooks': reactHooks,
      'import': importPlugin,
    },
    rules: {
      'no-unused-vars': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/array-type': [
        'off',
        {
          default: 'generic',
          readonly: 'generic',
        },
      ],
      '@typescript-eslint/consistent-type-definitions': ['off'],
      '@typescript-eslint/no-empty-object-type': ['warn'],
      '@typescript-eslint/only-throw-error': ['off'],
      '@typescript-eslint/no-duplicate-type-constituents': ['off'],
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-unnecessary-condition': [
        'error',
        {
          allowConstantLoopConditions: true,
        },
      ],
      'import/consistent-type-specifier-style': ['warn', 'prefer-inline'],
      'no-console': 'error',
    },
    extends: [reactPlugin.configs.flat.recommended, reactPlugin.configs.flat['jsx-runtime']],
    languageOptions: {
      ecmaVersion: 'latest',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: { ...globals.browser, ...globals.node },
    },
    settings: {
      'react': {
        version: 'detect',
      },
      'formComponents': ['Form'],
      'linkComponents': [
        { name: 'Link', linkAttribute: 'to' },
        { name: 'NavLink', linkAttribute: 'to' },
      ],
      'import/resolver': {
        node: {
          extensions: ['.ts', '.tsx'],
        },
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },
  {
    files: ['api/**/*.{ts,tsx}'],
    plugins: {
      import: importPlugin,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/array-type': [
        'off',
        {
          default: 'generic',
          readonly: 'generic',
        },
      ],
      '@typescript-eslint/consistent-type-definitions': ['off'],
      '@typescript-eslint/no-empty-object-type': ['warn'],
      '@typescript-eslint/only-throw-error': ['off'],
      '@typescript-eslint/no-duplicate-type-constituents': ['off'],
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-unnecessary-condition': [
        'error',
        {
          allowConstantLoopConditions: true,
        },
      ],
      'import/consistent-type-specifier-style': ['warn', 'prefer-inline'],
      'no-console': 'error',
    },
    languageOptions: {
      ecmaVersion: 'latest',
      parserOptions: {},
      globals: { ...globals.node },
    },
  },
  {
    linterOptions: { reportUnusedDisableDirectives: true },
    languageOptions: { parserOptions: { projectService: true } },
  },
);
