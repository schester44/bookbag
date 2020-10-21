//postcss.config.js
const tailwindcss = require("tailwindcss");

const purgecss = require("@fullhuman/postcss-purgecss")({
  // Specify the paths to all of the template files in your project
  content: ["./src/**/*.js"],

  // Include any special characters you're using in this regular expression
  // Reference: https://tailwindcss.com/docs/controlling-file-size#writing-purgeable-html
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
});

const plugins = [tailwindcss("./tailwind.js"), require("postcss-preset-env")];

if (process.env.NODE_ENV === "production") {
  plugins.push(purgecss);
}

module.exports = {
  plugins
};
