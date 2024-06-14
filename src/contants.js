/* 
1. Importer 
2. Distributor 
3. Retailers
4. Consumers
5. Government 
6. Admin
*/
import { inAppWallet } from "thirdweb/wallets";
import { createThirdwebClient } from "thirdweb";

// we need to use env variables to store the client id
const client = createThirdwebClient({
  clientId: "ee6dfcd5ba3897d57f213689f67f19ab",
});

const wallets = [
  inAppWallet({
    auth: {
      options: ["email", "phone", "google"],
    },
  }),
];

export { client, wallets };