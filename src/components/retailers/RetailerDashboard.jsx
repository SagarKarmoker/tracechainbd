import { useState } from 'react'
import { useActiveAccount } from 'thirdweb/react'

function RetailerDashboard({ setActiveComponent }) {
    const activeAccount = useActiveAccount();

    if (activeAccount?.address == '') {
        return <>
            <div className='flex flex-col justify-center items-center h-[90vh]'>
                <h1 className='text-3xl font-bold text-red-500'>Access Denied</h1>
                <br />
                <p className='text-red-400'>Please Login</p>
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'>
                    Go back
                </button>
            </div>
        </>
    }

    return (
        <>
            <div className='px-10 py-5'>
                <h1 className='text-3xl font-bold text-black-500'>Retailer Panel</h1>
                <br />
                <div className='grid grid-cols-4 gap-4'>
                    <div className='bg-blue-500 hover:bg-blue-600 text-white p-5 rounded-lg hover:cursor-pointer'
                        onClick={() => { setActiveComponent('pending-product') }}>
                        <h1 className='text-2xl font-bold'>Pending Product</h1>
                        <p>Manage all of pending products to accept</p>
                    </div>

                    <div className='bg-blue-500 hover:bg-blue-600 text-white p-5 rounded-lg hover:cursor-pointer'
                        onClick={() => { setActiveComponent('accept-product') }}>
                        <h1 className='text-2xl font-bold'>Accept Product</h1>
                        <p>Manage all of distributor accept products </p>
                    </div>

                    <div className='bg-blue-500 hover:bg-blue-600 text-white p-5 rounded-lg hover:cursor-pointer'
                        onClick={() => { setActiveComponent('sell-product') }}>
                        <h1 className='text-2xl font-bold'>Sell Product</h1>
                        <p>Dispatch accepted product to Retailer</p>
                    </div>

                    <div className='bg-blue-500 hover:bg-blue-600 text-white p-5 rounded-lg hover:cursor-pointer'
                        onClick={() => { setActiveComponent('sold-history') }}>
                        <h1 className='text-2xl font-bold'>Sold History</h1>
                        <p>Sold product history</p>
                    </div>

                    <div className='bg-blue-500 hover:bg-blue-600 text-white p-5 rounded-lg hover:cursor-pointer'
                        onClick={() => { setActiveComponent('track-product') }}>
                        <h1 className='text-2xl font-bold'>Track Product</h1>
                        <p>Get customs to retailer step by step details</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RetailerDashboard