import { useState } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import ImporterDashboard from '../../components/importers/ImporterDashboard'
import PendingProduct from '../../components/importers/PendingProduct';
import AcceptProduct from '../../components/importers/AcceptProduct';

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
            // case 'dispatch-to-importer':
            //     return <DispatchToImporter />;
            // case 'dispatch-history':
            //     return <CustomsDispatchHistory />;
            // case 'track-product':
            //     return <TrackProduct />;
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

export default ImporterPanel