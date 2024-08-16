import { useState } from 'react'
import ImporterDashboard from '../../components/importers/ImporterDashboard'
import PendingProduct from '../../components/importers/PendingProduct';
import AcceptProduct from '../../components/importers/AcceptProduct';
import AllProduct from '../../components/importers/AllProduct';
import ImporterDispatchHistory from '../../components/importers/ImporterDispatchHistory';
import TrackProduct from '../../components/importers/TrackProduct';
import DispatchToDistributor from '../../components/importers/DispatchToDistributor';
import AllDistributorList from '../../components/importers/AllDistributorList';
import userAuth from '../../hooks/userAuth';
import { isImporter } from '../../components/utils/RoleCheck';

function ImporterPanel() {
    const [activeComponent, setActiveComponent] = useState('dashboard');
    const { account, isConnected } = userAuth();

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
            case 'distributor-list':
                return <AllDistributorList />;
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

    if (account == null && !isConnected) {
        return (
            <div>
                <p>Please login first</p>
            </div>
        )
    }

    if (account != '' && isConnected && !isImporter(account)) {
        return (
            <div className="text-red-500 text-center mt-10">
                <p>Please Register for Importer Role</p>
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