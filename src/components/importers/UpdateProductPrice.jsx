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
  IconButton,
} from '@chakra-ui/react';
import { CheckIcon, ArrowLeftIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import useWallet from '../../hooks/userWallet';
import backgroundImage from "../../img/homeBG3.png"; // Adjust the path if necessary

function UpdateProductPrice() {
  const { traceChainBDContract, zeroGas } = useWallet();
  const [boxId, setBoxId] = useState('');
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

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
    <Box className='px-10 py-5 w-full min-h-screen bg-cover bg-center flex flex-col' style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Box className='flex justify-between'>
        <IconButton icon={<ArrowLeftIcon />} onClick={() => navigate(0)} />
        <Heading as="h1" size="xl" textAlign="center" mt={5} className='text-center'>
          Update Product Price by Importer
        </Heading>
        <Box></Box>
      </Box>

      <Box p={4} className="shadow-md rounded-md mt-5 max-w-md mx-auto bg-white">
        <VStack spacing={4} >
          <FormControl id="product-id" isRequired >
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
            colorScheme="green"
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
    </Box>
  );
}

export default UpdateProductPrice;
