module.exports = {
  settings: {
    'import/extensions': [
      '.ts',
      '.tsx',
      '.js',
      '.jsx',
    ],
    'import/resolver': {
      node: {
        extensions: [
          '.ts',
          '.tsx',
          '.js',
          '.jsx',
          '.json',
        ],
      },
    },
  },
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'react-native',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'jest',
  ],
  rules: {
    'operator-linebreak': 0,
    'consistent-return': ['error', { treatUndefinedAsUnspecified: true }],
    'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': 'error',
    'react-native/no-inline-styles': 0,
    'react/jsx-props-no-spreading': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.ts', '.tsx'] }],
    'lines-between-class-members': 0,
    'no-useless-constructor': 0,
    'no-empty-function': 0,
    'no-throw-literal': 0,
    'function-paren-newline': 0,
    'class-methods-use-this': 0,
    'implicit-arrow-linebreak': 0,
    'import/no-namespace': 0,
    'import/no-unresolved': [2, { ignore: ['detox'] }],
    'import/prefer-default-export': 0,
    'import/no-cycle': 0,
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    semi: 'off',
    '@typescript-eslint/semi': ['error'],
    'no-use-before-define': 0,
    '@typescript-eslint/no-use-before-define': ['error'],
  },
};
