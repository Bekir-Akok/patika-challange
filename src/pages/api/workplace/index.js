import jwt from "jsonwebtoken";
import cookie from "cookie";

//local imports
import clientPromise from "@/lib/mongodb";
import { circleDeveloperSdk } from "@/utils/helper";

const { SECRET_KEY } = process.env;

export default async function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies["x-access-token"];
  const { _id } = jwt.decode(token, new TextEncoder().encode(SECRET_KEY));

  const client = await clientPromise;
  const db = client.db("payment_gateway");
  if (req.method === "GET") {
    try {
      const data = await db
        .collection("workshop")
        .find({ userId: _id })
        .toArray();

      res.status(200).json({ message: "Success", data });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (req.method === "POST") {
    try {
      const { name } = req.body;

      const response = await circleDeveloperSdk.createWalletSet({
        name,
      });

      await db.collection("workshop").insertOne({
        userId: _id,
        name,
        walletSetId: response.data.walletSet.id,
      });

      res.status(201).json({ message: "Success" });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
