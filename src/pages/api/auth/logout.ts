import { config } from "~/config";
import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { getSession } from "~/lib/get-session";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    //
    try {
      const session = await getSession(req, res);

      if (session.user) {
        await fetch(`${config.apiBaseURL}/LogoutTokenRq/json`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
            LoginToken: session.user.LoginToken,
          },
        });
      }

      session.user = null;

      res.status(200).json({ success: true });
    } catch (e) {
      console.log(e);
      res.status(500);
    }
  } else {
    res.status(404);
  }
}
