import React, { useState, useEffect } from 'react'
import SingleProductEntry from './SingleProductEntry';
import BoxWiseEntry from './BoxWiseEntry';
import useAuth from '../../hooks/userAuth';
import { Divider, IconButton, Button } from '@chakra-ui/react';
import { ArrowLeftIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import backgroundImage from "../../img/homeBG3.png";


function AddProduct() {
    const { account } = useAuth();
    console.log(account)
    // product entry option
    const [option, setOption] = useState('')
    const [selected, setSelected] = useState('')
    const navigate = useNavigate(); // Initialize useNavigate

    // const renderComponent = () => {
    //     switch (option) {
    //         case 'single':
    //             return <SingleProductEntry customsAddr={account} />
    //         case 'box':
    //             return <BoxWiseEntry customsAddr={account} />
    //     }
    // }
    const goBack = () => {
        window.history.back();
    };

    return (
        <div className='px-10 py-5 w-full min-h-screen bg-cover bg-center flex flex-col' style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className='px-10 py-5'>
                <div className='flex justify-between'>
                    <IconButton icon={<ArrowLeftIcon />} onClick={() => navigate(0)} /> {/* Add onClick handler */}
                    <h1 className='text-center font-bold text-4xl'>Product Entry by Customs Officer</h1>
                    <p></p>
                </div>
                <IconButton
                aria-label="Go back"
                icon={<ArrowLeftIcon />}
                onClick={goBack}
                colorScheme="teal"
                alignSelf="flex-start"  // Aligns the back button to the top left
                m={4}
            />

                <div className='flex gap-4 mt-4 justify-center'>
                    {/* <button type="button" className='bg-orange-500 hover:bg-orange-600 p-2 rounded-lg text-white font-bold'
                    onClick={() => {
                        setSelected('single')
                        setOption('single')
                    }}
                >Product Entry</button> */}
                    {/* <button type="button" className='bg-orange-500 hover:bg-orange-600 p-2 rounded-lg text-white font-bold'
                    onClick={() => {
                        setSelected('box')
                        setOption('box')
                    }}>Box Entry</button> */}
                </div>

                <div>
                    {/* {renderComponent()} */}
                    <SingleProductEntry customsAddr={account} />
                </div>
            </div>
        </div>
    )
}

export default AddProduct