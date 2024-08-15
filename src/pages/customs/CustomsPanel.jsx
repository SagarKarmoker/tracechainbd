import { useState, useEffect } from 'react';
import AddProduct from '../../components/customs/AddProduct';
import DispatchToImporter from '../../components/customs/DispatchToImporter';
import CustomsDispatchHistory from '../../components/customs/CustomsDispatchHistory';
import TrackProduct from '../../components/customs/TrackProduct';
import AllImporterList from '../../components/customs/AllImporterList';
import { useActiveAccount, useActiveWalletConnectionStatus } from 'thirdweb/react';
import CustomsDashboard from '../../components/customs/CustomsDashboard';
import AllProductsList from '../../components/customs/AllProductsList';
import { ethers } from 'ethers';
import { TraceChainContract } from '../../contants';
import { ABI } from '../../contractABI';
import userAuth from '../../hooks/userAuth';

function CustomsPanel() {
    const [activeComponent, setActiveComponent] = useState('dashboard');
    const [isCustoms, setIsCustoms] = useState(false);
    const { account, isConnected } = userAuth();
    const status = useActiveWalletConnectionStatus();
    const [contract, setContract] = useState(null);

    useEffect(() => {
        const provider = new ethers.providers.JsonRpcProvider("https://vercel-blockchain-proxy.vercel.app");
        const _contract = new ethers.Contract(TraceChainContract, ABI, provider);
        setContract(_contract);
    }, []);

    const checkCustoms = async () => {
        if (contract && account) {
            const data = await contract.isCustoms(account);
            setIsCustoms(data);
        }
    }

    useEffect(() => {
        checkCustoms();
        console.log(isCustoms)
    }, [account, contract]);

    const renderComponent = () => {
        switch (activeComponent) {
            case 'dashboard':
                return <CustomsDashboard setActiveComponent={setActiveComponent} />;
            case 'add-product':
                return <AddProduct />;
            case 'importer-list':
                return <AllImporterList />;
            case 'products-list':
                return <AllProductsList />;
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

    if (!isConnected) {
        return (
            <div className='flex flex-col justify-center items-center h-[90vh]'>
                <h1 className='text-3xl font-bold text-red-500'>Access Denied</h1>
                <br />
                <p className='text-red-400'>Please login to account</p>
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4' onClick={() => { window.history.back(); }}>
                    Go back
                </button>
            </div>
        );
    }
    
    if (isConnected && !isCustoms) {
        return (
            <div className='flex flex-col justify-center items-center h-[90vh]'>
                <h1 className='text-3xl font-bold text-red-500'>Access Denied</h1>
                <br />
                <p className='text-red-400'>You are not a customs officer</p>
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4' onClick={() => { window.history.back(); }}>
                    Go back
                </button>
            </div>
        );
    }

    return (
        <div className='px-10 pt-5'>
            <div>
                {renderComponent()}
            </div>
        </div>
    );
}

export default CustomsPanel;
