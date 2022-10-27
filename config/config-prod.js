import configCommon from "./config-common";

const csp = `
default-src 'self';
img-src 'self' https://theparkandthebike.s3.us-west-2.amazonaws.com https://*.jawg.io data:;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
script-src 'self' 'unsafe-inline';
connect-src 'self' https://vitals.vercel-insights.com https://umami-seven-weld.vercel.app https://o1339884.ingest.sentry.io;
font-src 'self' data: https://fonts.gstatic.com;
media-src https://theparkandthebike.s3.us-west-2.amazonaws.com;
`

const config = {
  ...configCommon,
  endpoints: {
    ...configCommon.endpoints,
    canonical: "https://www.theparkandthebike.com",
  },
  csp
};

export default config;
