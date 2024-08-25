import React, { useState } from 'react';
import { Box, Flex, Text, Icon, useColorModeValue } from '@chakra-ui/react';
import { FiTrendingUp, FiHome, FiCompass, FiStar, FiSettings, FiBox } from 'react-icons/fi';
import useAuth from '../../hooks/userAuth';
import { isDistributor } from '../../components/utils/RoleCheck';

// Import your components
import TrackProduct from '../../components/distributors/TrackProduct';
import DistributorDashboard from '../../components/distributors/DistributorDashboard';
import AllRetailerList from '../../components/distributors/AllRetailerList';
import DispatchToRetailer from '../../components/distributors/DispatchToRetailer';
import PendingProduct from '../../components/distributors/PendingProduct';
import DistributorDispatchHistory from '../../components/distributors/DistributorDispatchHistory';
import ReportProduct from '../../components/ReportProduct';
import AllProduct from '../../components/distributors/AllProduct';
import sidebarBackgroundImage from '../../img/homeBG4.png'; 
import ReportHistory from '../../components/ReportHistory';

const SidebarContent = ({ setActiveComponent, activeComponent }) => {
    const linkItems = [
        { name: 'Pending Product', component: 'pending-product', icon: FiBox },
        { name: 'All Product', component: 'all-product', icon: FiHome },
        { name: 'Manager Retailers', component: 'retailer-list', icon: FiCompass },
        { name: 'Dispatch Product', component: 'dispatch-to-retailer', icon: FiStar },
        { name: 'Dispatch History', component: 'dispatch-history', icon: FiSettings },
        { name: 'Track Product', component: 'track-product', icon: FiTrendingUp },
        { name: 'Report Product', component: 'report-product', icon: FiHome },
        { name: 'Report History', component: 'report-history', icon: FiHome },
    ];

    return (
        <Box
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="2px"
            borderRightColor="#5160be"
            w="20%" // Updated width to 20%
            pos="fixed"
            h="full"
            p="4"
            backgroundImage={`url(${sidebarBackgroundImage})`}
            backgroundSize="cover"
            backgroundPosition="left"
            boxShadow="0 4px 6px rgba(0, 0, 0, 0.5)" // Add box shadow here
        >
            <Box mt="4">
                {linkItems.map((link) => (
                    <NavItem
                        key={link.name}
                        icon={link.icon}
                        isActive={activeComponent === link.component}
                        onClick={() => setActiveComponent(link.component)}
                    >
                        {link.name}
                    </NavItem>
                ))}
            </Box>
        </Box>
    );
};


const NavItem = ({ icon, children, onClick, isActive }) => {
    return (
        <Box
            as="a"
            href="#"
            style={{ textDecoration: 'none' }}
            _focus={{ boxShadow: 'none' }}
            onClick={onClick}
        >
            <Flex
                align="center"
                p="3"
                mt="2"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                bg={isActive ? '#5160be' : 'transparent'} // Background color for active state
                color={isActive ? 'white' : 'inherit'} // Text color for active state
                _hover={{
                    bg: '#5160be',
                    color: 'white',
                }}
            >
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="20" // Adjusted for better visibility
                        color={isActive ? 'white' : 'inherit'} // Icon color for active state
                        _groupHover={{
                            color: 'white',
                        }}
                        as={icon}
                    />
                )}
                <Text ml="2" fontWeight="medium" textAlign="left">
                    {children}
                </Text>
            </Flex>
        </Box>
    );
};

function DistributorPanel() {
    const [activeComponent, setActiveComponent] = useState('pending-product');
    const { account, isConnected } = useAuth();

    const renderComponent = () => {
        switch (activeComponent) {
            case 'all-product':
                return <AllProduct />;
            case 'pending-product':
                return <PendingProduct />;
            case 'retailer-list':
                return <AllRetailerList />;
            case 'dispatch-to-retailer':
                return <DispatchToRetailer />;
            case 'dispatch-history':
                return <DistributorDispatchHistory />;
            case 'track-product':
                return <TrackProduct />;
            case 'report-product':
                return <ReportProduct />;
            case 'report-history':
                return <ReportHistory />;
            default:
                return <DistributorDashboard setActiveComponent={setActiveComponent} />;
        }
    };
    
    if (account == null && !isConnected) {
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

    if (account !== '' && isConnected && !isDistributor(account)) {
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
            <SidebarContent setActiveComponent={setActiveComponent} activeComponent={activeComponent} />
            <Box ml="20%" flex="1"> {/* Updated margin-left to 20% */}
                {/* Main Content */}
                {renderComponent()}
            </Box>
        </Box>
    );
}

export default DistributorPanel;
