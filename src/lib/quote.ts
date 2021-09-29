import {
  DTOApplication,
  GenerateQuoteRequest,
  QuoteResponse,
  QuickQuoteInfoResponse,
  SavePaymentRequestInfo,
} from "~/types";
import { httpClient } from "./http";
import { config } from "~/config";

// export const generateQuote: (
//   params: GenerateQuoteRequest
// ) => Promise<QuoteResponse> = ({
//   FirstName,
//   LastName,
//   Addr1,
//   Addr2,
//   City,
//   StateProvCd,
//   PostalCode,
//   ProviderNumber,
//   LoginId,
//   LineCd = "PersonalAuto",
//   CompanyCd = "0017",
// }) => {
//   const data = {
//     FirstName,
//     LastName,
//     Addr1,
//     Addr2,
//     City,
//     StateProvCd,
//     PostalCode,
//     ProviderNumber,
//     LoginId,
//     LineCd,
//     CompanyCd,
//   };
//   return httpClient<QuoteResponse>(
//     `${config.apiBaseURL}/GenerateQuoteRq/json`,
//     "POST",
//     Object.keys(data)
//       .filter((key) => !!data[key])
//       .reduce((obj, key) => ({ ...obj, [key]: data[key] }), {})
//   );
// };

// export const updateQuote = (
//   LoginId: string,
//   DTOApplication: DTOApplication[]
// ) =>
//   httpClient<QuoteResponse>(
//     `${config.apiBaseURL}/UpdateQuickQuoteRq/json`,
//     "POST",
//     {
//       LoginId,
//       DTOApplication,
//     }
//   );

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

export const getQuoteList = (
  LoginId: string,
  query: string,
  providerSystemId: string,
  userToken: string
) =>
  httpClient<QuickQuoteInfoResponse>(
    `${config.apiBaseURL}/GetQuickQuoteListRq/json`,
    "POST",
    {
      LoginId,
      quoteSearchKey: query,
      ProviderRef: providerSystemId,
    },
    userToken
  );

// export const getQuote = (ApplicationNumber: string, Owner: string) =>
//   httpClient<QuoteResponse>(
//     `${config.apiBaseURL}/GetQuickQuoteRq/json`,
//     "POST",
//     {
//       ApplicationNumber,
//       Owner: Owner,
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
