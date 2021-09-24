const path = require("path");
const fs = require("fs");

const rewireBabelLoader = require("react-app-rewire-babel-loader");
const {
  rewireWorkboxInject,
  defaultInjectConfig,
} = require("react-app-rewire-workbox");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

module.exports = function override(config, env) {
  const vectorIcons = resolveApp("node_modules/react-native-vector-icons");
  const elements = resolveApp("node_modules/react-native-elements");

  const workboxConfig = {
    ...defaultInjectConfig,
    swSrc: path.join(__dirname, "src", "workbox-strategy.js"),
    maximumFileSizeToCacheInBytes: 7 * 1024 * 1024,
  };

  config = rewireBabelLoader.include(config, elements, vectorIcons);
  config = rewireWorkboxInject(workboxConfig)(config, env);

  return config;
};
