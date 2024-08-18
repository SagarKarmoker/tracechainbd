import { ConnectButton } from "thirdweb/react";
import { createWallet, walletConnect } from "thirdweb/wallets";
import { client } from "../contants"; // Assuming `client` is correctly imported
import { useLocation } from "react-router-dom";
import useAuth from "../hooks/userAuth";

function Wallet() {
  const { isConnected, connectWallet } = useAuth();

  const location = useLocation();
  const isAdmin = location.pathname === "/admin";

  const adminWallets = [createWallet("io.metamask"), walletConnect()];

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
        <>
          {!isConnected && (
            <>
              <button
                onClick={connectWallet}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Login / Register
              </button>
            </>
          )}
        </>
      )}
    </>
  );
}

export default Wallet;
