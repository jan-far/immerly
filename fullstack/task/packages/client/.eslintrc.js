module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    extends: ['@dishboard'],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
    },
    globals: {
        React: true,
        JSX: true,
        Gtag: true,
    },
    rules: {
        'react/prop-types': 'off',
        'import/no-extraneous-dependencies': [2, { devDependencies: true }],
        'import/no-absolute-path': 2,
        'react/react-in-jsx-scope': 'off',
        'react/require-default-props': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
        'react/function-component-definition': [
            2,
            {
                namedComponents: 'arrow-function',
                unnamedComponents: 'arrow-function',
            },
        ],
        '@typescript-eslint/unbound-method': 0,
        'react/no-unused-prop-types': 'off',
    },
    ignorePatterns: ['**/generated/graphql.tsx'],
    overrides: [
        {
            files: ['**/icons/*.tsx', '*.tsx'],
            rules: {
                'max-len': 'off',
            },
        },
    ],
};
