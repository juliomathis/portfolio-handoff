module.exports = {
  plugins: {
    '@csstools/postcss-global-data': {
      files: ['./src/styles/breakpoints.css'],
    },
    "postcss-nesting": {},
    "postcss-custom-media": {},
    autoprefixer: {},
  },
};
