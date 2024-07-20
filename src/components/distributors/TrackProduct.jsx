import React, {useState} from 'react'

function TrackProduct() {
    const [productId, setProductId] = useState("")

    const handleTrackBtn = () => {
        // get data from blockchain
    }

    return (
        <>
            <div className='flex flex-col gap-4'>
                <h1 className='text-center text-4xl font-bold mb-4'>Track Product by Distributor</h1>
                <div className='flex justify-center'>
                    <div className='flex flex-col gap-4 w-96'>
                        <input type="number" className='p-3 border rounded-lg' placeholder='Enter product ID to get details' value={productId} onChange={(e) => setProductId(e.target.value)} required />

                        <button onClick={handleTrackBtn} className='bg-blue-600 p-3 text-white font-bold rounded-xl'>Track Product</button>
                    </div>
                </div>

                <div className='flex flex-col justify-center gap-4'>
                    <p className='font-semibold text-center'>Get the step by step track of a product </p>
                    <div>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi consectetur voluptatibus ipsam optio, consequuntur provident odit iste voluptates quibusdam iusto nemo maiores laudantium id? Beatae praesentium recusandae facere libero alias?
                    </div>
                </div>
            </div>
        </>
    )
}

export default TrackProduct