/** @type {import('next').NextConfig} */
const withFonts = require("next-fonts");

module.exports = withFonts({
  reactStrictMode: true,
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
