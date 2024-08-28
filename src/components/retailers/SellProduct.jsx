import React, { useState, useRef } from 'react';
import { Box, Text, useToast, Spinner, Icon } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import useWallet from '../../hooks/userWallet';
import backgroundImage from "../../img/homeBG3.png"; // Background image

function SellProduct() {
  const [productId, setProductId] = useState("");
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for the button
  const { traceChainBDContract, zeroGas } = useWallet();
  const [productDetails, setProductDetails] = useState(null);
  const toast = useToast();
  const sellAddr = '0x0000000000000000000000000000000000000000'; // burn address

  const printRef = useRef();

  const getProductDetails = async (productId) => {
    try {
      const productDetails = await traceChainBDContract.products(productId);
      setProductDetails(productDetails);
      return productDetails;
    } catch (error) {
      console.error('Error getting product details:', error);
      return null;
    }
  }

  const handleSellProduct = async () => {
    if (productId === '' || price === '') {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true); // Start loading
      const details = await getProductDetails(productId);
      if (!details) {
        throw new Error("Failed to fetch product details");
      }

      const tx = await traceChainBDContract.dispatch(productId, productId, sellAddr, price, zeroGas);
      await tx.wait();

      toast({
        title: "Success",
        description: "Product sold successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        icon: <CheckCircleIcon />,
      });
      setProductId('');
      setPrice('');

      // Automatically print after successful transaction
      handlePrint();
    } catch (error) {
      console.error('Error selling product:', error);
      toast({
        title: "Error",
        description: "An error occurred while selling the product.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false); // Stop loading
    }
  }

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // To reload the page after printing
  }

  return (
    <Box
      className='px-10 py-5 w-full min-h-screen bg-cover bg-center flex flex-col justify-top items-center'
      style={{ backgroundImage: `url(${backgroundImage})` }} // Setting the background
    >
      <Box className='flex flex-col gap-4 w-96'>
        <Text className='text-center font-bold text-4xl'>Sell Product by Retailer</Text>
        
        <input
          type="number"
          className='p-3 bg-white border-2 border-[#5160be] rounded-lg' // Input box design
          placeholder='Enter Product Id'
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />

        <input
          type="number"
          className='p-3 bg-white border-2 border-[#5160be] rounded-lg' // Input box design
          placeholder='Enter price'
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button
          className='bg-[#5160be] hover:bg-[#7db6f9] text-white font-bold py-2 px-4 rounded w-full flex justify-center items-center' // Button design
          onClick={handleSellProduct}
          disabled={loading} // Disable the button while loading
        >
          {loading ? (
            <Spinner size="sm" color="white" />
          ) : (
            'Print Slip and Sell'
          )}
        </button>
      </Box>

      {/* The section to print */}
      <Box ref={printRef} className="hidden">
        <Box className='p-5 border-2 border-gray-300 rounded-lg'>
          <Text className='text-lg font-bold'>Product Sale Slip</Text>
          <Text>Product ID: {productId}</Text>
          <Text>Price: {price} </Text>
          {productDetails && (
            <>
              <Text>Box ID: {productDetails.boxId.toString()}</Text>
              <Text>Name: {productDetails.name}</Text>
              <Text>Description: {productDetails.description}</Text>
              <Text>Category: {productDetails.category}</Text>
              <Text>Country of Origin: {productDetails.countryOfOrigin}</Text>
              <Text>Manufacturer: {productDetails.manufacturer}</Text>
              <Text>Quantity: {productDetails.quantity.toString()}</Text>
              <Text>Imported Date: {new Date(productDetails.importedDate.toNumber() * 1000).toLocaleDateString()}</Text>
              <Text>Billing Date: {new Date().toLocaleString()}</Text>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default SellProduct;
