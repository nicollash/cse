import { config as devConfig } from "./config.dev";
import { config as prodConfig } from "./config.prod";

/* eslint-disable no-undef */
const env = process.env.ENV || "development";

let envConfig = null;
switch (env) {
  case "development":
    envConfig = devConfig;
    console.log(env)
    break;
  case "production":
    envConfig = prodConfig;
    break;
  default:
    envConfig = devConfig;
    console.log(env)
    break;
}

export const config = envConfig;
