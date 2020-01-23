module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:prettier/recommended',
        'plugin:react/recommended'
    ],
    plugins: ['prettier', 'react', 'react-hooks'],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
            modules: true
        }
    },
    parser: 'babel-eslint',
    rules: {
        'no-undef': 'off'
    }
};
