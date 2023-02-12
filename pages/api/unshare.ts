// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { unshareDrawing } from "@/lib/store";
import type { NextApiRequest, NextApiResponse } from "next";

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

  const payload = req.body as { key?: string };
  if (!payload) {
    res.status(400).json({ Ok: false });
    return;
  }

  if (!payload.key) {
    res.status(400).json({ Ok: false });
    return;
  }

  await unshareDrawing(payload.key);

  res.status(200).json({ Ok: true });
}
