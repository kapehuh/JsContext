// eslint.config.js
const globals = require("globals");
const js = require("@eslint/js");

module.exports = [
  {
    ignores: ["coverage/**"],
  },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.jest,
        ...globals.browser,
      },
    },
    rules: {
      // "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-unused-vars": ["error", { args: "none" }],
    },
  },
];
