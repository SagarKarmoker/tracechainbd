import React, { useState } from 'react';
import { Box, Input, Button, Heading, VStack, Icon, Link, useToast } from '@chakra-ui/react';
import { FiSend, FiSearch } from 'react-icons/fi';
import useWallet from '../../hooks/userWallet';

function SingleProductDispatch() {
  const { traceChainBDContract, zeroGas } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [productId, setProductId] = useState('');
  const [distributorAddress, setDistributorAddress] = useState('');
  const [memoDocumentHash, setMemoDocumentHash] = useState('');
  const toast = useToast();

  const handleDispatch = async () => {
    try {
      setIsLoading(true);
      const tx = await traceChainBDContract.dispatch(
        productId, productId, distributorAddress, memoDocumentHash, zeroGas
      );
      const response = await tx.wait();
      if (response) {
        setIsLoading(false);
        toast({
          title: 'Success',
          description: 'Product dispatched successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        setProductId('');
        setDistributorAddress('');
        setMemoDocumentHash('');
      } else {
        setIsLoading(false);
        toast({
          title: 'Error',
          description: 'An error occurred while dispatching the product',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }

    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'An error occurred while dispatching the product',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  };

  return (
    <Box p={4} className=" max-w-md mx-auto">
      <Heading size="lg" mb={6} className='text-center'>Single Product Dispatch</Heading>
      <VStack spacing={4}>
        <input
          placeholder="Enter Product ID"
          type="number"
          className='p-3 bg-white w-96 border rounded-lg'
          style={{ borderColor: '#5160be', borderWidth: '3px' }}
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          required
        />
        <input
          placeholder="Distributor Address"
          type="text"
          className='p-3 bg-white w-96 border rounded-lg'
          style={{ borderColor: '#5160be', borderWidth: '3px' }}
          value={distributorAddress}
          onChange={(e) => setDistributorAddress(e.target.value)}
          required
        />
        {/* <Link href="#" color="blue.400" fontSize="sm" alignSelf="flex-start">
          <Icon as={FiSearch} mr={2} />
          Find distributor addresses
        </Link> */}
        <input
          placeholder="Memo Document Hash"
          type="text"
          className='p-3 bg-white w-96 border rounded-lg'
          style={{ borderColor: '#5160be', borderWidth: '3px' }}
          value={memoDocumentHash}
          onChange={(e) => setMemoDocumentHash(e.target.value)}
          required
        />
        <Button
            onClick={handleDispatch}
            isLoading={isLoading}
            loadingText="Dispatching"
            leftIcon={<Icon as={FiSend} />}
            sx={{
                backgroundColor: '#5160be',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: 'md',
                paddingY: '2',
                paddingX: '4',
                _hover: {
                    backgroundColor: '#7db6f9',
                },
            }}
            className="w-96"
        >
            Dispatch
        </Button>
      </VStack>
    </Box>
  );
}

export default SingleProductDispatch;
