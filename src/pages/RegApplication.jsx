import React, { useState } from 'react'
import { create } from 'ipfs-http-client'
import { useActiveAccount } from 'thirdweb/react';
import { useToast } from '@chakra-ui/react';
import { prepareContractCall } from "thirdweb"
import { useSendTransaction  } from "thirdweb/react";
import { contract } from '../chain';

// ipfs desktop: http://127.0.0.1:5001/api/v0/add
const ipfs = create({ url: "http://127.0.0.1:5001/api/v0/add" }); //http://127.0.0.1:5001

// single component for reg
function RegApplication() {
    const toast = useToast();
    const [compName, setCompName] = useState('');
    const [locAddress, setLocAddress] = useState('');
    const [contractNumber, setContractNumber] = useState('')
    const [countryOfOrigin, setCountryOfOrigin] = useState('')
    const [tinNumber, setTinNumber] = useState('')
    const [vatRegNumber, setVatRegNumber] = useState('')
    const [ipfsDocHash, setIpfsDocHash] = useState('') // upload files as folder structer
    // detect the role using url param 
    const [role, setRole] = useState('')
    const activeAccount = useActiveAccount();

    // const { mutate: sendAndConfirmTx, data: transactionReceipt } = useSendAndConfirmTransaction ();
    const { mutate: sendTx, data: transactionResult } = useSendTransaction();

    // ipfs
    const [tin, setTin] = useState(null);
    const [tradeLic, setTradeLic] = useState(null);
    const [vat, setVat] = useState(null);

    const handleFileChange = (e, setFile) => {
        const file = e.target.files[0];
        if (file) {
            setFile(URL.createObjectURL(file));
        }
    };

    async function uploadFilesAsDirectory(files) {
        try {
            if (activeAccount?.address === '') {
                console.log("No active account found");
                return;
            }

            const directoryName = `doc-${activeAccount?.address}`;
            const filesToAdd = files.map((file, index) => {
                return {
                    path: `${directoryName}/doc${index + 1}.jpg`,
                    content: file,
                };
            });

            const addedFiles = [];
            for await (const result of ipfs.addAll(filesToAdd, {
                wrapWithDirectory: true,
            })) {
                addedFiles.push(result);
            }

            const directory = addedFiles[addedFiles.length - 1];
            if (directory.cid) {
                setIpfsDocHash(directory.cid.toString());
                toast({
                    title: "Success",
                    description: "Images uploaded to IPFS successfully.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                })
                console.log(directory.cid.toString());
                console.log(`http://127.0.0.1:8080/ipfs/${directory.cid}`);
            }
            else {
                toast({
                    title: "Error",
                    description: "Error uploading images to IPFS.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                })
            }
        } catch (error) {
            console.error("Error uploading directory to IPFS:", error);
            return null;
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!tin || !tradeLic || !vat) {
            toast({
                title: "Error",
                description: "Please upload all required documents.",
                status: "error",
                duration: 5000,
                isClosable: true,
            })
            return;
        }

        const tinDoc = await fetch(tin).then((r) => r.blob());
        const tradeDoc = await fetch(tradeLic).then((r) => r.blob());
        const vatDoc = await fetch(vat).then((r) => r.blob());

        await uploadFilesAsDirectory([tinDoc, tradeDoc, vatDoc]);

        // smart contract interaction
        if (compName === '' || locAddress === '' || contractNumber === '' || countryOfOrigin === '' || tinNumber === '' || vatRegNumber === '' || ipfsDocHash === '' || role === '') {
            toast({
                title: "Error",
                description: "Please fill all fields.",
                status: "error",
                duration: 5000,
                isClosable: true,
            })
            return;
        }
        console.log(role)

        try {
            const transaction = await prepareContractCall({
                contract,
                method: "function regForRole(string _name, string _locAddress, string _contractNumber, string _countryOfOrigin, string _tinNumber, string _vatRegNumber, string _ipfsDocHash, string _role)",
                params: [compName, locAddress, contractNumber, countryOfOrigin, tinNumber, vatRegNumber, ipfsDocHash, role]
            });
    
            await sendTx(transaction);
    
            setCompName('');
            setLocAddress('');
            setContractNumber('');
            setCountryOfOrigin('');
            setTinNumber('');
            setVatRegNumber('');
            setIpfsDocHash('');
            setRole('');
            
            // if (transactionResult != undefined) {
            //     toast({
            //         title: "Success",
            //         description: "Registration application submitted successfully.",
            //         status: "success",
            //         duration: 5000,
            //         isClosable: true,
            //     })
            // } else {
            //     toast({
            //         title: "Error",
            //         description: "Error submitting registration application.",
            //         status: "error",
            //         duration: 5000,
            //         isClosable: true,
            //     })
            // }
        } catch (error) {
            console.log(error)
        }
    }

    if(activeAccount?.address === undefined) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <h1 className='text-4xl font-semibold'>Please connect your wallet to continue</h1>
            </div>
        )
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
                            <input type="file" className='border p-3 rounded-lg w-full' onChange={(e) => handleFileChange(e, setTin)} />
                        </label>
                        <label htmlFor="vat">
                            <input type="file" className='border p-3 rounded-lg w-full' onChange={(e) => handleFileChange(e, setTradeLic)} />
                        </label>
                        <label htmlFor="tradelic">
                            <input type="file" className='border p-3 rounded-lg w-full' onChange={(e) => handleFileChange(e, setVat)} />
                        </label>

                        {/* role selection */}
                        <select name="role" id="role" className='border p-3 rounded-lg w-[400px]'
                            value={role} onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="">Select a role</option>
                            <option value="IMPORTER">Importer</option>
                            <option value="DISTRIBUTOR">Distributor</option>
                            <option value="RETAILER">Retailer</option>
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