import { useState } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { adminAddr } from '../../contants';

function AdminDashboard({ setActiveComponent }) {
    const activeAccount = useActiveAccount();

    if (activeAccount?.address !== adminAddr) {
        return <>
            <div className='flex flex-col justify-center items-center h-[90vh]'>
                <h1 className='text-3xl font-bold text-red-500'>Access Denied</h1>
                <br />
                <p className='text-red-400'>Only admin can access this page</p>
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'>
                    Go back
                </button>
            </div>
        </>
    }

    return (
        <>
            <div className='px-10 py-5'>
                <h1 className='text-3xl font-bold text-black-500'>Admin Panel</h1>
                <br />
                <div className='grid grid-cols-3 gap-4'>
                    <div className='bg-blue-500 hover:bg-blue-600 text-white p-5 rounded-lg hover:cursor-pointer' onClick={() => { setActiveComponent('admin-management') }}>
                        <h1 className='text-2xl font-bold'>Manage Admins</h1>
                        <p>Manage admins and all details</p>
                    </div>
                    <div className='bg-blue-500 text-white p-5 rounded-lg'>
                        <h1 className='text-2xl font-bold'>Manage Users</h1>
                        <p>Manage users and their roles</p>
                    </div>
                    <div className='bg-blue-500 text-white p-5 rounded-lg'>
                        <h1 className='text-2xl font-bold'>Manage Products</h1>
                        <p>Manage products and their details</p>
                    </div>
                    <div className='bg-blue-500 text-white p-5 rounded-lg'>
                        <h1 className='text-2xl font-bold'>Manage Orders</h1>
                        <p>Manage orders and their details</p>
                    </div>
                </div>

                <div className='mt-4'>
                    <h1 className='text-3xl font-bold text-black-500'>Application Management</h1>
                    <div className='grid grid-cols-3 gap-4 mt-4'>
                        {/* all applications */}
                        <div className='bg-blue-500 hover:bg-blue-600 text-white p-5 rounded-lg hover:cursor-pointer' onClick={() => { setActiveComponent('applications') }}>
                            <h1 className='text-2xl font-bold'>Applications</h1>
                            <p>Get all applictons and details</p>
                        </div>
                        {/* Accpeted Application */}
                        <div className='bg-blue-500 hover:bg-blue-600 text-white p-5 rounded-lg hover:cursor-pointer' onClick={() => { setActiveComponent('accepted-applications') }}>
                            <h1 className='text-2xl font-bold'>Accepted Applications</h1>
                            <p>Get all accepted applictons and details</p>
                        </div>
                        {/* Denied Applications */}
                        <div className='bg-blue-500 hover:bg-blue-600 text-white p-5 rounded-lg hover:cursor-pointer' onClick={() => { setActiveComponent('denied-applications') }}>
                            <h1 className='text-2xl font-bold'>Denied Applications</h1>
                            <p>Get all denied applictons and details</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminDashboard