import { Divider } from '@chakra-ui/react'
import React from 'react'

function AllProductsList() {
    return (
        <div className='px-10 pt-5'>
            <div>
                <h1 className='text-4xl font-bold text-center'>All Products List</h1>
                <p className='font-semibold text-center'>accepted by Customs</p>
            </div>

            <Divider className='my-4' />
        </div>
    )
}

export default AllProductsList