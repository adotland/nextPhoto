import development from "./config-dev";
import production from "./config-prod";

const config = {
  development,
  production,
}[process.env.NODE_ENV];

export default config;
