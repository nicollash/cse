import { config as devConfig } from "./config.dev";
import { config as prodConfig } from "./config.prod";

/* eslint-disable no-undef */
const env = process.env.ENV || "development";
console.log(env)
let envConfig = null;
switch (env) {
  case "development":
    envConfig = devConfig;
    console.log("dev")
	break;
  case "production":
    envConfig = prodConfig;
    console.log("prod")
	break;
  default:
    envConfig = devConfig;
    console.log("default")
	break;
}

export const config = envConfig;
