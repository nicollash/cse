// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "~/backend/lib";
import { VehicleService } from "~/backend/services";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const session = await getSession(req, res);

    if (session.user) {
      const result = await VehicleService.getModelList(
        session.user,
        req.query.year as string,
        req.query.make as string
      );
      return res.status(200).json(result);
    } else {
      return res.status(401);
    }
  } else {
    return res.status(404);
  }
}
