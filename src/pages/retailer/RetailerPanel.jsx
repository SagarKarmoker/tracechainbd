import { useState } from 'react'
import AddProduct from '../../components/customs/AddProduct'
import DispatchToImporter from '../../components/customs/DispatchToImporter'
import CustomsDispatchHistory from '../../components/customs/CustomsDispatchHistory'
import TrackProduct from '../../components/customs/TrackProduct'
import AllImporterList from '../../components/customs/AllImporterList'
import { useActiveAccount } from 'thirdweb/react'
import RetailerDashboard from '../../components/retailers/RetailerDashboard'

function RetailerPanel() {
    const [activeComponent, setActiveComponent] = useState('dashboard');
    const activeAccount = useActiveAccount();

    const renderComponent = () => {
        switch (activeComponent) {
            case 'dashboard':
                return <RetailerDashboard setActiveComponent={setActiveComponent} />;
            case 'add-product':
                return <AddProduct />;
            case 'importer-list':
                return <AllImporterList />;
            case 'dispatch-to-importer':
                return <DispatchToImporter />;
            case 'dispatch-history':
                return <CustomsDispatchHistory />;
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