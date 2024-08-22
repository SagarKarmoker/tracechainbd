import React, { useEffect, useState } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import Roles from "../pages/Roles";
import Error404 from "../pages/Error404";
import AvatarButton from "./AvatarButton";
import AdminPanel from "../pages/admin/AdminPanel";
import { adminAddr } from "../contants";
import CustomsPanel from "../pages/customs/CustomsPanel";
import DistributorPanel from "../pages/distributor/DistributorPanel";
import RetailerPanel from "../pages/retailer/RetailerPanel";
import RegApplication from "../pages/RegApplication";
import ImporterPanel from "../pages/importer/ImporterPanel";
import {
  isAdmin,
  isCustoms,
  isImporter,
  isDistributor,
  isRetailer,
} from "./utils/RoleCheck";
import Profile from "../pages/Profile";
import useAuth from "../hooks/userAuth";
import { useActiveAccount } from "thirdweb/react";

function Navbar() {
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const { isConnected, account } = useAuth();
  const activeAccount = useActiveAccount();
  const [activeComponent, setActiveComponent] = useState('dashboard');

  useEffect(() => {
    const checkRole = async () => {
      if (isConnected && account !== "") {
        let userRole = "";

        if (await isAdmin(account)) {
          userRole = "admin";
        } else if (await isCustoms(account)) {
          userRole = "customs";
        } else if (await isImporter(account)) {
          userRole = "importer";
        } else if (await isDistributor(account)) {
          userRole = "distributor";
        } else if (await isRetailer(account)) {
          userRole = "retailer";
        }

        setRole(userRole);
        // navigate("/dashboard");
      }
    };

    checkRole();
  }, [account]);

  useEffect(() => {
    const checkRole = async () => {
      if (activeAccount?.address) {
        let userRole = "";
        if (await isAdmin(activeAccount?.address)) {
          userRole = "admin";
        }
        setRole(userRole);
      }
    };

    checkRole();
  }, [activeAccount?.address]);

  console.log(account);
  console.log(activeAccount?.address)
  console.log(role);

  return (
    <>
      <nav className="bg-[#f1f2f7]">
        <div className="container mx-auto flex justify-between items-center p-2">
          <h1 className="text-2xl font-bold text-red-500">
            {role !== "" ? (
              <Link to="/home">
                <img src="logo.png" alt="Logo" className="hover:cursor-pointer h-16 w-32" />
              </Link>
            ) : (
              <Link to="/home">
                <img src="logo.png" alt="Logo" className="hover:cursor-pointer h-16 w-32" />
              </Link>
            )}
          </h1>
          <div>
            <ul className="flex items-center gap-x-4 font-semibold">
              {role !== "" ? (
                <>
                  {/* <li>
                    <Link to="/dashboard" className="text-black font-semibold">
                      Dashboard
                    </Link>
                  </li> */}
                </>
              ) : (
                role != "admin" &&
                role != "customs" && (
                  <li>
                    <Link to="/apply" className="text-black font-semibold hover:text-[#5160be]">
                      Apply for Registration
                    </Link>
                  </li>
                )
              )}
              <li>
                <AvatarButton setRole={setRole} />
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Roles />} />
        {account === adminAddr && (
          <Route path="/admin" element={<AdminPanel />} />
        )}
        {/* admin routes */}
        <Route path="/admin" element={<AdminPanel />} />

        {/* customs routes */}
        <Route path="/customs" element={<CustomsPanel />} />

        {/* importer routes */}
        <Route path="/importer" element={<ImporterPanel />} />

        {/* distributor routes */}
        <Route path="/distributor" element={<DistributorPanel />} />

        {/* retailer routes */}
        <Route path="/retailer" element={<RetailerPanel />} />

        {/* common routes */}
        <Route path="/home" element={<Roles />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/apply" element={<RegApplication />} />
        <Route path="/*" element={<Error404 />} />
        <Route path="*" element={<Error404 />} />

        {role === "admin" && (
          <Route
            path="/admin"
            element={<AdminPanel fromNav={true} />}
          />
        )}
        {role === "customs" && (
          <Route path="/dashboard" element={<CustomsPanel
            setActiveComponent={setActiveComponent}
            activeComponent={activeComponent}
          />} />
        )}
        {role === "importer" && (
          <Route path="/dashboard" element={<ImporterPanel />} />
        )}
        {role === "distributor" && (
          <Route path="/dashboard" element={<DistributorPanel />} />
        )}
        {role === "retailer" && (
          <Route path="/dashboard" element={<RetailerPanel />} />
        )}
      </Routes>
    </>
  );
}

export default Navbar;
