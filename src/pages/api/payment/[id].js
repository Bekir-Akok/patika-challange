//local imports
import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("payment_gateway");
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const wallets = await db
        .collection("wallets")
        .find({ workshopId: id })
        .toArray();

      const data = await Promise.all(
        await wallets.map(async (wallet) => {
          const payment = await db
            .collection("payments")
            .findOne({ walletId: String(wallet._id) });

          return { ...wallet, payment };
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
