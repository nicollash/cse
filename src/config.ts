import { config as devConfig } from "./config.dev";
import { config as prodConfig } from "./config.prod";

/* eslint-disable no-undef */
const env = process.env.NODE_ENV || "development";
let envConfig = null;
switch (env) {
  case "development":
    console.log(env);
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
