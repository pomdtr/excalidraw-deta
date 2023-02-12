// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Drive } from "deta";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  Ok: boolean;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (!req.body || typeof req.body !== "string") {
    return res.status(400).json({ Ok: false });
  }

  const drive = Drive("drawings");
  drive.put("deta.excalidraw", {
    contentType: "application/json",
    data: req.body,
  });
  res.status(200).json({ Ok: true });
}
