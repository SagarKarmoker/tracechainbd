import React, { useEffect } from "react";
import Wallet from "./Wallet";
import { useActiveAccount } from "thirdweb/react";
import { Link, BrowserRouter, Routes, Route } from "react-router-dom";
import Roles from "../pages/Roles";
import Error404 from "../pages/Error404";
import Dashboard from "../pages/Dashboard";

function Navbar({ visible }) {
  const smartAccount = useActiveAccount();

  useEffect(() => {
    if (smartAccount) {
      console.log("Account: ", smartAccount.address);
    }
  }, []);

  return (
    <BrowserRouter>
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
                    <Link to="/dashboard" className="text-white">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/importar" className="text-white">
                      Importar
                    </Link>
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

      <Routes>
        <Route path="/" element={<Roles />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/*" element={<Error404 />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Navbar;
