import fetch from "node-fetch";

type THttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export function httpClient<T extends any>(
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

  return fetch(url, params).then(async (res: any) => {
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
  });
}
