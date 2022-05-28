/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [process.env.IMG_HOST_DOMAIN]
  }
}

module.exports = nextConfig
