/** @type {import('next').NextConfig} */
const withFonts = require("next-fonts");

module.exports = withFonts({
  reactStrictMode: true,
  env: { ENV: process.env.ENV },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/quote",
        permanent: true,
      },
    ];
  },
});
