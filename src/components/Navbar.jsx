import React, { useEffect } from "react";
import Wallet from "./Wallet";
import { useActiveAccount } from "thirdweb/react";
import { Link, BrowserRouter, Routes, Route } from "react-router-dom";
import Roles from "../pages/Roles";
import Error404 from "../pages/Error404";
import Dashboard from "../pages/Dashboard";
import { Button, Avatar } from '@chakra-ui/react'
import AvatarButton from "./AvatarButton";
import Importer from "../pages/Importer";
import Distributor from "./Distributor";
import AdminPanel from "./AdminPanel";
import ImporterDashboard from "../pages/ImporterDashboard"
import ImporterProductChain from "../pages/ImporterProductChain";

function Navbar({visible}) {
  
  return (
    <BrowserRouter>
      <nav className="bg-green-400">
        <div className="container mx-auto flex justify-between items-center p-2">
          <h1 className="text-2xl font-bold text-red-500">
            <Link to='/'><img src="logo.png"></img></Link>
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
                <AvatarButton />
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Roles/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/importer" element={<Importer/>} />
        <Route path="/distributor" element={<Distributor/>} />
        <Route path="/admin" element={<AdminPanel/>} />
        <Route path="/importerdashboard" element={<ImporterDashboard/>} />
        <Route path="/Importerproductchain " element={<ImporterProductChain/>} />
        <Route path="/*" element={<Error404 />} />
        <Route path="*" element={<Error404 />} />

      </Routes>
    </BrowserRouter>
  );
}

export default Navbar;
