import configCommon from "./config-common";

const csp = `
default-src 'self';
img-src 'self' https://*.jawg.io data:;
style-src 'self' 'unsafe-inline';
script-src 'self' 'unsafe-inline' 'unsafe-eval';
object-src data:;
`

const config = {
  ...configCommon,
  endpoints: {
    ...configCommon.endpoints,
    canonical: "http://localhost:3000",
  },
  csp
};

export default config;
