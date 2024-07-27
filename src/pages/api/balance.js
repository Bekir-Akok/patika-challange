//local imports
import { circleDeveloperSdk } from "@/utils/helper";

export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method === "GET") {
    try {
      const response = await circleDeveloperSdk.getWalletTokenBalance({
        id,
      });

      const data = response.data.tokenBalances.filter(
        (balance) => balance.token.name === "USDC"
      )[0].amount;

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
