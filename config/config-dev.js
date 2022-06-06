import configCommon from "./config-common";
const config = {
  ...configCommon,
  endpoints: {
    ...configCommon.endpoints,
    canonical: "http://localhost:3000",
  },
};

export default config;
