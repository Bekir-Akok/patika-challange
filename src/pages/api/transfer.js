//local imports
import { circleDeveloperSdk } from "@/utils/helper";

const { ETH_TOKEN_ID, USDC_TOKEN_ID } = process.env;
export default async function handler(req, res) {
  const { myAddress, amount, transferAddress, blockchain } = req.body;
  if (req.method === "POST") {
    try {
      const response = await circleDeveloperSdk.createTransaction({
        walletId: myAddress,
        tokenId: blockchain === "MATIC-AMOY" ? USDC_TOKEN_ID : ETH_TOKEN_ID,
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
