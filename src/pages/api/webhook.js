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

        const payments = await db
          .collection("payments")
          .find({
            walletId: String(wallet._id),
            transferAddress: response.data.transaction.sourceAddress,
            restAmount: { $gt: 0 },
          })
          .toArray();

        let remainingAmount = Number(notification.amounts[0]);

        for (const payment of payments) {
          if (remainingAmount <= 0) break;

          const amountToSettle = Math.min(payment.restAmount, remainingAmount);

          const status =
            payment.restAmount - amountToSettle <= 0
              ? "SUCCESS"
              : "MISSING_PAYMENT";

          await db.collection("payments").updateOne(
            { _id: payment._id },
            {
              $set: {
                status,
                restAmount: payment.restAmount - amountToSettle,
              },
            }
          );

          remainingAmount -= amountToSettle;
        }

        res.status(200).json({ message: "Success" });
      } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
      }
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
