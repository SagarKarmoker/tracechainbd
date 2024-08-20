import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  Heading,
  useToast,
  Spinner,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import useWallet from '../../hooks/userWallet';

function UpdateProductPrice() {
  const { traceChainBDContract, zeroGas } = useWallet();
  const [boxId, setBoxId] = useState('');
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleUpdateProduct = async () => {
    setIsLoading(true);
    try {
      const tx = await traceChainBDContract.updateMultipleProductPriceByImporter(boxId, price, zeroGas);
      await tx.wait();

      toast({
        title: 'Price updated.',
        description: `Box ID ${boxId} price updated successfully.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });

      setBoxId('');
      setPrice('');
    } catch (error) {
      console.error('Error updating product price:', error);
      toast({
        title: 'Error occurred.',
        description: 'Failed to update the product price.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" p={5}>
      <VStack spacing={5} width="full" maxW="md">
        <Heading as="h1" size="xl" mb={5} textAlign="center">
          Update Product Price by Importer
        </Heading>

        <FormControl id="product-id" isRequired>
          <FormLabel>Box ID</FormLabel>
          <Input
            type="number"
            placeholder="Enter Box ID"
            value={boxId}
            onChange={(e) => setBoxId(e.target.value)}
            size="lg"
            focusBorderColor="blue.500"
          />
        </FormControl>

        <FormControl id="price" isRequired>
          <FormLabel>Updated Price</FormLabel>
          <Input
            type="number"
            placeholder="Enter Updated Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            size="lg"
            focusBorderColor="blue.500"
          />
        </FormControl>

        <Button
          leftIcon={isLoading ? <Spinner size="sm" /> : <CheckIcon />}
          colorScheme="blue"
          size="lg"
          width="full"
          onClick={handleUpdateProduct}
          isLoading={isLoading}
          loadingText="Updating"
          disabled={!boxId || !price || isLoading}
        >
          Update Price
        </Button>
      </VStack>
    </Box>
  );
}

export default UpdateProductPrice;
