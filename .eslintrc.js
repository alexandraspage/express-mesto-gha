module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-underscore-dangle':
    ['error', { allow: ['_id', '_message'] }],
    'max-classes-per-file': ['error', { ignoreExpressions: false, max: 10 }],
  },
};
