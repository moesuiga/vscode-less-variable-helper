module.exports = {
  parser: '@typescript-eslint/parser',
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      alias: {
        map: [],
        extensions: ['.ts', '.js', '.jsx', '.json']
      },
      typescript: {
        alwaysTryTypes: true // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
      }
    }
  },
  overrides: [
    {
      files: ['src/**/*.js'],
      parser: 'babel-eslint'
    }
  ],
  env: {
    node: true,
    commonjs: true,
    es6: true
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'babel',
    'prettier',
    'import'
  ],

  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/babel'
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
    legacyDecorators: true
  },

  rules: {
    'import/no-cycle': 0,
    'import/no-unresolved': 'error',
    'sort-imports': 0,
    'import/prefer-default-export': 0,
    'no-bitwise': 0,
    indent: [
      'error',
      2,
      {
        SwitchCase: 1
      }
    ],
    'import/no-extraneous-dependencies': 0,
    'import/extensions': 0,
    semi: 0,
    'spaced-comment': 0,
    'no-global-assign': 0,
    'comma-dangle': 0,
    'no-underscore-dangle': 0,
    'no-empty': [
      0,
      {
        allowEmptyCatch: true
      }
    ],
    'guard-for-in': 0,
    'func-names': 0,
    'max-len': [
      'error',
      {
        ignoreComments: true,
        code: 180,
        tabWidth: 2
      }
    ],
    'no-param-reassign': 0,
    'no-plusplus': [
      'warn',
      {
        allowForLoopAfterthoughts: true
      }
    ],
    'no-unused-vars': [
      'warn',
      {
        vars: 'local'
      }
    ],
    'no-shadow': 'warn',
    'no-restricted-syntax': 'warn',
    'consistent-return': 0,
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true
      }
    ],
    'no-mixed-operators': [
      'error',
      {
        allowSamePrecedence: true
      }
    ],
    'no-return-assign': ['warn'],
    'no-use-before-define': [
      'error',
      {
        functions: false,
        classes: false
      }
    ],
    'import/no-unresolved': [0, { commonjs: false, caseSensitive: false }], // 2
    'no-prototype-builtins': 'warn',
    'no-debugger': 'warn',
    'no-console': 0,
    'no-new': 'warn',
    'no-void': 0,
    'class-methods-use-this': 0,
    'no-multi-assign': 'warn',
    'array-callback-return': 'warn',
    'prefer-destructuring': 1,
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'no-mixed-operators': 0,
    'no-use-before-define': 1,
    '@typescript-eslint/no-this-alias': 0,
    '@typescript-eslint/no-var-requires': 1,
    '@typescript-eslint/ban-ts-ignore': 0,
    'no-use-before-define': 1, // 2
    // '@typescript-eslint/class-name-casing': 1, // 2
    '@typescript-eslint/consistent-type-assertions': 1,
    '@typescript-eslint/no-empty-interface': 1,
    'no-unused-expressions': 1,
    'no-var': 2,
    'prefer-const': 1,
    '@typescript-eslint/explicit-function-return-type': 0,
    'no-continue': 0,
    'max-classes-per-file': 0,
    'import/prefer-default-export': 0
  }
};
