module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-strongly-recommended',
    'eslint:recommended',
    '@vue/typescript/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/ban-types': 'warn',
    'no-async-promise-executor': 'warn',
    '@typescript-eslint/no-var-requires': 'off',
    'vue/v-on-event-hyphenation': 'off',
    'vue/no-mutating-props': 'warn',
    'vue/no-unused-components': 'warn',
    'vue/no-setup-props-destructure': 'warn',
    '@typescript-eslint/no-empty-interface': 'warn',
  },
}
