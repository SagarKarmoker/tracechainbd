import {useEffect} from "react";
import { ConnectButton } from "thirdweb/react";
import { createWallet, walletConnect } from "thirdweb/wallets";
import { client, wallets, AAFactory, adminAddr } from "../contants";
import { polygonAmoy } from "thirdweb/chains";
import { useLocation } from "react-router-dom";

function Wallet() {
  const location = useLocation();
  const isAdmin = location.pathname === "/admin";

  const adminWallets = [
    createWallet("io.metamask"),
    walletConnect(),
  ];

  return (
    <>
      {isAdmin ? (
        <>
          <ConnectButton
            client={client}
            wallets={adminWallets}
            theme={"dark"}
            connectModal={{
              size: "compact",
              showThirdwebBranding: false,
            }}
          />
        </>
      ) : (
        <ConnectButton
          client={client}
          wallets={wallets}
          theme={"dark"}
          accountAbstraction={{
            chain: polygonAmoy,
            factoryAddress: AAFactory,
            gasless: true,
          }}
          connectModal={{
            size: "wide",
            showThirdwebBranding: false,
          }}
        />
      )}
    </>
  );
}

export default Wallet;
