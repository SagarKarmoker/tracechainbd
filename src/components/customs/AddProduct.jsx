import React, { useState, useEffect } from 'react'
import { useActiveAccount } from 'thirdweb/react';
import SingleProductEntry from './SingleProductEntry';
import BoxWiseEntry from './BoxWiseEntry';

function AddProduct() {
    const activeAccount = useActiveAccount();
    console.log(activeAccount?.address)
    // product entry option
    const [option, setOption] = useState('')
    const [selected, setSelected] = useState('')

    const renderComponent = () => {
        switch (option) {
            case 'single':
                return <SingleProductEntry customsAddr={activeAccount?.address} />
            case 'box':
                return <BoxWiseEntry customsAddr={activeAccount?.address} />
        }
    }

    return (
        <div className='px-10 py-5'>
            <h1 className='text-4xl font-semibold text-center'>Product Entry by Customs Office</h1>
            <div className='flex gap-4 mt-4 justify-center'>
                <button type="button" className='bg-orange-500 hover:bg-orange-600 p-2 rounded-lg text-white font-bold'
                    onClick={() => {
                        setSelected('single')
                        setOption('single')
                    }}
                >Product Entry</button>
                <button type="button" className='bg-orange-500 hover:bg-orange-600 p-2 rounded-lg text-white font-bold'
                    onClick={() => {
                        setSelected('box')
                        setOption('box')
                    }}>Box Entry</button>
            </div>

            <div>
                {renderComponent()}
            </div>
        </div>
    )
}

export default AddProduct