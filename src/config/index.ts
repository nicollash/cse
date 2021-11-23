import { config as devConfig } from "./config.dev";
import { config as prodConfig } from "./config.prod";
import { config as trainingConfig } from "./config.training";

/* eslint-disable no-undef */
const env = process.env.ENV || "development";
let envConfig = null;

switch (env) {
  case "training":
    envConfig = trainingConfig
    break;
  case "production":
    envConfig = prodConfig
    break;
  default: //development
    envConfig = devConfig
    break;
}

export const config = envConfig;
