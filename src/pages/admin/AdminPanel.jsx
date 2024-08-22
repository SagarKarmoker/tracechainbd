import { useEffect, useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import AddAndShowAdmin from '../../components/admin/AddAndShowAdmin';
import AdminDashboard from '../../components/admin/AdminDashboard';
import AdminApplications from '../../components/admin/AdminApplications';
import AcceptedApplications from '../../components/admin/AcceptedApplications';
import DeniedApplications from '../../components/admin/DeniedApplications';
import AllProducts from '../../components/admin/AllProducts';
import { etherContract } from '../../contants';
import { Spinner, Center, Text, Box } from '@chakra-ui/react';

function AdminPanel() {
  const activeAccount = useActiveAccount();
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [adminList, setAdminList] = useState([]);
  const [loading, setLoading] = useState(true);  // Add loading state

  const renderComponent = () => {
    switch (activeComponent) {
      case 'dashboard':
        return <AdminDashboard setActiveComponent={setActiveComponent} />;
      case 'admin-management':
        return <AddAndShowAdmin isAdmin={true} />;
      case 'customs-management':
        return <AddAndShowAdmin isAdmin={false} />;
      case 'others-management':
        return <AcceptedApplications />;
      case 'applications':
        return <AdminApplications />;
      case 'accepted-applications':
        return <AcceptedApplications />;
      case 'denied-applications':
        return <DeniedApplications />;
      case 'all-products':
        return <AllProducts />;
      case 'report-applications':
        return <DeniedApplications />;
      case 'accepted-report-applications':
        return <DeniedApplications />;
      case 'denied-report-applications':
        return <DeniedApplications />;
      default:
        return <AdminDashboard setActiveComponent={setActiveComponent} />;
    }
  };

  useEffect(() => {
    const fetchAdminList = async () => {
      const _adminList = await etherContract.getAllAdmins();
      setAdminList(_adminList);
      setLoading(false);  // Set loading to false when data is fetched

      // setTimeout(() => {
      //   setLoading(false);
      // }, 10000); 
    }

    fetchAdminList();
  }, []);

  useEffect(() => {
    setActiveComponent('dashboard');
  }, []);

  if (loading) {
    return (
      <Center height="100vh">
        <Box textAlign="center">
          <Spinner size="xl" color="blue.500" />
          <Text mt={4} fontSize="xl" fontWeight="bold">Please wait while we prepare your dashboard. This won't take long.</Text>
        </Box>
      </Center>
    );
  }

  if (!adminList.includes(activeAccount?.address)) {
    return (
      <div className='flex flex-col justify-center items-center h-[90vh]'>
        <h1 className='text-3xl font-bold text-red-500'>Access Denied</h1>
        <br />
        <p className='text-red-400'>Only admin can access this page</p>
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4' onClick={() => { window.history.back(); }}>
          Go back
        </button>
      </div>
    );
  }

  return (
    <>
      {renderComponent()}
    </>
  );
}

export default AdminPanel;
