import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "~/backend/lib";
import { AuthService } from "~/backend/services";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const session = await getSession(req, res);
    const checkStatus = await AuthService.checkLoginStatus(session);

    res.status(checkStatus.success ? 200 : 500).json(checkStatus);
  } else {
    res.status(404).send({});
  }
}
