/** @type {import('next').NextConfig} */
const withFonts = require("next-fonts");

module.exports = withFonts({
  reactStrictMode: true,
  env: {
    ENV: process.env.ENV,
    CUSTOMENC: process.env.CUSTOMENC,
  },
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
