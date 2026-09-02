const globals = require("globals");
const js = require("@eslint/js");

module.exports = [
  {
    files: ["**/*.js"],
    ignores: [
      "node_modules/**",
      "uploads/**",
      "logs/**",
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,

      // Production-friendly rules
      "no-console": "off",
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
];