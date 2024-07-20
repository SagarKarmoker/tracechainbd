import React, { useState, useEffect } from 'react'
import { useActiveAccount } from 'thirdweb/react';

function AddProduct() {
    const activeAccount = useActiveAccount();
    
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [countryOfOrigin, setCountryOfOrigin] = useState('');
    const [manufacturer, setManufacturer] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    // const [importedDate, setImportedDate] = useState('')
    const [importerAddr, setImporterAddr] = useState('');
    const [customsAddr, setCustomsAddr] = useState('');

    // useEffect(() => {
    //     if(activeAccount.address != ''){
    //         setCustomsAddr(activeAccount.address);
    //     }
    // }, [activeAccount])

    return (
        <>
            <div className='flex justify-center'>
                <div className='flex flex-col gap-4'>
                    <h1 className='text-4xl font-bold mb-5'>Accept Product by Customs</h1>
                    <input type="text" className='p-2 border rounded-lg' placeholder='Enter Product Id' value={id} onChange={(e) => setId(e.target.value)} />
                    <input type="text" className='p-2 border rounded-lg' placeholder='Enter Product Name' value={name} onChange={(e) => setName(e.target.value)} />
                    <input type="text" className='p-2 border rounded-lg' placeholder='Enter Product Details' value={description} onChange={(e) => setDescription(e.target.value)} />
                    <input type="text" className='p-2 border rounded-lg' placeholder='Enter Product Category' value={category} onChange={(e) => setCategory(e.target.value)} />
                    <input type="text" className='p-2 border rounded-lg' placeholder='Enter Product Country of Origin' value={countryOfOrigin} onChange={(e) => setCountryOfOrigin(e.target.value)} />
                    <input type="text" className='p-2 border rounded-lg' placeholder='Enter Product Manufacturer' value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} />
                    <input type="number" className='p-2 border rounded-lg' placeholder='Enter Product Price' value={price} onChange={(e) => setPrice(e.target.value)} />
                    <input type="number" className='p-2 border rounded-lg' placeholder='Enter Product Quantity' value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                    {/* <input type="datetime-local" className='p-2 border rounded-lg' placeholder='Enter Product Import Date' value={importedDate} onChange={(e) => setImportedDate(e.target.value)} /> */}
                    <input type="text" className='p-2 border rounded-lg' placeholder='Enter Importer Address' value={importerAddr} onChange={(e) => setImporterAddr(e.target.value)} />
                    <input type="text" className='p-2 border rounded-lg' placeholder='Enter Customs Address' value={customsAddr} readOnly />

                    <div className='flex justify-center'>
                        <button className='bg-blue-600 p-4 text-white rounded-xl w-[300px] font-bold'>Add Product to Ledger</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddProduct