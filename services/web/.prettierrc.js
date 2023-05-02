/** @type {import("prettier").Config} */
module.exports = {
  ...require("gts/.prettierrc.json"),
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  tabWidth: 2,
  semi: true,
};
