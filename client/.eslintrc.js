module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  plugins: ['class-property'],
  rules: {
    'object-curly-newline': 0,
    'comma-dangle': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/no-noninteractive-tabindex': 0,
    'arrow-parens': 0,
    'function-paren-newline': 0,
    'import/no-named-as-default': 0,
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }]
  }
};
