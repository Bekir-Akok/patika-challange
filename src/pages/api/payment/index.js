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
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background-color: #f4f4f4;
              }
              .payment-container {
                background: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                width: 100%;
                max-width: 400px;
              }
              .payment-container h2 {
                margin-bottom: 20px;
              }
              .payment-container label {
                display: block;
                margin-bottom: 8px;
              }
              .payment-container input, 
              .payment-container select, 
              .payment-container button {
                width: 100%;
                padding: 10px;
                margin-bottom: 20px;
                border: 1px solid #ccc;
                border-radius: 4px;
              }
              .payment-container button {
                background-color: #28a745;
                color: #fff;
                border: none;
                cursor: pointer;
              }
              .payment-container button:hover {
                background-color: #218838;
              }
            </style>
          </head>
          <body>
            <div class="payment-container">
              <h2>Payment Form</h2>
              <form id="paymentForm">
                <input type="hidden" name="amount" value="${amount}">
                <input type="hidden" name="workshopId" value="${workshopId}">
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
                <label for="selectedAddress">Selected Network Address:</label>
                <input type="text" id="selectedAddress" name="selectedAddress" value="${defaultAddress}" readonly>
                <label for="transferAddress">Your Transfer Address:</label>
                <input type="text" id="transferAddress" name="transferAddress" value="0xaf9be9022668c2ae3adcc5a29c5d1c758bbc3c68" readonly disabled>
                <button type="submit">Submit</button>
              </form>
            </div>
            <script>
              document.addEventListener('DOMContentLoaded', function() {
                const networkSelect = document.getElementById('network');
                const selectedAddressInput = document.getElementById('selectedAddress');
                const selectedAddressIdInput = document.getElementById('selectedAddressId');
                const transferAddressInput = document.getElementById('transferAddress');

                const transferAddresses = {
                  "ETH-SEPOLIA": "0xaf9be9022668c2ae3adcc5a29c5d1c758bbc3c68",
                  "MATIC-AMOY": "0x6280af88d20fef12182ecf1f4b968222b2f7cb05"
                };

                networkSelect.addEventListener('change', function(e) {
                  const selectedOption = e.target.options[e.target.selectedIndex];
                  const address = selectedOption.getAttribute('data-address');
                  const id = selectedOption.value;
                  const blockchain = selectedOption.getAttribute('data-blockchain');
                  selectedAddressInput.value = address;
                  selectedAddressIdInput.value = id;
                  transferAddressInput.value = transferAddresses[blockchain];
                });

                if (networkSelect.options.length > 0) {
                  const firstOption = networkSelect.options[0];
                  selectedAddressInput.value = firstOption.getAttribute('data-address');
                  selectedAddressIdInput.value = firstOption.value;
                  const firstBlockchain = firstOption.getAttribute('data-blockchain');
                  transferAddressInput.value = transferAddresses[firstBlockchain];
                }
              });

              document.getElementById('paymentForm').onsubmit = async function(e) {
                e.preventDefault();
                const amount = e.target.amount.value;
                const workshopId = e.target.workshopId.value;
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
                  body: JSON.stringify({ amount, workshopId, selectedAddress, selectedAddressId, transferAddress })
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
    const { selectedAddressId, transferAddress, amount, workshopId } = req.body;
    const castNumber = Number(amount);
    try {
      await db.collection("payments").insertOne({
        walletId: selectedAddressId,
        transferAddress,
        amount: castNumber,
        restAmount: castNumber,
        workshopId,
        status: "Pending",
      });

      const payment = await db.collection("payments").findOne({
        walletId: selectedAddressId,
        transferAddress,
        amount: castNumber,
        workshopId,
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
