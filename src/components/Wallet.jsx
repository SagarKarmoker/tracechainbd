import { ConnectButton } from "thirdweb/react";
import { client, wallets } from "../contants.js";

function Wallet() {
  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      theme={"dark"}
      connectModal={{
        size: "wide",
        showThirdwebBranding: false,
      }}
    />
  );
}

export default Wallet;
