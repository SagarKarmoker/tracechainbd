import { ConnectButton } from "thirdweb/react";
import { client, wallets, AAFactory} from "../contants.js";
import { sepolia } from "thirdweb/chains";

function Wallet() {
  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      theme={"dark"}
      accountAbstraction={{
        chain: sepolia,
        factoryAddress: AAFactory,
        gasless: true,
      }}
      connectModal={{
        size: "wide",
        showThirdwebBranding: false,
      }}
    />
  );
}

export default Wallet;
