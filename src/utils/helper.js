const {
  initiateDeveloperControlledWalletsClient,
} = require("@circle-fin/developer-controlled-wallets");

const { API_KEY, ENTITY_SECRET } = process.env;

export const circleDeveloperSdk = initiateDeveloperControlledWalletsClient({
  apiKey: `${API_KEY}`,
  entitySecret: `${ENTITY_SECRET}`,
});
