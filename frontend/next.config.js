/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["i.ibb.co"],
  },
  swcMinify: true,
};

module.exports = nextConfig;
