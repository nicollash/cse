import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "~/lib/get-session";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const session = await getSession(req, res);

    session.user = null;

    res.status(200).json({ success: true });
  } else {
    res.status(404);
  }
}
