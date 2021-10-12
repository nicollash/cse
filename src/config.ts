import { config as devConfig } from "./config.dev";
import { config as prodConfig } from "./config.prod";
import CryptoJS from "crypto-js";

/* eslint-disable no-undef */
const env = process.env.ENV || "development";

let envConfig = null;

const decrypt = (encryptedString: string, secretKey = null) => {
  if (encryptedString) {
    return JSON.parse(
      CryptoJS.AES.decrypt(encryptedString, secretKey).toString(
        CryptoJS.enc.Utf8
      )
    );
  }
  return null;
};

switch (env) {
  case "development":
    console.log(env);
    envConfig = decrypt(devConfig, "CSE Insurance");
    break;
  case "production":
    envConfig = decrypt(prodConfig, "CSE Insurance");
    break;
  default:
    envConfig = decrypt(devConfig, "CSE Insurance");
    break;
}

export const config = envConfig;
