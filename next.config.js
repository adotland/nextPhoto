const { withSentryConfig } = require('@sentry/nextjs');

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

const moduleExports = {
  ...nextConfig,
  headers,
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
