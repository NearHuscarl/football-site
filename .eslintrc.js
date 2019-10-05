// yarn add -D eslint babel-eslint prettier eslint-config-airbnb eslint-config-prettier eslint-plugin-import eslint-plugin-react eslint-plugin-jsx-a11y eslint-plugin-jest
// Use this file as a starting point for your project's .eslintrc.
// Copy this file, and add rule overrides as needed.
module.exports = {
    // fix Parsing error: Unexpected token =
    // https://github.com/babel/babel-eslint/issues/312#issuecomment-317688758
    'parser': 'babel-eslint',
    'extends': [
        'airbnb',
        'prettier',
        'prettier/react'
    ],
    'plugins': [
        'react',
        'jsx-a11y',
        'import'
    ],
    // make eslint knows about variables like 'document' or 'window'
    'env': {
        'browser': true,
        'node': true,
        "jest": true,
    },
    'rules': {
        'no-underscore-dangle': 0,
        'no-return-assign': ['error', 'except-parens'],
        // deprecated
        'jsx-a11y/label-has-for': 0,
        'jsx-a11y/label-has-associated-control': [2, {
            'assert': 'either', // 'htmlFor', 'nesting', 'both', 'either'
        }],
        // "linebreak-style": ["error", "unix"]
        'linebreak-style': ['error', 'windows'],
        'indent': [2, 'tab', { 'SwitchCase': 1 }],
        'prefer-template': 0,
        'react/destructuring-assignment': [0],
        'react/jsx-indent': [1, 'tab'],
        'react/jsx-one-expression-per-line': 'off',
        'no-tabs': 0, // disable error (airbnb will throw error when using tab)
        'allowIndentationTabs': true,
        'import/no-extraneous-dependencies': [2, {
            'devDependencies': ["./src/tests/**", "./webpack.config.js"],
            'optionalDependencies': false,
            'peerDependencies': false
        }],
    },
    'settings': {
        'import/resolver': {
            'node': {
                'extensions': ['.js', '.jsx']
            },
        },
    },
}

// vim: ft=javascript
