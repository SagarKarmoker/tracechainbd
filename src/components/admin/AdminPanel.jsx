import {useState} from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { adminAddr } from '../../contants';
import AddAndShowAdmin from './AddAndShowAdmin';
import AdminDashboard from './AdminDashboard';

function AdminPanel() {
  const activeAccount = useActiveAccount();
  const [activeComponent, setActiveComponent] = useState('dashboard');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'dashboard':
        return <AdminDashboard setActiveComponent={setActiveComponent} />;
      case 'admin-management':
        return <AddAndShowAdmin />;
      case 'applications':
        return <AdminApplications />
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
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'>
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