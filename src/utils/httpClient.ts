import querystring from "query-string";

import { CustomError, CustomErrorType } from "~/types";
import { encrypt, decrypt } from "~/lib/encryption";
import { logger } from ".";

type THttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export function httpClient<T extends any>(
  url: string,
  method: THttpMethod = "GET",
  data: any = {},
  noToken: boolean = false
): Promise<T> {
  const token = localStorage.getItem("cse_token");

  const params: { [i: string]: any } = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      params: encrypt({
        method,
        url,
        data,
      }),
    }),
  };

  if (!url.includes('ValidateProviderLoginTokenRq/json')) {
    logger('---------------------------------------------------')
    logger('Request: ', url, data)
  }


  if (token && !noToken) {
    params.headers["LoginToken"] = token;
  }

  return fetch("/api/proxy", params)
    .then(async (res) => {
      if (res.ok) {
        const result = decrypt((await res.json()).data);
        if (!url.includes('ValidateProviderLoginTokenRq/json')) {
          logger('Response: ', url, result)
        }
        if (Object.keys(result).length === 1 && result["Error"]) {
          throw { httpRes: res, data: result };
        } else {
          result.infoReq = false;
          if (res.status === 206) {
            result.infoReq = true;
          }
          return result;
        }
      } else {
        logger(res)
        try {
          const result =
            res.status === 401
              ? { Name: 'Service error', Message: `${res.status} ${res.statusText}` }
              : JSON.parse(decrypt((await res.json()).data));
          throw { httpRes: res, data: result };
        } catch (error) {
          logger(error)
        }
        throw { httpRes: res, data: { Name: 'Service error', Message: `${res.status} ${res.statusText}` } };
      }
    })
    .catch((e) => {
      if (e.httpRes.status === 401) {
        throw [
          new CustomError(
            CustomErrorType.SESSION_EXPIRED,
            e.data,
            e.data.Message
          ),
        ];
      } else {
        if (e.data.Error) {
          throw e.data.Error.map(
            (err: any) =>
              new CustomError(CustomErrorType.SERVICE_ERROR, err, err.Message)
          )
        } else if (e.data && e.data.DTOApplication && e.data.DTOApplication[0].ValidationError) {
          throw e.data.DTOApplication[0].ValidationError.map(
            (err: any) =>
              new CustomError(
                CustomErrorType.SERVICE_ERROR,
                {
                  Name: err.TypeCd,
                  errorType: err.TypeCd,
                  Message: err.Msg,
                },
                err.Msg
              )
          );
        } else {
          throw [new CustomError(CustomErrorType.SERVICE_NOT_AVAILABLE, e.data, e.data.Message)];
        }
      }
    });
}

export function cleanParamsString<T>(params: { [K in keyof T]: T[K] }) {
  // remove empty values from params
  const cleanQuery = Object.entries(params).reduce(
    (acc, [k, v]) => (v !== undefined && v !== "" ? { ...acc, [k]: v } : acc),
    {}
  );
  return querystring.stringify(cleanQuery);
}
