import { useState } from 'react'
import TrackProduct from '../../components/distributors/TrackProduct'
import { useActiveAccount } from 'thirdweb/react'
import DistributorDashboard from '../../components/distributors/DistributorDashboard'
import AllRetailerList from '../../components/distributors/AllRetailerList'
import DispatchToRetailer from '../../components/distributors/DispatchToRetailer'
import PendingProduct from '../../components/distributors/PendingProduct'
import AcceptProduct from '../../components/distributors/AcceptProduct'
import DistributorDispatchHistory from '../../components/distributors/DistributorDispatchHistory'

function DistributorPanel() {
    const [activeComponent, setActiveComponent] = useState('dashboard');
    const activeAccount = useActiveAccount();

    const renderComponent = () => {
        switch (activeComponent) {
            case 'dashboard':
                return <DistributorDashboard setActiveComponent={setActiveComponent} />;
            case 'accept-product':
                return <AcceptProduct />;
            case 'pending-product':
                return <PendingProduct />;
            case 'retailer-list':
                return <AllRetailerList />;
            case 'dispatch-to-retailer':
                return <DispatchToRetailer />;
            case 'dispatch-history':
                return <DistributorDispatchHistory />;
            case 'track-product':
                return <TrackProduct />;
            default:
                return <DistributorDashboard />;
        }
    };

    if (activeAccount?.address !== '') {
        return (
            <div className='flex flex-col justify-center items-center h-[90vh]'>
                <h1 className='text-3xl font-bold text-red-500'>Access Denied</h1>
                <br />
                <p className='text-red-400'>Please login to account</p>
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4' onClick={() => { window.history.back(); }}>
                    Go back
                </button>
            </div>
        )
    }

    return (
        <div className='px-10 pt-5'>
            {/* customs dashboard */}
            {/* <AddProduct /> */}
            {/* <DispatchToImporter /> */}
            {/* <CustomsDispatchHistory /> */}
            {/* <TrackProduct /> */}
            {/* <AllImporterList /> */}

            <div>
                {renderComponent()}
            </div>
        </div>
    )
}

export default DistributorPanel