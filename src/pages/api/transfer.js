//local imports
import { circleDeveloperSdk } from "@/utils/helper";

export default async function handler(req, res) {
  const { myAddress, amount, transferAddress } = req.body;
  if (req.method === "POST") {
    try {
      const response = await circleDeveloperSdk.createTransaction({
        walletId: myAddress,
        tokenId: `${process.env.USDC_TOKEN_ID}`,
        destinationAddress: transferAddress,
        amounts: [amount],
        fee: {
          type: "level",
          config: {
            feeLevel: "MEDIUM",
          },
        },
      });

      res.status(200).json({ message: "Success", data: response.data });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
