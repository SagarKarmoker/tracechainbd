import React, { useEffect, useState } from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import Roles from '../pages/Roles';
import Error404 from '../pages/Error404';
import AvatarButton from './AvatarButton';
import AdminPanel from '../pages/admin/AdminPanel';
import { useActiveAccount } from 'thirdweb/react';
import { adminAddr } from '../contants';
import CustomsPanel from '../pages/customs/CustomsPanel';
import DistributorPanel from '../pages/distributor/DistributorPanel';
import RetailerPanel from '../pages/retailer/RetailerPanel';
import RegApplication from '../pages/RegApplication';
import ImporterPanel from '../pages/importer/ImporterPanel';
import { getUserEmail } from 'thirdweb/wallets/in-app';
import { client } from '../contants';
import { isAdmin, isCustoms, isImporter, isDistributor, isRetailer } from './utils/RoleCheck';
import Profile from '../pages/Profile';

function Navbar() {
  const [role, setRole] = useState('');
  const activeAccount = useActiveAccount();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmail = async () => {
      const email = await getUserEmail({ client });
      console.log('User email:', email);
    };
    fetchEmail();
  }, []);

  useEffect(() => {
    const checkRole = async () => {
      if (activeAccount?.address) {
        let userRole = '';

        if (await isAdmin(activeAccount.address)) {
          userRole = 'admin';
        }
        else if (await isCustoms(activeAccount.address)) {
          userRole = 'customs';
        }
        else if (await isImporter(activeAccount.address)) {
          userRole = 'importer';
        }
        else if (await isDistributor(activeAccount.address)) {
          userRole = 'distributor';
        }
        else if (await isRetailer(activeAccount.address)) {
          userRole = 'retailer';
        }

        setRole(userRole);
      }
    };

    checkRole();
  }, [activeAccount]);

  console.log(activeAccount?.address);
  console.log(role);

  const navigateRole = () => {
    if (role === 'admin') {
      navigate('/admin');
    }
    else if (role === 'customs') {
      navigate('/customs');
    }
    else if (role === 'importer') {
      navigate('/importer');
    }
    else if (role === 'distributor') {
      navigate('/distributor');
    }
    else if (role === 'retailer') {
      navigate('/retailer');
    }

    navigate(-1);
  };

  return (
    <>
      <nav className="bg-green-400">
        <div className="container mx-auto flex justify-between items-center p-2">
          <h1 className="text-2xl font-bold text-red-500">
            {
              role !== '' ? (
                <img src="logo.png" alt="Logo" className='hover:cursor-pointer' onClick={navigateRole} />
              ) : (
                <Link to='/'><img src="logo.png" alt="Logo" /></Link>
              )
            }
          </h1>
          <div>
            <ul className="flex items-baseline gap-x-4 font-semibold">
              {
                role !== '' ? (
                  <li>
                    <button className="text-black font-semibold" onClick={navigateRole}>
                      Dashboard
                    </button>
                  </li>
                ) : (
                  activeAccount?.address !== adminAddr && role !== 'customs' && (
                    <li>
                      <Link to="/apply" className="text-black font-semibold">
                        Apply for Registration
                      </Link>
                    </li>
                  )
                )
              }
              <li>
                <AvatarButton setRole={setRole} />
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
        <Route path="/profile" element={<Profile />} />
        <Route path="/*" element={<Error404 />} />
        <Route path="*" element={<Error404 />} />

      </Routes>
    </>
  );
}

export default Navbar;
