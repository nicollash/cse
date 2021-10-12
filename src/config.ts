import { config as devConfig } from "./config.dev";
import { config as prodConfig } from "./config.prod";

/* eslint-disable no-undef */
const env = process.env.ENV || "development";
let envConfig = null;
console.log(env)
switch (env) {
  case "development":
    envConfig = devConfig;
    break;
  case "production":
    envConfig = prodConfig;
    break;
  default:
    envConfig = devConfig;
    break;
}

export const config = envConfig;
