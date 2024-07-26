import React, { useEffect } from "react";
import { Link, BrowserRouter, Routes, Route } from "react-router-dom";
import Roles from "../pages/Roles";
import Error404 from "../pages/Error404";
import AvatarButton from "./AvatarButton";
import AdminPanel from "../pages/admin/AdminPanel";
import { useActiveAccount } from "thirdweb/react";
import { adminAddr } from "../contants";
import CustomsPanel from "../pages/customs/CustomsPanel";
import DistributorPanel from "../pages/distributor/DistributorPanel";
import RetailerPanel from "../pages/retailer/RetailerPanel";
import Importer from "../pages/importer/Importer";
import RegApplication from "../pages/RegApplication";
import ImporterPanel from "../pages/importer/ImporterPanel";
import { getUserEmail } from "thirdweb/wallets/in-app";
import { client } from "../contants";

function Navbar({ visible }) {
  const activeAccount = useActiveAccount();
  console.log("Account: ", activeAccount?.address);

  const getEmail = async () => {
    const email = await getUserEmail({ client });
    console.log(email);
  }

  getEmail();

  return (
    <BrowserRouter>
      <nav className="bg-green-400">
        <div className="container mx-auto flex justify-between items-center p-2">
          <h1 className="text-2xl font-bold text-red-500">
            <Link to='/'><img src="logo.png"></img></Link>
          </h1>
          <div>
            <ul className="flex items-baseline gap-x-4 font-semibold">
              {
                activeAccount?.address && <>
                  <li>
                    <Link to="/dashboard" className="text-black font-semibold">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/apply" className="text-black font-semibold">
                      Apply for Registration
                    </Link>
                  </li>
                </>
              }
              {/* <li>
                <Link to="/admin" className="text-black font-semibold">
                  Retailer
                </Link>
              </li>
              <li>
                <Link to="/customs" className="text-black font-semibold">
                  Retailer
                </Link>
              </li>
              <li>
                <Link to="/importer" className="text-black font-semibold">
                  Importar
                </Link>
              </li>
              <li>
                <Link to="/distributor" className="text-black font-semibold">
                  Distributor
                </Link>
              </li>
              <li>
                <Link to="/retailer" className="text-black font-semibold">
                  Retailer
                </Link>
              </li> */}
              <li>
                <AvatarButton />
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Roles />} />
        {activeAccount?.address === adminAddr &&
          (<Route path="/admin" element={<AdminPanel />} />)
        }

        {/* <Route path="/importer" element={<Importer />} />
        <Route path="/distributor" element={<Distributor />} />
        <Route path="/importerdashboard" element={<ImporterDashboard />} />
        <Route path="/Importerproductchain " element={<ImporterProductChain />} /> */}

        {/* admin routes */}
        <Route path="/admin" element={<AdminPanel />} />

        {/* customs routes */}
        <Route path="/customs" element={<CustomsPanel />} />

        {/* importer routes */}
        {/* <Route path="/importer" element={<Importer />} /> */}
        <Route path="/importer" element={<ImporterPanel />} />

        {/* distributor routes */}
        <Route path="/distributor" element={<DistributorPanel />} />

        {/* retailer routes */}
        <Route path="/retailer" element={<RetailerPanel />} />

        {/* common routes */}
        <Route path="/apply" element={<RegApplication />} />
        <Route path="/*" element={<Error404 />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Navbar;
