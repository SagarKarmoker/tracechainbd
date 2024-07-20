import React from 'react'
import { Divider } from '@chakra-ui/react'

function PendingProduct() {
  return (
    <>
      <div>
        <div className='flex flex-col justify-center mb-4'>
          <h1 className='text-4xl text-center font-bold mb-2'>Pending Product</h1>
          <p className='text-center'>List of all pending product to accept</p>
        </div>
        <Divider />
        <div className='mt-4'>
          show table to accept the pending products 
        </div>
      </div>
    </>
  )
}

export default PendingProduct