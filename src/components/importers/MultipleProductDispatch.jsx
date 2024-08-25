import React, { useState } from 'react';
import { Box, Input, Button, Heading, VStack, Icon, useToast } from '@chakra-ui/react';
import { FiSend } from 'react-icons/fi';
import useWallet from '../../hooks/userWallet';

function MultipleProductDispatch() {
  const { traceChainBDContract, zeroGas } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [startProductId, setStartProductId] = useState('');
  const [endProductId, setEndProductId] = useState('');
  const [distributorAddress, setDistributorAddress] = useState('');
  const [memoDocumentHash, setMemoDocumentHash] = useState('');
  const toast = useToast();

  const handleDispatch = async () => {
    try {
      setIsLoading(true);
      const tx = await traceChainBDContract.dispatch(
        startProductId, endProductId, distributorAddress, memoDocumentHash, zeroGas
      );
      const response = await tx.wait();
      if (response) {
        setIsLoading(false);
        toast({
          title: 'Success',
          description: 'Products dispatched successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        setStartProductId('');
        setEndProductId('');
        setDistributorAddress('');
        setMemoDocumentHash('');
      } else {
        setIsLoading(false);
        toast({
          title: 'Error',
          description: 'An error occurred while dispatching the products',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'An error occurred while dispatching the products',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };

  return (
    <Box p={4} className=" max-w-md mx-auto">
      <Heading size="lg" mb={6} className="text-center">Multiple Product Dispatch</Heading>
      <VStack spacing={4}>
        <input
          placeholder="Enter Start Product ID"
          type="number"
          value={startProductId}
          onChange={(e) => setStartProductId(e.target.value)}
          className='p-3 bg-white w-96 border rounded-lg'
          style={{ borderColor: '#5160be', borderWidth: '3px' }}
          required
        />
        <input
          placeholder="Enter End Product ID"
          type="number"
          value={endProductId}
          onChange={(e) => setEndProductId(e.target.value)}
          className='p-3 bg-white w-96 border rounded-lg'
          style={{ borderColor: '#5160be', borderWidth: '3px' }}
          required
        />
        <input
          placeholder="Distributor Address"
          type="text"
          value={distributorAddress}
          onChange={(e) => setDistributorAddress(e.target.value)}
          className='p-3 bg-white w-96 border rounded-lg'
          style={{ borderColor: '#5160be', borderWidth: '3px' }}
          required
        />
        <input
          placeholder="Memo Document Hash"
          type="text"
          value={memoDocumentHash}
          onChange={(e) => setMemoDocumentHash(e.target.value)}
          className='p-3 bg-white w-96 border rounded-lg'
          style={{ borderColor: '#5160be', borderWidth: '3px' }}
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
          className="w-full"
        >
          Dispatch
        </Button>
      </VStack>
    </Box>
  );
}

export default MultipleProductDispatch;
