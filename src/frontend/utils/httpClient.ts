import querystring from "query-string";

import { CustomError, CustomErrorType } from "~/types";

type THttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export function httpClient<T extends any>(
  url: string,
  method: THttpMethod = "GET",
  data: any = {},
  noToken: boolean = false
): Promise<T> {
  const token = localStorage.getItem("cse_token");

  const params: { [i: string]: any } = {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };

  if (token && !noToken) {
    params.headers["LoginToken"] = token;
  }

  if (method !== "GET") {
    params.body = JSON.stringify(data);
  } else {
    url = `${url}?${Object.keys(data)
      .map((key) => `${key}=${data[key]}`)
      .join("&")}`;
  }
  return fetch(url, params)
    .then(async (res) => {
      if (res.ok) {
        const result = await res.json();
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
        const result =
          res.status === 401
            ? { Message: "Login Token Error" }
            : await res.json();
        throw { httpRes: res, data: result };
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
          );
        } else if (e.data?.DTOApplication && e.data.DTOApplication[0]?.ValidationError) {
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
          throw [new CustomError(CustomErrorType.SERVICE_NOT_AVAILABLE)];
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
