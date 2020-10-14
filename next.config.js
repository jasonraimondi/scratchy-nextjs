const withCSS = require("@zeit/next-css");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = withCSS({
  minify: false,
  distDir: "dist",
  publicRuntimeConfig: {
    API_URL: "http://localhost:3000",
  },
  webpack(config, options) {
    config.resolve.plugins = [...(config.resolve.plugins ? config.resolve.plugins : []), new TsconfigPathsPlugin()];
    return config;
  },
});
