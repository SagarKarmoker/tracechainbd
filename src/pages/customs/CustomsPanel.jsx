import { useState, useEffect } from 'react'
import AddProduct from '../../components/customs/AddProduct'
import DispatchToImporter from '../../components/customs/DispatchToImporter'
import CustomsDispatchHistory from '../../components/customs/CustomsDispatchHistory'
import TrackProduct from '../../components/customs/TrackProduct'
import AllImporterList from '../../components/customs/AllImporterList'
import { useActiveAccount, useActiveWalletConnectionStatus } from 'thirdweb/react'
import CustomsDashboard from '../../components/customs/CustomsDashboard'
import AllProductsList from '../../components/customs/AllProductsList'

function CustomsPanel() {
    const [activeComponent, setActiveComponent] = useState('dashboard');
    const activeAccount = useActiveAccount();
    const status = useActiveWalletConnectionStatus();

    const renderComponent = () => {
        switch (activeComponent) {
            case 'dashboard':
                return <CustomsDashboard setActiveComponent={setActiveComponent} />;
            case 'add-product':
                return <AddProduct />;
            case 'importer-list':
                return <AllImporterList />;
            case 'products-list':
                return <AllProductsList />
            case 'dispatch-to-importer':
                return <DispatchToImporter />;
            case 'dispatch-history':
                return <CustomsDispatchHistory />;
            case 'track-product':
                return <TrackProduct />;
            default:
                return <CustomsDashboard />;
        }
    };

    if (status === 'disconnected') {
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

    // if(activeAccount?.address ==)

    useEffect(() => {

    }, [])

    console.log(activeAccount?.address)

    return (
        <div className='px-10 pt-5'>
            <div>
                {renderComponent()}
            </div>
        </div>
    )
}

export default CustomsPanel