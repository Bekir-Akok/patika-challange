//local imports
import { circleDeveloperSdk } from "@/utils/helper";

export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method === "GET") {
    try {
      const response = await circleDeveloperSdk.getWalletTokenBalance({
        id,
      });

      res
        .status(200)
        .json({ message: "Success", data: response.data.tokenBalances });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
