module.exports = {
  root: true,
  env: {
    es6: true,
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [''],
  extends: [
    'plugin:markdown/recommended',
    'plugin:jsonc/recommended-with-jsonc',
    'plugin:@typescript-eslint/recommended'
  ],
  overrides: [
    {
      files: ['*.json', '*.json5', '*.jsonc'],
      parser: 'jsonc-eslint-parser',
    },
    {
      files: ['*.d.ts'],
      rules: {
        'import/no-duplicates': 'off',
      },
    }
  ],
  rules: {
    // ts
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],
    // other
    'space-before-function-paren': 'off',
    'no-console': 'off',
    'no-debugger': 'warn',
    'no-use-before-define': 'off',
    'quotes': ['warn', 'single'],
    'comma-dangle': ['warn', 'never'],
    'semi': ['warn', 'never'],
    'max-len': ['off', 120],
    'indent': ['warn', 2],
    'eqeqeq': ['warn', 'always']
  }
}