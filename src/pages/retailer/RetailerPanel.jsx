import { useState } from 'react'
import TrackProduct from '../../components/retailers/TrackProduct'
import { useActiveAccount } from 'thirdweb/react'
import PendingProduct from '../../components/retailers/PendingProduct'
import AcceptProduct from '../../components/retailers/AcceptProduct'
import RetailerDashboard from '../../components/retailers/RetailerDashboard'
import SellProduct from '../../components/retailers/SellProduct'
import RetailerSoldHistory from '../../components/retailers/RetailerSoldHistory'

function RetailerPanel() {
    const [activeComponent, setActiveComponent] = useState('dashboard');
    const activeAccount = useActiveAccount();

    const renderComponent = () => {
        switch (activeComponent) {
            case 'dashboard':
                return <RetailerDashboard setActiveComponent={setActiveComponent} />;
            case 'accept-product':
                return <AcceptProduct />;
            case 'pending-product':
                return <PendingProduct />;
            case 'sell-product':
                return <SellProduct />;
            case 'sold-history':
                return <RetailerSoldHistory />;
            case 'track-product':
                return <TrackProduct />;
            default:
                return <RetailerDashboard />;
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
            <div>
                {renderComponent()}
            </div>
        </div>
    )
}

export default RetailerPanel