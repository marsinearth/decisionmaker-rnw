const path = require("path");
const fs = require("fs");

const rewireBabelLoader = require("react-app-rewire-babel-loader");
const {
  rewireWorkboxInject,
  defaultInjectConfig,
} = require("react-app-rewire-workbox");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

function initializeWorkboxSourceMap() {
  if (typeof fetch !== "function") {
    return;
  }

  try {
    const { SourceMapConsumer } = require("workbox-build/node_modules/source-map");
    const wasmPath = require.resolve(
      "workbox-build/node_modules/source-map/lib/mappings.wasm"
    );
    const wasmDataUrl = `data:application/wasm;base64,${fs
      .readFileSync(wasmPath)
      .toString("base64")}`;

    SourceMapConsumer.initialize({
      "lib/mappings.wasm": wasmDataUrl,
    });
  } catch (error) {
    // Older dependency trees can differ; skip the shim if this path is absent.
  }
}

initializeWorkboxSourceMap();

module.exports = function override(config, env) {
  const vectorIcons = resolveApp("node_modules/react-native-vector-icons");
  const elements = resolveApp("node_modules/react-native-elements");

  const workboxConfig = {
    ...defaultInjectConfig,
    swSrc: path.join(__dirname, "src", "workbox-strategy.js"),
    maximumFileSizeToCacheInBytes: 7 * 1024 * 1024,
  };

  config = rewireBabelLoader.include(config, elements, vectorIcons);

  if (env === "production") {
    config = rewireWorkboxInject(workboxConfig)(config, env);
  }

  return config;
};
