import { useState } from 'react'
import AddProduct from '../../components/customs/AddProduct'
import CustomsDispatchHistory from '../../components/customs/CustomsDispatchHistory'
import TrackProduct from '../../components/customs/TrackProduct'
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

    if (activeAccount?.address == '') {
        return (
            <div>
                <p>Please login first</p>
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