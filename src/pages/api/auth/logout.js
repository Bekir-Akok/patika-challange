export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      res.setHeader("Set-Cookie", "x-access-token=; Max-Age=0; path=/;");
      res.status(200).json({ message: "Success" });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
