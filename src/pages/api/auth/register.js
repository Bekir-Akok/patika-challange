import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password, name } = req.body;
    try {
      const client = await clientPromise;
      const db = client.db("payment_gateway");

      const isUserExist = await db.collection("user").findOne({ email });
      if (isUserExist) return res.status(401).json({ status_code: 102 });

      await db.collection("user").insertOne({ email, password, name });

      res.status(201).json({ message: "Success" });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
