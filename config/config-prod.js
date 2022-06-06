import configCommon from "./config-common";
const config = {
  ...configCommon,
  endpoints: {
    ...configCommon.endpoints,
    canonical: "https://theparkandthebike.com",
  },
};

export default config;
