/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [process.env.IMG_HOST_DOMAIN],
    minimumCacheTTL: 2630000 // 1mo
  },
};

const csp = `frame-ancestors 'none';`; // cannot be in meta tag

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: csp.replace(/\s{2,}/g, " ").trim(),
  },
];

async function headers() {
  return [
    {
      // Apply these headers to all routes in your application.
      source: "/:path*",
      headers: securityHeaders,
    },
  ];
}

// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: process.env.ANALYZE === "true",
// });

// module.exports = withBundleAnalyzer({ ...nextConfig, headers });

// const withVideos = require("next-videos");

// module.exports = withVideos({
//   ...nextConfig,
//   headers,
// assetPrefix: `https://${process.env.IMG_HOST_DOMAIN}`,

// webpack(config, options) {
//   return config;
// },
// });

module.exports = {
  ...nextConfig,
  headers,
};
