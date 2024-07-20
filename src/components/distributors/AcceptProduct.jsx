import React, { useState } from 'react'
import { useActiveAccount } from 'thirdweb/react';

function AcceptProduct() {
    const activeAccount = useActiveAccount();
    const [id, setId] = useState('');

    return (
        <>
            <div className='flex justify-center'>
                <div className='flex flex-col gap-4'>
                    <h1 className='text-4xl font-bold mb-5'>Accept Product by Distributor</h1>
                    <input type="text" className='p-2 border rounded-lg' placeholder='Enter Product Id' value={id} onChange={(e) => setId(e.target.value)} />

                    <div className='flex justify-center'>
                        <button className='bg-blue-600 p-4 text-white rounded-xl w-[300px] font-bold'>Add Product to Ledger</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AcceptProduct