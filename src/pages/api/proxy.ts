// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { encrypt, decrypt } from "~/lib/encryption";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const parsedBody = decrypt(req.body.params);
    const { url, method, data } = parsedBody;
    const LoginToken = (req.headers["logintoken"] as string) || null;

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
    };

    if (LoginToken) {
      headers["LoginToken"] = decrypt(LoginToken);
    }

    console.log("Proxy - ", {
      method,
      body: JSON.stringify(data),
      headers,
    });

    const result = await fetch(url, {
      method,
      body: JSON.stringify(data),
      headers,
    });

    const returnData = await (result.ok ? result.json() : result.text());

    res.status(result.status).json({
      data: encrypt(returnData),
    });
  } else {
    res.status(404);
  }
}
