import React, { useState } from 'react'


// single component for reg
function RegApplication() {
    const [compName, setCompName] = useState('');
    const [locAddress, setLocAddress] = useState('');
    const [contractNumber, setContractNumber] = useState('')
    const [countryOfOrigin, setCountryOfOrigin] = useState('')
    const [tinNumber, setTinNumber] = useState('')
    const [vatRegNumber, setVatRegNumber] = useState('')
    const [ipfsDocHash, setIpfsDocHash] = useState('') // upload files as folder structer
    // detect the role using url param 
    const [role, setRole] = useState('')

    const handleSubmit = () => {
        console.log(role)
    }
 
    return (
        <>
            <div className='px-10 pt-5'>
                <h1 className='font-semibold text-4xl text-center mb-4'>Registation Application</h1>
                <div className='flex justify-center'>
                    <div className='flex flex-col gap-4 w-fit'>
                        <label htmlFor="name">
                            <input type="text" placeholder='Enter name of company' className='border p-3 rounded-lg w-full'
                                value={compName} onChange={(e) => setCompName(e.target.value)} />
                        </label>
                        <label htmlFor="location">
                            <input type="text" placeholder='Enter location/addreass of company' className='border p-3 rounded-lg w-full'
                                value={locAddress} onChange={(e) => setLocAddress(e.target.value)} />
                        </label>
                        <label htmlFor="contact">
                            <input type="text" placeholder='Enter contact number company' className='border p-3 rounded-lg w-full'
                                value={contractNumber} onChange={(e) => setContractNumber(e.target.value)} />
                        </label>
                        <label htmlFor="origin">
                            <input type="text" placeholder='Enter country Of Origin of the company' className='border p-3 rounded-lg w-full'
                                value={countryOfOrigin} onChange={(e) => setCountryOfOrigin(e.target.value)} />
                        </label>
                        <label htmlFor="tinnumber">
                            <input type="text" placeholder='Enter TIN number of the company' className='border p-3 rounded-lg w-full'
                                value={tinNumber} onChange={(e) => setTinNumber(e.target.value)} />
                        </label>
                        <label htmlFor="vatregnumber">
                            <input type="text" placeholder='Enter VAT Reg number of the company' className='border p-3 rounded-lg w-full'
                                value={vatRegNumber} onChange={(e) => setVatRegNumber(e.target.value)} />
                        </label>

                        {/* upload files */}
                        <label htmlFor="tin">
                            <input type="file" className='border p-3 rounded-lg w-full' />
                        </label>
                        <label htmlFor="vat">
                            <input type="file" className='border p-3 rounded-lg w-full' />
                        </label>
                        <label htmlFor="tradelic">
                            <input type="file" className='border p-3 rounded-lg w-full' />
                        </label>

                        {/* role selection */}
                        <select name="role" id="role" className='border p-3 rounded-lg w-[400px]'>
                            <option value="Importer">Importer</option>
                            <option value="Distributor">Distributor</option>
                            <option value="Retailer">Retailer</option>
                        </select>
 
                        <div className='flex justify-center'>
                            <button className='bg-blue-600 text-white w-[200px] p-4 rounded-xl font-bold' onClick={handleSubmit}>Submit Application</button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default RegApplication