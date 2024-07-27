import { useState } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import ImporterDashboard from '../../components/importers/ImporterDashboard'
import PendingProduct from '../../components/importers/PendingProduct';
import AcceptProduct from '../../components/importers/AcceptProduct';
import AllProduct from '../../components/importers/AllProduct';
import ImporterDispatchHistory from '../../components/importers/ImporterDispatchHistory';
import TrackProduct from '../../components/importers/TrackProduct';
import DispatchToDistributor from '../../components/importers/DispatchToDistributor';

function ImporterPanel() {
    const [activeComponent, setActiveComponent] = useState('dashboard');
    const activeAccount = useActiveAccount();

    const renderComponent = () => {
        switch (activeComponent) {
            case 'dashboard':
                return <ImporterDashboard setActiveComponent={setActiveComponent} />;
            case 'pending-product':
                return <PendingProduct />;
            case 'accept-product':
                return <AcceptProduct />;
            case 'all-product':
                return <AllProduct />;
            case 'dispatch-to-distributor':
                return <DispatchToDistributor />;
            case 'dispatch-history':
                return <ImporterDispatchHistory />;
            case 'track-product':
                return <TrackProduct />;
            default:
                return <ImporterDashboard />;
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

export default ImporterPanel