import configCommon from "./config-common";

const csp = `
default-src 'self';
img-src 'self' https://*.jawg.io data:;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
script-src 'self' 'unsafe-inline';
connect-src 'self' https://vitals.vercel-insights.com https://umami-seven-weld.vercel.app;
font-src 'self' data: https://fonts.gstatic.com;
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
