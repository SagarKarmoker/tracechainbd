import { useState } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { adminAddr } from '../../contants';
import AddAndShowAdmin from '../../components/admin/AddAndShowAdmin';
import AdminDashboard from '../../components/admin/AdminDashboard';
import AdminApplications from '../../components/admin/AdminApplications'
import AcceptedApplications from '../../components/admin/AcceptedApplications';
import DeniedApplications from '../../components/admin/DeniedApplications';

function AdminPanel() {
  const activeAccount = useActiveAccount();
  const [activeComponent, setActiveComponent] = useState('dashboard');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'dashboard':
        return <AdminDashboard setActiveComponent={setActiveComponent} />;
      case 'admin-management':
        return <AddAndShowAdmin isAdmin={true} />;
      case 'customs-management':
        return <AddAndShowAdmin isAdmin={false} />;
      case 'applications':
        return <AdminApplications />
      case 'accepted-applications':
        return <AcceptedApplications />
      case 'denied-applications':
        return <DeniedApplications />
      // report management
      case 'report-applications':
        return <DeniedApplications />
      case 'accepted-report-applications':
        return <DeniedApplications />
      case 'denied-report-applications':
        return <DeniedApplications />
      default:
        return <AdminDashboard />;
    }
  };

  if (activeAccount?.address !== adminAddr) {
    return <>
      <div className='flex flex-col justify-center items-center h-[90vh]'>
        <h1 className='text-3xl font-bold text-red-500'>Access Denied</h1>
        <br />
        <p className='text-red-400'>Only admin can access this page</p>
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4' onClick={() => { window.history.back(); }}>
          Go back
        </button>
      </div>
    </>
  }

  return (
    <>
      {renderComponent()}
    </>
  )
}

export default AdminPanel