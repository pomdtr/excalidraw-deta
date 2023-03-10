// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { saveContent, Drawing } from "../../lib/store";

type Data = {
  Ok: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.status(405).json({ Ok: false });
    return;
  }
  const drawing = req.body as Drawing;
  if (!drawing) {
    res.status(400).json({ Ok: false });
    return;
  }

  if (!drawing.key) {
    res.status(400).json({ Ok: false });
    return;
  }

  if (!drawing.content) {
    res.status(400).json({ Ok: false });
    return;
  }

  await saveContent(req.body as Drawing);
  res.status(200).json({ Ok: true });
}
