import React, { useEffect } from "react";
import Wallet from "./Wallet";
import { useActiveAccount } from "thirdweb/react";
import { Link } from "react-router-dom";

function Navbar({ visible }) {
  const smartAccount = useActiveAccount();

  useEffect(() => {
    if (smartAccount) {
      console.log("Account: ", smartAccount.address);
    }
  }, []);

  return (
    <nav className="bg-green-400">
      <div className="container mx-auto flex justify-between items-center p-2">
        <h1 className="text-2xl font-bold text-red-500">
          <a href="/">TraceChainBD</a>
        </h1>
        <div>
          <ul className="flex items-baseline gap-x-4 font-semibold">
            {visible && (
              <>
                <li>
                  <a href="#" className="text-white">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white">
                    Importars
                  </a>
                </li>
              </>
            )}
            <li>
              <Wallet />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
