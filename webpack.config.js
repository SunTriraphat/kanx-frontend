module.exports = {
  // Other Webpack configurations...
  module: {
    rules: [
      // No need to add json-loader for Webpack 5, it supports JSON natively.
      // Add other loaders as needed...
    ],
  },
  resolve: {
    alias: {
      'openid-client': false, // Ignore openid-client
    },
  },
};
