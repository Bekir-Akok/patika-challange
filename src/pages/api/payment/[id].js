import { ObjectId } from "mongodb";
//local imports
import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("payment_gateway");
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const payments = await db
        .collection("payments")
        .find({ workshopId: id })
        .toArray();

      const data = await Promise.all(
        await payments.map(async (payment) => {
          const wallet = await db
            .collection("wallets")
            .findOne({ _id: ObjectId(payment.walletId) });

          return { ...payment, ...wallet };
        })
      );

      res.status(200).json({ message: "Success", data });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
