import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, Icon, useColorModeValue } from '@chakra-ui/react';
import { FiTrendingUp, FiBox, FiTruck } from 'react-icons/fi';
import { MdOutlineShoppingCart, MdHistory } from "react-icons/md";
import { LiaSearchLocationSolid } from "react-icons/lia";
import { AiOutlineProduct } from "react-icons/ai";
import { LuShip } from "react-icons/lu";
import { LuLayoutDashboard } from "react-icons/lu";
import userAuth from '../../hooks/userAuth';
import { isCustoms } from '../../components/utils/RoleCheck';
import { GoChecklist } from "react-icons/go";
import { ethers } from 'ethers';
import { TraceChainContract } from '../../contants';
import { ABI } from '../../contractABI';
import Welcome from '../../components/Welcome';
import CustomsDashboard from '../../components/customs/CustomsDashboard';
import sidebarBackgroundImage from '../../img/homeBG4.png';
import EntryHistory from '../../components/customs/EntryHistory';

// Import your components
import AddProduct from '../../components/customs/AddProduct';
import AllImporterList from '../../components/customs/AllImporterList';
import AllProductsList from '../../components/customs/AllProductsList';
import DispatchToImporter from '../../components/customs/DispatchToImporter';
import CustomsDispatchHistory from '../../components/customs/CustomsDispatchHistory';
import TrackProduct from '../../components/customs/TrackProduct';

const SidebarContent = ({ setActiveComponent, activeComponent }) => {
    const linkItems = [
        { name: 'Customs Dashboard', component: 'welcome', icon: LuLayoutDashboard },
        { name: 'Add Product', component: 'add-product', icon: FiBox },
        { name: 'Entry History', component: 'entry-history', icon: GoChecklist },
        { name: 'Importer List', component: 'importer-list', icon: LuShip },
        { name: 'All Products', component: 'products-list', icon: AiOutlineProduct },
        { name: 'Dispatch to Importer', component: 'dispatch-to-importer', icon: MdOutlineShoppingCart },
        { name: 'Dispatch History', component: 'dispatch-history', icon: MdHistory },
        { name: 'Track Product', component: 'track-product', icon: LiaSearchLocationSolid },
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
                    bg: '#7db6f9',
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

function CustomsPanel() {
    const [activeComponent, setActiveComponent] = useState('welcome');
    const { account, isConnected } = userAuth();

    const renderComponent = () => {
        switch (activeComponent) {
            case 'welcome':
                return <Welcome />;
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
            case 'entry-history':
                return <EntryHistory />;
            default:
                return <CustomsDashboard setActiveComponent={setActiveComponent} />;
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

    if (account !== '' && isConnected && !isCustoms(account)) {
        return (
            <div className='flex flex-col justify-center items-center h-[90vh]'>
                <h1 className='text-3xl font-bold text-red-500'>Access Denied</h1>
                <br />
                <p className='text-red-400'>You are not an customs</p>
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

export default CustomsPanel;
