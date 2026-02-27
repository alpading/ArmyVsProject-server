const js = require('@eslint/js')
const prettierConfig = require('eslint-config-prettier')
const globals = require('globals')

module.exports = [
    {
        ignores: ['node_modules/**', 'src/client/**'],
    },

    js.configs.recommended,
    prettierConfig,

    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'script',
            globals: { ...globals.node },
        },
        rules: {
            'no-console': 'off',
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        },
    },
]
