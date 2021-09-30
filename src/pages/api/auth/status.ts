import { config } from "~/config";
import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { getSession } from "~/lib/get-session";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    //
    try {
      const session = await getSession(req, res);

      if (!session.user) {
        res.status(200).json({ isLoggedIn: false });
      } else {
        const tokenInfo: any = await fetch(
          `${config.apiBaseURL}/ValidateProviderLoginTokenRq/json`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
              LoginToken: session.user.LoginToken,
            }),
          }
        ).then((res) => res.json());

        if (tokenInfo.tokenStatus === "Invalid") {
          res.status(200).json({ isLoggedIn: false });
        } else {
          res.status(200).json({ isLoggedIn: true });
        }
      }
    } catch (e) {
      console.log(e);
      res.status(500).send({});
    }
  } else {
    res.status(404).send({});
  }
}
