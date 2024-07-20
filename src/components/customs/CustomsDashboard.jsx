import { useState } from 'react'
import { useActiveAccount } from 'thirdweb/react'

function CustomsDashboard({ setActiveComponent }) {
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
                <h1 className='text-3xl font-bold text-black-500'>Customs Panel</h1>
                <br />
                <div className='grid grid-cols-4 gap-4'>
                    <div className='bg-blue-500 hover:bg-blue-600 text-white p-5 rounded-lg hover:cursor-pointer'
                        onClick={() => { setActiveComponent('add-product') }}>
                        <h1 className='text-2xl font-bold'>Add and Accept Product</h1>
                        <p>Manage all of customs accept products </p>
                    </div>

                    <div className='bg-blue-500 hover:bg-blue-600 text-white p-5 rounded-lg hover:cursor-pointer'
                        onClick={() => { setActiveComponent('importer-list') }}>
                        <h1 className='text-2xl font-bold'>Manager Importer</h1>
                        <p>Manage importers and their details</p>
                    </div>

                    <div className='bg-blue-500 hover:bg-blue-600 text-white p-5 rounded-lg hover:cursor-pointer'
                        onClick={() => { setActiveComponent('dispatch-to-importer') }}>
                        <h1 className='text-2xl font-bold'>Dispatch Product</h1>
                        <p>Dispatch accepted product to Importer</p>
                    </div>

                    <div className='bg-blue-500 hover:bg-blue-600 text-white p-5 rounded-lg hover:cursor-pointer'
                        onClick={() => { setActiveComponent('dispatch-history') }}>
                        <h1 className='text-2xl font-bold'>Dispatch History</h1>
                        <p>Dispatch history of product to Importer</p>
                    </div>

                    <div className='bg-blue-500 hover:bg-blue-600 text-white p-5 rounded-lg hover:cursor-pointer'
                        onClick={() => { setActiveComponent('track-product') }}>
                        <h1 className='text-2xl font-bold'>Track Product</h1>
                        <p>Get current state of a product</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CustomsDashboard