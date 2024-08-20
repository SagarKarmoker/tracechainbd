import { useState } from 'react'
import TrackProduct from '../../components/retailers/TrackProduct'
import userAuth from '../../hooks/userAuth';
import { isRetailer } from '../../components/utils/RoleCheck';
import PendingProduct from '../../components/retailers/PendingProduct'
import RetailerDashboard from '../../components/retailers/RetailerDashboard'
import SellProduct from '../../components/retailers/SellProduct'
import RetailerSoldHistory from '../../components/retailers/RetailerSoldHistory'
import ReportProduct from '../../components/ReportProduct'
import AllProduct from '../../components/retailers/AllProduct';

function RetailerPanel() {
    const [activeComponent, setActiveComponent] = useState('dashboard');
    const { account, isConnected } = userAuth();

    const renderComponent = () => {
        switch (activeComponent) {
            case 'dashboard':
                return <RetailerDashboard setActiveComponent={setActiveComponent} />;
            case 'all-product':
                return <AllProduct />;
            case 'pending-product':
                return <PendingProduct />;
            case 'sell-product':
                return <SellProduct />;
            case 'sold-history':
                return <RetailerSoldHistory />;
            case 'track-product':
                return <TrackProduct />;
            case 'report-product':
                return <ReportProduct />;
            default:
                return <RetailerDashboard />;
        }
    };

    if (account == null && !isConnected) {
        return (
            <div>
                <p>Please login first</p>
            </div>
        )
    }

    if (account != '' && isConnected && !isRetailer(account)) {
        return (
            <div className="text-red-500 text-center mt-10">
                <p>Please Register for Retailer Role</p>
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

export default RetailerPanel