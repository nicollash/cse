import fetch from "node-fetch";
import { logger } from "~/helpers";
import { decrypt } from "~/lib/encryption";
import { CustomError, CustomErrorType } from "~/types";

type THttpMethod = "GET" | "POST" | "PUT" | "DELETE";

class HttpService {
  static async request<T extends any>(
    url: string,
    method: THttpMethod = "GET",
    data: any = {},
    token: string = null
  ): Promise<T> {
    const params: { [i: string]: any } = {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };

    if (token) {
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
      .then(async (res: any) => {
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
          let result = null;

          try {
            result =
              res.status === 401
                ? {
                    Name: "Service error",
                    Message: `${res.status} ${res.statusText}`,
                  }
                : await res.json();
          } catch (error) {
            logger(error);
            throw {
              httpRes: res,
              data: [
                {
                  Name: "Service error",
                  Message: `${res.status} ${res.statusText}`,
                },
              ],
            };
          }

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
          if (e.data) {
            const errArray = e.data?.Error ? e.data.Error : e.data;

            throw errArray.map(
              (err: any) =>
                new CustomError(CustomErrorType.SERVICE_ERROR, err, err.Message)
            );
          } else if (
            e.data &&
            e.data.DTOApplication &&
            e.data.DTOApplication[0].ValidationError
          ) {
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
            throw [
              new CustomError(
                CustomErrorType.SERVICE_NOT_AVAILABLE,
                e.data,
                e.data.Message
              ),
            ];
          }
        }
      });
  }
}
export default HttpService;
