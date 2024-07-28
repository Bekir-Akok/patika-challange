import clientPromise from "@/lib/mongodb";
import { circleDeveloperSdk } from "@/utils/helper";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("payment_gateway");
  if (req.method === "POST") {
    try {
      const { notificationType, notification, notificationId } = req.body;
      const isExistNotification = await db.collection("notifications").findOne({
        notificationId,
      });

      if (notificationType === "transactions.inbound" && !isExistNotification) {
        const response = await circleDeveloperSdk.getTransaction({
          id: notification.id,
        });

        const wallet = await db.collection("wallets").findOne({
          address: notification.destinationAddress,
          blockchain: response.data.transaction.blockchain,
        });

        const payments = await db
          .collection("payments")
          .find({
            walletId: String(wallet?._id),
            transferAddress: response.data.transaction.sourceAddress,
            restAmount: { $gt: 0 },
            blockchain: response.data.transaction.blockchain,
          })
          .toArray();

        let remainingAmount = parseFloat(notification.amounts[0]);
        const totalRestAmount = payments.reduce(
          (acc, payment) => acc + payment.restAmount,
          0
        );

        if (remainingAmount > totalRestAmount) {
          remainingAmount = totalRestAmount;
          //we can payback the extra amount
        }

        for (const payment of payments) {
          if (remainingAmount <= 0) break;

          const amountToSettle = Math.min(payment.restAmount, remainingAmount);

          console.log(amountToSettle, payment.restAmount - amountToSettle);

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

        await db.collection("notifications").insertOne({
          notificationId,
        });
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
