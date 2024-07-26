//local imports
import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  /*   const client = await clientPromise;
  const db = client.db("payment_gateway"); */

  if (req.method === "POST") {
    try {
      const event = req.body;

      console.log(event);
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
