import React, { useState } from 'react';
import { useToast, Spinner, Icon } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import useWallet from '../../hooks/userWallet';

function SellProduct() {
  const [productId, setProductId] = useState("");
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for the button
  const { traceChainBDContract, zeroGas } = useWallet();
  const toast = useToast();
  const sellAddr = '0x0000000000000000000000000000000000000000'; // burn address

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

  return (
    <>
      <div className='flex justify-center items-center mt-6'>
        <div className='flex flex-col gap-4 w-[400px]'>
          <h1 className='text-4xl font-bold mb-5 text-center'>Sell Product by Retailer</h1>
          <input
            type="number"
            className='p-2 border rounded-lg'
            placeholder='Enter Product Id'
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          />

          <input
            type="number"
            className='p-2 border rounded-lg'
            placeholder='Enter price'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <div className='flex justify-center'>
            <button
              className='bg-blue-600 p-4 text-white rounded-xl w-[300px] font-bold flex justify-center items-center'
              onClick={handleSellProduct}
              disabled={loading} // Disable the button while loading
            >
              {loading ? (
                <Spinner size="sm" color="white" />
              ) : (
                'Print Slip and Sell'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default SellProduct;
