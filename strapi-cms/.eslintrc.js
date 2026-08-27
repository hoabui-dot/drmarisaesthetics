'use strict';

module.exports = {
  extends: ['@strapi/eslint-config/server'],
  rules: {
    'no-unused-vars': 'warn',
    'no-undef': 'error',
  },
};
