module.exports = {
  env: {
    node: true,
    browser: true,
    es2020: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  settings: {
    react: {
      version: 'detect', // React version. "detect" automatically picks the version you have installed.
    },
  },
  plugins: ['react'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  rules: {
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-unused-vars': ['error', { ignoreRestSiblings: true }],
    'no-warning-comments': [
      'off',
      { terms: ['todo', 'fixme'], location: 'anywhere', decoration: ['/', '*'] },
    ],
    'react/no-unescaped-entities': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
  },
};
