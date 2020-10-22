const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  distDir: "dist",
  poweredByHeader: false,
  reactStrictMode: true,
  generateBuildId: async () => {
    const revision = require("child_process")
      .execSync("git rev-parse HEAD")
      .toString().trim();
    return revision;
  },
  webpack(config, options) {
    config.resolve.plugins = [...(config.resolve.plugins ? config.resolve.plugins : []), new TsconfigPathsPlugin()];
    return config;
  },
};
