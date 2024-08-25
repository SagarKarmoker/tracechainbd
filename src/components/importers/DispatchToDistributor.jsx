import React, { useState } from 'react';
import { Box, Button, Heading, VStack, Icon, IconButton, Text } from '@chakra-ui/react';
import { FiPackage, FiLayers } from 'react-icons/fi';
import SingleProductDispatch from './SingleProductDispatch';
import MultipleProductDispatch from './MultipleProductDispatch';
import backgroundImage from "../../img/homeBG3.png"; // Adjust the path if necessary

function DispatchToDistributor() {
    const [selectedOption, setSelectedOption] = useState('single'); // Set default selectedOption to 'single'

    return (
        <Box className='px-10 py-5 w-full min-h-screen bg-cover bg-center flex flex-col items-center' style={{ backgroundImage: `url(${backgroundImage})` }}>
            <Box className='flex justify-center w-full'>
                <Box></Box>
                <Text className='text-center font-bold text-4xl'>Importer to Distributor Dispatch</Text>
            </Box>

            <Heading size="md" mb={4} textAlign="center" mt={8}>Please choose your option:</Heading>
            <VStack spacing={4} className='flex'>
                <Button
                    leftIcon={<Icon as={FiPackage} />}
                    className='bg-white'
                    colorScheme={selectedOption === 'single' ? 'blue' : 'gray'}
                    variant={selectedOption === 'single' ? 'solid' : 'outline'}
                    onClick={() => setSelectedOption('single')}
                >
                    Single Product Dispatch
                </Button>
                <Button
                    leftIcon={<Icon as={FiLayers} />}
                    className='bg-white'
                    colorScheme={selectedOption === 'multiple' ? 'blue' : 'gray'}
                    variant={selectedOption === 'multiple' ? 'solid' : 'outline'}
                    onClick={() => setSelectedOption('multiple')}
                >
                    Multiple Product Dispatch
                </Button>
            </VStack>

            <Box mt={8} className='w-full'>
                {selectedOption === 'single' && <SingleProductDispatch />}
                {selectedOption === 'multiple' && <MultipleProductDispatch />}
            </Box>
        </Box>
    );
}

export default DispatchToDistributor;
