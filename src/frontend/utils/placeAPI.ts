import { explodeAddress, logger } from "~/frontend/utils";
import { config } from "~/config";
import { httpClient } from "./httpClient";
import { EAddressObjectStatus } from "~/types";

const searchPlaces = (input: string): Promise<string[]> =>
  fetch(
    `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=(regions)&key=${config.googleAPIKey}`
  )
    .then((res) => res.json())
    .then((json) =>
      json.predictions.map((prediction: any) => prediction.description)
    );

const checkAddress = (address: string, unitNumber: string) =>
  new Promise((resolve, reject) => {
    if (!address) {
      reject(EAddressObjectStatus.addressRequired);
      return;
    }

    try {
      explodeAddress(address, (err, addressObj) => {
        logger("parsed Address", addressObj);

        httpClient(`${config.apiBaseURL}/ValidateAddressRq/json`, "POST", {
          Address1: addressObj.street_address1,
          Address2: unitNumber,
          City: addressObj.city,
          State: addressObj.state,
          PostalCode: addressObj.postal_code,
        })
          .then((res: any) => {
            const addressResult = res.JsonValidatedAddress[0].Address;
            switch (addressResult.DPV) {
              case "1":
                resolve(EAddressObjectStatus.success);
                return;
              case "2":
              case "3":
                reject(
                  addressResult.AddressStatus !== "Success" ||
                    addressResult.ZipStatus !== "Success"
                    ? EAddressObjectStatus.invalidAddress
                    : EAddressObjectStatus.invalidUnitNumber
                );
                return;
              case "4":
                reject(EAddressObjectStatus.unitNumberRequired);
                return;
              default:
                reject(EAddressObjectStatus.invalidAddress);
            }
          })
          .catch(() => {
            reject(EAddressObjectStatus.invalidAddress);
          });
      });
    } catch (e) {
      reject(EAddressObjectStatus.invalidAddress);
    }
  });

export default {
  searchPlaces,
  checkAddress,
};
