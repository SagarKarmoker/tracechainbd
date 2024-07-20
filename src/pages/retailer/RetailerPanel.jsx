import { useState } from 'react'
import TrackProduct from '../../components/retailers/TrackProduct'
import { useActiveAccount } from 'thirdweb/react'
import PendingProduct from '../../components/retailers/PendingProduct'
import AcceptProduct from '../../components/retailers/AcceptProduct'
import RetailerDashboard from '../../components/retailers/RetailerDashboard'
import SellProduct from '../../components/retailers/SellProduct'
import RetailerSoldHistory from '../../components/retailers/RetailerSoldHistory'
import ReportProduct from '../../components/ReportProduct'

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
            case 'report-product':
                return <ReportProduct />;
            default:
                return <RetailerDashboard />;
        }
    };

    if (activeAccount?.address == '') {
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
            <div>
                {renderComponent()}
            </div>
        </div>
    )
}

export default RetailerPanel