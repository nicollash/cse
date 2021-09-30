import type { NextApiRequest, NextApiResponse } from "next";
import { getSession, HttpService } from "~/backend/lib";
import { config } from "~/config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const action = req.query.action as string;
  const session = await getSession(req, res);
  let result = null;

  try {
    result = await HttpService.request(
      `${config.apiBaseURL}/${action}/json`,
      req.method as any,
      req.body,
      session.user ? session.user.LoginToken : null
    );

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(result);
  }
}
