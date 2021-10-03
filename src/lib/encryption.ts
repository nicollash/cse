import CryptoJS from "crypto-js";
import { config } from "~/config";

export const encrypt = (data: any) => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    config.secretKey
  ).toString();
};

export const decrypt = (encryptedString: string) => {
  if (encryptedString) {
    return JSON.parse(
      CryptoJS.AES.decrypt(encryptedString, config.secretKey).toString(
        CryptoJS.enc.Utf8
      )
    );
  }
  return null;
};
