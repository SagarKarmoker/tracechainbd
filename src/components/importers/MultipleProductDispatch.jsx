import React, { useState } from 'react';
import { Box, Input, Button, Heading, VStack, Icon, Link, useToast } from '@chakra-ui/react';
import { FiSend, FiSearch } from 'react-icons/fi';
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
    <Box p={4} className="shadow-md rounded-md max-w-md mx-auto bg-white">
      <Heading size="lg" mb={6} className="text-center">Multiple Product Dispatch</Heading>
      <VStack spacing={4}>
        <Input
          placeholder="Enter Start Product ID"
          type="number"
          focusBorderColor="blue.500"
          className="border-gray-300 rounded-md shadow-sm"
          value={startProductId}
          onChange={(e) => setStartProductId(e.target.value)}
        />
        <Input
          placeholder="Enter End Product ID"
          type="number"
          focusBorderColor="blue.500"
          className="border-gray-300 rounded-md shadow-sm"
          value={endProductId}
          onChange={(e) => setEndProductId(e.target.value)}
        />
        <Input
          placeholder="Distributor Address"
          type="text"
          focusBorderColor="green.500"
          className="border-gray-300 rounded-md shadow-sm"
          value={distributorAddress}
          onChange={(e) => setDistributorAddress(e.target.value)}
        />
        {/* <Link href="#" color="blue.400" fontSize="sm" alignSelf="flex-start">
          <Icon as={FiSearch} mr={2} />
          Find distributor addresses
        </Link> */}
        <Input
          placeholder="Memo Document Hash"
          type="text"
          focusBorderColor="purple.500"
          className="border-gray-300 rounded-md shadow-sm"
          value={memoDocumentHash}
          onChange={(e) => setMemoDocumentHash(e.target.value)}
        />
        <Button
          colorScheme="green"
          onClick={handleDispatch}
          isLoading={isLoading}
          loadingText="Dispatching"
          leftIcon={<Icon as={FiSend} />}
          className="w-full"
        >
          Dispatch
        </Button>
      </VStack>
    </Box>
  );
}

export default MultipleProductDispatch;
