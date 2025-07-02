/* eslint-env node */
module.exports = {
    root: true,
    'extends': [
        'eslint:recommended',
    ],
    parserOptions: {
        ecmaVersion: 'latest'
    },
    rules: {
        'brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
        'comma-dangle': ['error', 'never'],
        'eol-last': ['error', 'always'],
        indent: [
            'error',
            4,
            {
                SwitchCase: 1,
                ignoredNodes: [
                    'FunctionExpression > .params[decorators.length > 0]',
                    'FunctionExpression > .params > :matches(Decorator, :not(:first-child))',
                    'ClassBody.body > PropertyDefinition[decorators.length > 0] > .key'
                ]
            }
        ],
        'keyword-spacing': ['error', { before: true, after: true }],
        'linebreak-style': ['error', 'unix'],
        'lines-between-class-members': [
            'error',
            'always',
            { exceptAfterSingleLine: true }
        ],
        'no-console': 'error',
        'no-case-declarations': 'off',
        'no-extra-semi': 'error',
        'no-multiple-empty-lines': ['error', { max: 1 }],
        'no-multi-spaces': ['error'],
        'object-curly-spacing': ['error', 'always'],
        'padded-blocks': ['error', 'never', { allowSingleLineBlocks: true }],
        quotes: ['error', 'single'],
        'rest-spread-spacing': ['error', 'never'],
        semi: ['error', 'always'],
        'space-before-blocks': 'error',
        'space-before-function-paren': ['error', 'always'],
        'space-infix-ops': 'error'
    }
}
