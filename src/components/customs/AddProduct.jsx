import React, { useState, useEffect } from 'react'
import SingleProductEntry from './SingleProductEntry';
import BoxWiseEntry from './BoxWiseEntry';
import useAuth from '../../hooks/userAuth';

function AddProduct() {
    const { account } = useAuth();
    console.log(account)
    // product entry option
    const [option, setOption] = useState('')
    const [selected, setSelected] = useState('')

    const renderComponent = () => {
        switch (option) {
            case 'single':
                return <SingleProductEntry customsAddr={account} />
            case 'box':
                return <BoxWiseEntry customsAddr={account} />
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