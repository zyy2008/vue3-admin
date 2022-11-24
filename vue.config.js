const path = require("path");
const { defineConfig } = require("@vue/cli-service");
const { name } = require("./package");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  css: {
    loaderOptions: {
      less: {
        modifyVars: {},
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true,
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": resolve("src"),
        "@ajax": resolve("src/utils/ajax"),
      },
    },
    output: {
      // 把子应用打包成 umd 库格式
      library: `${name}-[name]`,
      libraryTarget: "umd",
      chunkLoadingGlobal: `webpackJsonp_${name}`,
    },
  },
});
