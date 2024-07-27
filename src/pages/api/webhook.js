//local imports
import clientPromise from "@/lib/mongodb";
import { circleDeveloperSdk } from "@/utils/helper";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("payment_gateway");

  if (req.method === "POST") {
    try {
      const { notificationType, notification } = req.body;

      if (notificationType === "transactions.inbound") {
        const response = await circleDeveloperSdk.getTransaction({
          id: notification.id,
        });

        const wallet = await db.collection("wallets").findOne({
          address: notification.destinationAddress,
        });

        const payment = await db.collection("payments").find({
          walletId: wallet._id,
          transferAddress: response.data.transaction.sourceAddress,
        });

        const paymentId = payment.length > 0 && payment[0]._id;
        const restAmount = payment.length > 0 && payment[0].restAmount;

        const status =
          restAmount - Number(notification.amounts[0]) === 0
            ? "SUCCESS"
            : "MISSING_PAYMENT";

        await db.collection("payments").updateOne(
          {
            _id: paymentId,
          },
          {
            $set: {
              status,
              restAmount: restAmount - Number(notification.amounts[0]),
            },
          },
          { upsert: true }
        );
      }
      res.status(200).json({ message: "Success" });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
