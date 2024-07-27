import { useState } from 'react'
import { prepareContractCall } from "thirdweb"
import { useSendTransaction } from "thirdweb/react";
import { useToast } from '@chakra-ui/react';
import { contract } from '../../chain'

function SingleProductEntry({ customsAddr }) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [countryOfOrigin, setCountryOfOrigin] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [importerAddr, setImporterAddr] = useState('');

  const toast = useToast();
  const { mutate: sendTransaction } = useSendTransaction();

  const singleProductEntry = async () => {
    if (name === '' || description === '' || category === '' || countryOfOrigin === '' || manufacturer === '' || price === '' || quantity === '' || importerAddr === '' || customsAddr === '') {
      toast({
        title: "Error",
        description: "All fields are required",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    else {
      const transaction = prepareContractCall({
        contract,
        method: "function addProduct(string _name, string _description, string _category, string _countryOfOrigin, string _manufacturer, uint256 _price, uint256 _quantity, address _importerAddr, address _customsAddr)",
        params: [name, description, category, countryOfOrigin, manufacturer, price, quantity, importerAddr, customsAddr]
      });
      sendTransaction(transaction);

      // if(transactionHash){
      //   toast({
      //     title: "Product Added",
      //     description: "Product added successfully",
      //     status: "success",
      //     duration: 9000,
      //     isClosable: true,
      //   });
      // }

      setId('');
      setName('');
      setDescription('');
      setCategory('');
      setCountryOfOrigin('');
      setManufacturer('');
      setPrice('');
      setQuantity('');
      setImporterAddr('');
    }
  }

  return (
    <div className='flex justify-center mt-4'>
      <div className='flex flex-col gap-4'>
        <h1 className='text-4xl font-bold mb-5 text-center'>Single Product Wise Entry</h1>
        {/* <input type="text" className='p-2 border rounded-lg w-[500px]' placeholder='Enter Product Id' value={id} onChange={(e) => setId(e.target.value)} /> */}
        <input type="text" className='p-2 border rounded-lg w-[500px]' placeholder='Enter Product Name' value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" className='p-2 border rounded-lg w-[500px]' placeholder='Enter Product Details' value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="text" className='p-2 border rounded-lg w-[500px]' placeholder='Enter Product Category' value={category} onChange={(e) => setCategory(e.target.value)} />
        <input type="text" className='p-2 border rounded-lg w-[500px]' placeholder='Enter Product Country of Origin' value={countryOfOrigin} onChange={(e) => setCountryOfOrigin(e.target.value)} />
        <input type="text" className='p-2 border rounded-lg w-[500px]' placeholder='Enter Product Manufacturer' value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} />
        <input type="number" className='p-2 border rounded-lg w-[500px]' placeholder='Enter Product Price' value={price} onChange={(e) => setPrice(e.target.value)} />
        <input type="number" className='p-2 border rounded-lg w-[500px]' placeholder='Enter Product Quantity' value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        {/* <input type="datetime-local" className='p-2 border rounded-lg' placeholder='Enter Product Import Date' value={importedDate} onChange={(e) => setImportedDate(e.target.value)} /> */}
        <input type="text" className='p-2 border rounded-lg w-[500px]' placeholder='Enter Importer Address' value={importerAddr} onChange={(e) => setImporterAddr(e.target.value)} />
        <input type="text" className='p-2 border rounded-lg w-[500px]' placeholder='Enter Customs Address' value={customsAddr} readOnly />

        <div className='flex justify-center'>
          <button onClick={singleProductEntry} className='bg-blue-600 p-4 text-white rounded-xl w-[300px] font-bold'>Add Product to Ledger</button>
        </div>
      </div>
    </div>
  )
}

export default SingleProductEntry