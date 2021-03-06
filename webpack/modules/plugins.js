"use strict";

/**
 * Export
 */
module.exports = (env = {}, entries) => {
  const plugins = [
    vuePluginLoader(env, entries),
    suppressPlugin(env, entries),
    miniCssExtract(env, entries),
    manifest(env, entries),
  ];

  /* Copy files and directories */
  const copyFilesResult = copyFiles(env, entries);
  if (copyFilesResult) {
    plugins.push(copyFilesResult);
  }

  return plugins;
};

/**
 * copyFilePlugins
 */
function copyFiles(env, entries = {}) {
  const CopyPlugin = require("copy-webpack-plugin");
  let patterns = entries.copy || {};

  if (Object.values(patterns).length) {
    patterns = Object.keys(patterns).map((key) => ({
      from: key,
      to: patterns[key],
    }));

    const result = {
      patterns,
      options: {
        concurrency: 100,
      },
    };

    return new CopyPlugin(result);
  }

  return null;
}

/**
 * Vue plugin loader
 */
function vuePluginLoader(env, etnries) {
  const { VueLoaderPlugin } = require("vue-loader");

  return new VueLoaderPlugin();
}

/**
 * Suppress plugin
 */
function suppressPlugin(env, entries) {
  const SuppressChunksPlugin = require("suppress-chunks-webpack-plugin")
    .default;

  const styles = entries.styles || {};
  const options = Object.keys(styles).map(
    (key) => (
      {
        name: key,
        match: /\.js\.map$/,
      },
      {
        name: key,
        match: /\.js$/,
      }
    )
  );

  return new SuppressChunksPlugin(options);
}

/**
 * MiniCssExtract plugin
 */
function miniCssExtract(env, entries) {
  const MiniCssExtractPlugin = require("mini-css-extract-plugin");

  return new MiniCssExtractPlugin();
}

/**
 * WebpackManifest plugin
 */
function manifest(env, entries) {
  const AssetListWebpackPlugin = require("asset-list-webpack-plugin");

  return new AssetListWebpackPlugin({});
}
