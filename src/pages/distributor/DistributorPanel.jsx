import { useState } from 'react'
import TrackProduct from '../../components/distributors/TrackProduct'
import useAuth from '../../hooks/userAuth'
import DistributorDashboard from '../../components/distributors/DistributorDashboard'
import AllRetailerList from '../../components/distributors/AllRetailerList'
import DispatchToRetailer from '../../components/distributors/DispatchToRetailer'
import PendingProduct from '../../components/distributors/PendingProduct'
import AcceptProduct from '../../components/distributors/AcceptProduct'
import DistributorDispatchHistory from '../../components/distributors/DistributorDispatchHistory'
import ReportProduct from '../../components/ReportProduct'
import { isDistributor } from '../../components/utils/RoleCheck';

function DistributorPanel() {
    const [activeComponent, setActiveComponent] = useState('dashboard');
    const { account, isConnected } = useAuth();

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
            case 'report-product':
                return <ReportProduct />;
            default:
                return <DistributorDashboard />;
        }
    };

    if (account == null && !isConnected) {
        return (
            <div>
                <p>Please login first</p>
            </div>
        )
    }

    if (account != '' && isConnected && !isDistributor(account)) {
        return (
            <div className="text-red-500 text-center mt-10">
                <p>Please Register for Distributor Role</p>
            </div>
        )
    }

    return (
        <div className='px-10 pt-5'>
            <div>
                {renderComponent()}
            </div>
        </div>
    )
}

export default DistributorPanel