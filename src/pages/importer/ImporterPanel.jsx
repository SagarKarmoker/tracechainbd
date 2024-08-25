import React, { useState } from 'react';
import { Box, Flex, Text, Icon, useColorModeValue } from '@chakra-ui/react';
import { FiTrendingUp, FiHome, FiCompass, FiStar, FiSettings, FiBox } from 'react-icons/fi';
import userAuth from '../../hooks/userAuth';
import { isImporter } from '../../components/utils/RoleCheck';

// Import your components
import AcceptProduct from '../../components/importers/AcceptProduct';
import ImporterDashboard from '../../components/importers/ImporterDashboard';
import AllProduct from '../../components/importers/AllProduct';
import PendingProduct from '../../components/importers/PendingProduct';
import AllDistributorList from '../../components/importers/AllDistributorList';
import DispatchToDistributor from '../../components/importers/DispatchToDistributor';
import UpdateProductPrice from '../../components/importers/UpdateProductPrice';
import ImporterDispatchHistory from '../../components/importers/ImporterDispatchHistory';
import TrackProduct from '../../components/importers/TrackProduct';
import ReportProduct from '../../components/ReportProduct';
import sidebarBackgroundImage from '../../img/homeBG4.png';

const SidebarContent = ({ setActiveComponent, activeComponent }) => {
    const linkItems = [
        { name: 'All Product', component: 'all-product', icon: FiHome },
        { name: 'Pending Product', component: 'pending-product', icon: FiBox },
        { name: 'Manage Distributors', component: 'distributor-list', icon: FiCompass },
        { name: 'Dispatch Product', component: 'dispatch-to-distributor', icon: FiStar },
        { name: 'Dispatch History', component: 'dispatch-history', icon: FiSettings },
        { name: 'Track Product', component: 'track-product', icon: FiTrendingUp },
        { name: 'Report Product', component: 'report-product', icon: FiHome },
        { name: 'Update Price', component: 'update-price', icon: FiTrendingUp },
    ];

    return (
        <Box
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="2px"
            borderRightColor="#5160be"
            w="20%"
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
                bg={isActive ? '#5160be' : 'transparent'}
                color={isActive ? 'white' : 'inherit'}
                _hover={{
                    bg: '#5160be',
                    color: 'white',
                }}
            >
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="20"
                        color={isActive ? 'white' : 'inherit'}
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

function ImporterPanel() {
    const [activeComponent, setActiveComponent] = useState('dashboard');
    const { account, isConnected } = userAuth();

    const renderComponent = () => {
        switch (activeComponent) {
            case 'all-product':
                return <AllProduct />;
            case 'pending-product':
                return <PendingProduct />;
            case 'distributor-list':
                return <AllDistributorList />;
            case 'dispatch-to-distributor':
                return <DispatchToDistributor />;
            case 'dispatch-history':
                return <ImporterDispatchHistory />;
            case 'track-product':
                return <TrackProduct />;
            case 'report-product':
                return <ReportProduct />;
            case 'update-price':
                return <UpdateProductPrice />;
            default:
                return <ImporterDashboard setActiveComponent={setActiveComponent} />;
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

    if (account !== '' && isConnected && !isImporter(account)) {
        return (
            <div className='flex flex-col justify-center items-center h-[90vh]'>
                <h1 className='text-3xl font-bold text-red-500'>Access Denied</h1>
                <br />
                <p className='text-red-400'>You are not an importer</p>
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
                {renderComponent()}
            </Box>
        </Box>
    );
}

export default ImporterPanel;
