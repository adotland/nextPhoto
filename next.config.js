/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [process.env.IMG_HOST_DOMAIN]
  }
}

const csp = `frame-ancestors 'none';` // cannot be in meta tag

const securityHeaders = [{
  key: 'Content-Security-Policy',
  value: csp.replace(/\s{2,}/g, ' ').trim()
}]

async function headers() {
  return [
    {
      // Apply these headers to all routes in your application.
      source: '/:path*',
      headers: securityHeaders,
    },
  ]
}

module.exports = {...nextConfig, headers}
