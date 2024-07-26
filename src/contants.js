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
  clientId: "556f2fc16f1a66b07065b18bf962cbd1", // PC
});

const wallets = [
  inAppWallet({
    auth: {
      options: ["email", "phone", "google"],
    },
  }),
];

const AAFactory = "0x7607132B9d67414E7DCdC411aAD9A78bB87Eb337" // PC
const adminAddr = "0x776f5b481881DF6A0d32930118Bbcc52D313485B"
const TraceChainContract = "0xC5962D17D16208dAC9E566bB2869b4C44Ca29092"

export { client, wallets, AAFactory, adminAddr, TraceChainContract };