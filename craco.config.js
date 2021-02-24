const tailwindcss = require("tailwindcss");
const CracoAlias = require("craco-alias");
module.exports = {
  style: {
    postcss: {
      plugins: [tailwindcss("./tailwind.config.js"), require("autoprefixer")],
    },
  },
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: "jsconfig",
      },
    },
  ],
};
