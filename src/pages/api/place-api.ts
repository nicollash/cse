// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { getSession } from "~/backend/lib";
import { config } from "~/config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const session = await getSession(req, res);

    if (session.user) {
      const input = req.query.input as string;
      const result = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=(regions)&key=${config.googleAPIKey}`
      ).then((res) => res.json());
      res.status(200).json(result);
    } else {
      res.status(401).json({ success: false });
    }
  } else {
    res.status(404);
  }
}
