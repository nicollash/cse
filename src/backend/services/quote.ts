import { explodeAddress, handleSSN } from "~/helpers";
import { HttpService } from "~/backend/lib";
import {
  DTOApplication,
  GenerateQuoteRequest,
  QuoteResponse,
  QuickQuoteInfoResponse,
  SavePaymentRequestInfo,
} from "~/types";
import { config } from "~/config";

class QuoteService {
  static async getQuoteList(user: any, query: string) {
    return HttpService.request<QuickQuoteInfoResponse>(
      `${config.apiBaseURL}/GetQuickQuoteListRq/json`,
      "POST",
      {
        LoginId: user.LoginId,
        quoteSearchKey: query,
        ProviderRef: user.DTOProvider[0].SystemId,
      },
      user.LoginToken
    );
  }

  static async parseAddress(user: any, address) {
    const addressObj = await new Promise<any>((resolve) => {
      explodeAddress(address.address, (err: any, addressObj) => {
        resolve(addressObj);
      });
    });

    const addressInfo = await HttpService.request(
      `${config.apiBaseURL}/ValidateAddressRq/json`,
      "POST",
      {
        Address1: addressObj.street_address1,
        Address2: address.unitNumber,
        City: addressObj.city,
        State: addressObj.state,
        PostalCode: addressObj.postal_code,
      },
      user.LoginToken
    ).then((res: any) => res.JsonValidatedAddress[0].Address);

    return { addressObj, addressInfo };
  }

  static async generateQuote(
    user,
    {
      FirstName,
      LastName,
      Addr1,
      Addr2,
      City,
      StateProvCd,
      PostalCode,
      LineCd = "PersonalAuto",
      CompanyCd = "0017",
    }
  ) {
    const data = {
      FirstName,
      LastName,
      Addr1,
      Addr2,
      City,
      StateProvCd,
      PostalCode,
      ProviderNumber: user.DTOProvider[0].ProviderNumber,
      LoginId: user.LoginId,
      LineCd,
      CompanyCd,
    };

    return HttpService.request<QuoteResponse>(
      `${config.apiBaseURL}/GenerateQuoteRq/json`,
      "POST",
      Object.keys(data)
        .filter((key) => !!data[key])
        .reduce((obj, key) => ({ ...obj, [key]: data[key] }), {}),
      user.LoginToken
    );
  }

  static async getQuote(user: any, ApplicationNumber: string) {
    return HttpService.request<QuoteResponse>(
      `${config.apiBaseURL}/GetQuickQuoteRq/json`,
      "POST",
      {
        ApplicationNumber,
        Owner: user.LoginId,
      },
      user.LoginToken
    );
  }

  static async updateQuote(user: any, DTOApplication: DTOApplication[]) {
    return HttpService.request<QuoteResponse>(
      `${config.apiBaseURL}/UpdateQuickQuoteRq/json`,
      "POST",
      {
        LoginId: user.LoginId,
        DTOApplication,
      },
      user.LoginToken
    );
  }

  static async getInfractionList(user: any, DTOApplication: DTOApplication[]) {
    return HttpService.request(
      `${config.apiBaseURL}/QQGetInfractionListRq/json`,
      "POST",
      {
        LoginId: user.LoginId,
        DTOApplication: handleSSN(DTOApplication),
      },
      user.LoginToken
    );
  }

  static async externalApplicationCloseOut(
    user: any,
    DTOApplication: DTOApplication
  ) {
    return HttpService.request(
      `${config.apiBaseURL}/QQExternalApplicationCloseOutRq/json`,
      "POST",
      {
        LoginId: user.LoginId,
        DTOApplication,
      },
      user.LoginToken
    );
  }
}

export default QuoteService;

// export const externalApplicationCloseOut = (
//   LoginId: string,
//   DTOApplication: DTOApplication
// ) =>
//   httpClient<QuoteResponse>(
//     `${config.apiBaseURL}/QQExternalApplicationCloseOutRq/json`,
//     "POST",
//     {
//       LoginId,
//       DTOApplication,
//     }
//   );

// export const updateDownPaymentDetailsPostOneIncSave = (
//   LoginId: string,
//   DTOApplication: DTOApplication[],
//   SavePaymentRequest: SavePaymentRequestInfo
// ) =>
//   httpClient<QuoteResponse>(
//     `${config.apiBaseURL}/QQUpdateDownPaymentDetailsRq/json`,
//     "POST",
//     {
//       //LoginId,
//       DTOApplication,
//       SavePaymentRequest: JSON.stringify(SavePaymentRequest),
//     }
//   );

// export const convertQuoteToApplication = (
//   LoginId: string,
//   DTOApplication: DTOApplication[]
// ) =>
//   httpClient<QuoteResponse>(
//     `${config.apiBaseURL}/ConvertQuickQuoteToApplicationRq/json`,
//     "POST",
//     {
//       LoginId,
//       DTOApplication,
//     }
//   );

// export const getInfractionList = (
//   LoginId: string,
//   DTOApplication: DTOApplication[]
// ) =>
//   httpClient<QuoteResponse>(
//     `${config.apiBaseURL}/QQGetInfractionListRq/json`,
//     "POST",
//     {
//       LoginId,
//       DTOApplication,
//     }
//   );
