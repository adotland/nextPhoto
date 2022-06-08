import configCommon from "./config-common";

const csp = `
default-src 'self';
img-src 'self' https://*.jawg.io data:;
style-src 'self' 'unsafe-inline';
script-src 'self' 'unsafe-inline';
connect-src 'self' https://vitals.vercel-insights.com;
`

const config = {
  ...configCommon,
  endpoints: {
    ...configCommon.endpoints,
    canonical: "https://theparkandthebike.com",
  },
  csp
};

export default config;
