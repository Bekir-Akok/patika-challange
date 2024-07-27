//local imports
import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("payment_gateway");
  const { workshopId, amount } = req.query;

  if (req.method === "GET") {
    try {
      const wallets = await db
        .collection("wallets")
        .find({ workshopId })
        .toArray();

      const defaultAddress = wallets.length > 0 ? wallets[0].address : "";

      res.send(`
        <html>
          <body>
            <form id="paymentForm">
              <input type="hidden" name="amount" value="${amount}">
              <input type="hidden" id="selectedAddressId" name="selectedAddressId" value="${
                wallets.length > 0 ? wallets[0]._id : ""
              }">
              <label for="network">Select Network:</label>
              <select id="network" name="network" required>
                ${wallets
                  .map(
                    (wallet) => `
                  <option value="${wallet._id}" data-address="${wallet.address}" data-blockchain="${wallet.blockchain}">
                    ${wallet.blockchain}
                  </option>
                `
                  )
                  .join("")}
              </select>
              <br>
              <label for="selectedAddress">Selected Network Address:</label>
              <input type="text" id="selectedAddress" name="selectedAddress" value="${defaultAddress}" readonly>
              <br>
              <label for="transferAddress">Your Transfer Address:</label>
              <input type="text" id="transferAddress" name="transferAddress" required>
              <br>
              <button type="submit">Submit</button>
            </form>
            <script>
              document.addEventListener('DOMContentLoaded', function() {
                const networkSelect = document.getElementById('network');
                const selectedAddressInput = document.getElementById('selectedAddress');
                const selectedAddressIdInput = document.getElementById('selectedAddressId');

                
                networkSelect.addEventListener('change', function(e) {
                  const selectedOption = e.target.options[e.target.selectedIndex];
                  const address = selectedOption.getAttribute('data-address');
                  const id = selectedOption.value;
                  selectedAddressInput.value = address;
                  selectedAddressIdInput.value = id;
                });

                
                if (networkSelect.options.length > 0) {
                  const firstOption = networkSelect.options[0];
                  selectedAddressInput.value = firstOption.getAttribute('data-address');
                  selectedAddressIdInput.value = firstOption.value;
                }
              });

              document.getElementById('paymentForm').onsubmit = async function(e) {
                e.preventDefault();
                const amount = e.target.amount.value;
                const selectedAddress = e.target.selectedAddress.value;
                const selectedAddressId = e.target.selectedAddressId.value;
                const transferAddress = e.target.transferAddress.value;

                const response = await fetch('${
                  process.env.NEXT_PUBLIC_MAIN_URL
                }/payment', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ amount, selectedAddress, selectedAddressId, transferAddress })
                });

                const result = await response.json();
                window.parent.postMessage(result, '*');
              }
            </script>
          </body>
        </html>
      `);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (req.method === "POST") {
    const { selectedAddressId, transferAddress, amount } = req.body;
    const castNumber = Number(amount);
    try {
      await db.collection("payments").insertOne({
        walletId: selectedAddressId,
        transferAddress,
        amount: castNumber,
        restAmount: castNumber,
        status: "Pending",
      });

      const payment = await db.collection("payments").findOne({
        walletId: selectedAddressId,
        transferAddress,
        amount: castNumber,
        status: "Pending",
      });

      res.status(201).json({ message: "Success", result: payment });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
