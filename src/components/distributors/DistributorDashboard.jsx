import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/userAuth';
import { isDistributor } from '../utils/RoleCheck';
import { Box, Flex, Text, Icon, useColorModeValue } from '@chakra-ui/react';
import { FiTrendingUp, FiHome, FiCompass, FiStar, FiSettings } from 'react-icons/fi';


function DistributorDashboard() {
    const { account, isConnected } = useAuth();
    const [checkDistributor, setCheckDistributor] = useState(false);
    const [activeComponent, setActiveComponent] = useState('Pending Product'); // Default component

    useEffect(() => {
        const checkIfDistributor = async () => {
            if (account) {
                const result = await isDistributor(account);
                console.log(result);
                setCheckDistributor(result);
            }
        };

        checkIfDistributor();
    }, [account]);

    if (!isConnected) {
        return (
            <div className='flex flex-col justify-center items-center h-[90vh]'>
                <h1 className='text-3xl font-bold text-red-500'>Access Denied</h1>
                <br />
                <p className='text-red-400'>Please Login</p>
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'>
                    Go back
                </button>
            </div>
        );
    }

    if (isConnected && !checkDistributor) {
        return (
            <div className='flex flex-col justify-center items-center h-[90vh]'>
                <h1 className='text-3xl font-bold text-red-500'>Access Denied</h1>
                <br />
                <p className='text-red-400'>You are not a distributor</p>
                <p className='text-red-400'>Please apply for registration</p>
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'>
                    Go back
                </button>
            </div>
        );
    }

    return (
        <Box display="flex">
            <SidebarContent setActiveComponent={setActiveComponent} />
            <Box ml="20%" p="4" flex="1">
                {/* Main Content */}
                {activeComponent === 'Pending Product' && <PendingProductPage />}
                {activeComponent === 'All Product' && <AllProductPage />}
                {activeComponent === 'Manager Retailers' && <RetailerListPage />}
                {activeComponent === 'Dispatch Product' && <DispatchProductPage />}
                {activeComponent === 'Dispatch History' && <DispatchHistoryPage />}
                {activeComponent === 'Track Product' && <TrackProductPage />}
                {activeComponent === 'Report Product' && <ReportProductPage />}
            </Box>
        </Box>
    );
}

export default DistributorDashboard;
