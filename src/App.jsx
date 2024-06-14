import {
  ThirdwebProvider,
  ConnectButton 
} from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { createThirdwebClient } from "thirdweb";
import { ChakraProvider } from '@chakra-ui/react'

// we need to use env variables to store the client id
const client = createThirdwebClient({
  clientId: "ee6dfcd5ba3897d57f213689f67f19ab"
});

const wallets = [
  inAppWallet({
    auth: {
      options: ["email", "phone", "google"],
    },
  }),
];

export default function App() {
  return (
    <ThirdwebProvider>
      <ChakraProvider>
      <ConnectButton
        client={client}
        wallets={wallets}
        theme={"dark"}
        connectModal={{
          size: "wide",
          showThirdwebBranding: false,
        }}
        />
        </ChakraProvider>
    </ThirdwebProvider>
  );
}