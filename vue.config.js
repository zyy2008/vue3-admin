const { defineConfig } = require("@vue/cli-service");
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
});
