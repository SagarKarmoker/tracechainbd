import React from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { adminAddr } from '../contants';

function AdminPanel() {
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
      </div>
    </>  
  )
}

export default AdminPanel