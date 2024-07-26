/* eslint-disable import/no-anonymous-default-export */
import jwt from "jsonwebtoken";
//local imports
import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;
    try {
      const client = await clientPromise;
      const db = client.db("payment_gateway");

      const isUserExist = await db.collection("user").findOne({ email });
      if (!isUserExist) return res.status(401).json({ status_code: 101 });

      if (isUserExist.password !== password)
        return res.status(401).json({ message: "Failure" });

      const token = jwt.sign({ _id: isUserExist._id }, process.env.SECRET_KEY);

      res.setHeader(
        "Set-Cookie",
        `x-access-token=${token}; HttpOnly; Path=/; ${
          process.env.NODE_ENV !== "development" ? "Secure" : ""
        }`
      );

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
