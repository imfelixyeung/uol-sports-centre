/** @type {import("prettier").Config} */
module.exports = {
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  useTabs: false,
  trailingComma: "es5",
};
