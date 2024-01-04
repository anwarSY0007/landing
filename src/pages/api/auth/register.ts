import { NextApiRequest, NextApiResponse } from "next";
import { signUp } from "@/libs/firebase/service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // Process a POST request
    await signUp(req.body, (status: boolean) => {
      if (status) {
        res.status(200).json({ name: "Berhasil", status: true });
      } else {
        res.status(400).json({ name: "Gagal!", status: false });
      }
    });
  } else {
    res
      .status(405)
      .json({ name: "Metode masukan tidak diizinkan", status: false });
  }
}
