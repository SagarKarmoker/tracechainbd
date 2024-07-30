import React, { useEffect, useState } from "react";
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
import RegApplication from "../pages/RegApplication";
import ImporterPanel from "../pages/importer/ImporterPanel";
import { getUserEmail } from "thirdweb/wallets/in-app";
import { client } from "../contants";
import { isAdmin, isCustoms, isImporter, isDistributor, isRetailer } from "./utils/RoleCheck";

function Navbar() {
  const [role, setRole] = useState("");
  const activeAccount = useActiveAccount();
  console.log("Account: ", activeAccount?.address);

  const getEmail = async () => {
    const email = await getUserEmail({ client });
    console.log(email);
  }

  getEmail();

  const roleCheck = async () => {
    if (activeAccount?.address) {
      if (isAdmin(activeAccount?.address)) {
        setRole("admin");
      }
      else if (isCustoms(activeAccount?.address)) {
        setRole("customs");
      }
      else if (isImporter(activeAccount?.address)) {
        setRole("importer");
      }
      else if (isDistributor(activeAccount?.address)) {
        setRole("distributor");
      }
      else if (isRetailer(activeAccount?.address)) {
        setRole("retailer");
      } else {
        setRole("");
      }
    }
  }

  useEffect(() => {
    roleCheck();
  }, [role])

  console.log(activeAccount?.address)
  console.log(role)

  return (
    <BrowserRouter>
      <nav className="bg-green-400">
        <div className="container mx-auto flex justify-between items-center p-2">
          <h1 className="text-2xl font-bold text-red-500">
            <Link to='/dashboard'><img src="logo.png"></img></Link>
          </h1>
          <div>
            <ul className="flex items-baseline gap-x-4 font-semibold">
              {
                role !== "" ? (
                  <li>
                    <Link to="/dashboard" className="text-black font-semibold">
                      Dashboard
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link to="/apply" className="text-black font-semibold">
                      Apply for Registration
                    </Link>
                  </li>
                )
              }
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

        {/* dashboard */}
        {
          role === "admin" && (
            <Route path="/dashboard" element={<AdminPanel />} />
          )
        }
        {
          role === "customs" && (
            <Route path="/dashboard" element={<CustomsPanel />} />
          )
        }
        {
          role === "importer" && (
            <Route path="/dashboard" element={<ImporterPanel />} />
          )
        }
        {
          role === "distributor" && (
            <Route path="/dashboard" element={<DistributorPanel />} />
          )
        }
        {
          role === "retailer" && (
            <Route path="/dashboard" element={<RetailerPanel />} />
          )
        }
      </Routes>
    </BrowserRouter>
  );
}

export default Navbar;
