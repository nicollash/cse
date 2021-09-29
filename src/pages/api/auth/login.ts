import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { config } from "~/config";
import { getSession } from "~/lib/get-session";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const session = await getSession(req, res);

      const { UserId, Password } = req.body;

      const userInfo: any = await fetch(
        `${config.apiBaseURL}/ProviderLoginRq/json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            UserId,
            Password,
          }),
        }
      ).then((res) => res.json());

      session.user = { ...userInfo, LoginId: UserId };

      res.status(200).json({ success: true });
    } catch (error) {
      console.log(error);
      res.status(401).json({ success: false });
    }
  } else {
    res.status(404);
  }
}
