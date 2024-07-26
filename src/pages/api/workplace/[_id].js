import { ObjectId } from "mongodb";
//local imports
import clientPromise from "@/lib/mongodb";
import { circleDeveloperSdk } from "@/utils/helper";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("payment_gateway");
  const { _id } = req.query;

  const selectedShop = await db
    .collection("workshop")
    .findOne({ _id: ObjectId(_id) });

  if (req.method === "GET") {
    try {
      const data = await db
        .collection("wallets")
        .find({ workshopId: _id })
        .toArray();

      res
        .status(200)
        .json({ message: "Success", data, name: selectedShop.name });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (req.method === "POST") {
    const { network } = req.body;
    try {
      const response = await circleDeveloperSdk.createWallets({
        accountType: "SCA",
        blockchains: [network],
        count: 1,
        walletSetId: selectedShop.walletSetId,
      });

      const { address, blockchain, createDate } = response.data.wallets[0];

      await db.collection("wallets").insertOne({
        address,
        blockchain,
        createDate,
        workshopId: _id,
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

//  ["ETH"]
//  ["ETH-SEPOLIA"]
//  ["AVAX"]
//  ["AVAX-FUJI"]
//  ["MATIC"]
//  ["MATIC-AMOY"]
//  ["SOL"]
//  ["SOL-DEVNET"]
