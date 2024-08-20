import { useState, useEffect } from 'react'
import useAuth from '../../hooks/userAuth';
import { isDistributor } from '../utils/RoleCheck';

function DistributorDashboard({ setActiveComponent }) {
    const { account, isConnected } = useAuth();
    const [checkDistributor, setCheckDistributor] = useState(false);

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
                <p className='text-red-400'>You are not an distributor</p>
                <p className='text-red-400'>Please apply for registation</p>
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'>
                    Go back
                </button>
            </div>
        );
    }

    return (
        <>
            <div className='px-10 py-5'>
                <h1 className='text-3xl font-bold text-black-500'>Distributor Panel</h1>
                <br />
                <div className='grid grid-cols-4 gap-4'>
                    <div className='bg-blue-500 hover:bg-blue-600 text-white p-5 rounded-lg hover:cursor-pointer'
                        onClick={() => { setActiveComponent('pending-product') }}>
                        <h1 className='text-2xl font-bold'>Pending Product</h1>
                        <p>Manage all of pending products to accept</p>
                    </div>

                    <div className='bg-blue-500 hover:bg-blue-600 text-white p-5 rounded-lg hover:cursor-pointer'
                        onClick={() => { setActiveComponent('all-product') }}>
                        <h1 className='text-2xl font-bold'>All Product</h1>
                        <p>Manage all of distributor accepted products </p>
                    </div>

                    <div className='bg-blue-500 hover:bg-blue-600 text-white p-5 rounded-lg hover:cursor-pointer'
                        onClick={() => { setActiveComponent('retailer-list') }}>
                        <h1 className='text-2xl font-bold'>Manager Retailers</h1>
                        <p>Manage retailers and their details</p>
                    </div>

                    <div className='bg-blue-500 hover:bg-blue-600 text-white p-5 rounded-lg hover:cursor-pointer'
                        onClick={() => { setActiveComponent('dispatch-to-retailer') }}>
                        <h1 className='text-2xl font-bold'>Dispatch Product</h1>
                        <p>Dispatch accepted product to Retailer</p>
                    </div>

                    <div className='bg-blue-500 hover:bg-blue-600 text-white p-5 rounded-lg hover:cursor-pointer'
                        onClick={() => { setActiveComponent('dispatch-history') }}>
                        <h1 className='text-2xl font-bold'>Dispatch History</h1>
                        <p>Dispatch history of product to retailer</p>
                    </div>

                    <div className='bg-blue-500 hover:bg-blue-600 text-white p-5 rounded-lg hover:cursor-pointer'
                        onClick={() => { setActiveComponent('track-product') }}>
                        <h1 className='text-2xl font-bold'>Track Product</h1>
                        <p>Get current state of a product</p>
                    </div>

                    <div className='bg-blue-500 hover:bg-blue-600 text-white p-5 rounded-lg hover:cursor-pointer'
                        onClick={() => { setActiveComponent('report-product') }}>
                        <h1 className='text-2xl font-bold'>Report Product</h1>
                        <p>Report any product to Govt./Respective Entity</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DistributorDashboard