import { Divider } from '@chakra-ui/react'
import React, { useState } from 'react'

function ReportProduct() {
    const [productId, setProductId] = useState('')


    return (
        <div>
            <div>
                <h1 className='text-4xl font-bold text-center mb-2'>Report Portal</h1>
                <p className='text-center'>Report a product to respective entity to take action</p>
            </div>
            <Divider className='m-2' />
            <div className='mt-5 flex justify-center'>
                <div className='flex flex-col gap-4'>
                    <label htmlFor="role" className='font-semibold'>Product ID</label>
                    <input type="number" className='p-2 border rounded-lg' placeholder='Enter Product Id' value={productId} onChange={(e) => setProductId(e.target.value)} />

                    {/* role selection */}
                    <label htmlFor="role" className='font-semibold'>Your role</label>
                    <select name="role" id="role" className='border p-3 rounded-lg w-[400px]'>
                        <option value="Importer">Importer</option>
                        <option value="Distributor">Distributor</option>
                        <option value="Retailer">Retailer</option>
                    </select>

                    <label htmlFor="role" className='font-semibold'>Your Comment</label>
                    <textarea name="" id=""
                        className='border p-3 rounded-lg w-[400px] h-48' placeholder='Enter your report details'></textarea>

                    <label htmlFor="role" className='font-semibold'>Proof (if Any)</label>
                    <input type="file" name="" id="" className='border p-3 rounded-lg w-[400px]' />

                    <div className='flex justify-center'>
                        <button className='bg-blue-600 p-4 text-white rounded-xl w-[300px] font-bold'>Report</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReportProduct