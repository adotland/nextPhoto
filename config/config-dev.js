import configCommon from "./config-common";

const csp = `
default-src 'self' https://www.instagram.com;
img-src 'self' https://theparkandthebike.s3.us-west-2.amazonaws.com https://*.jawg.io data:;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.instagram.com;
object-src data:;
font-src 'self' data: https://fonts.gstatic.com;
media-src https://theparkandthebike.s3.us-west-2.amazonaws.com;
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
