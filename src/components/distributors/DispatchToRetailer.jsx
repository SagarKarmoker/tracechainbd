import React, { useState } from 'react';
import { Box, Button, Heading, VStack, Icon, Text } from '@chakra-ui/react';
import { FiPackage, FiLayers } from 'react-icons/fi';
import SingleProductDispatch from '../importers/SingleProductDispatch';
import MultipleProductDispatch from '../importers/MultipleProductDispatch';
import backgroundImage from "../../img/homeBG5.png"; // Adjust the path if necessary

function DispatchToRetailer() {
    // Set the default selectedOption to 'single'
    const [selectedOption, setSelectedOption] = useState('single');

    return (
        <Box className='px-10 py-5 w-full min-h-screen bg-cover bg-center flex flex-col items-center' style={{ backgroundImage: `url(${backgroundImage})` }}>
            <Box className='flex justify-between w-full'>
                <Box></Box>
                <Text className='text-center font-bold text-4xl'>Distributor to Retailer Dispatch</Text>
                <Box></Box>
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
                {/* Display SingleProductDispatch by default, and also show MultipleProductDispatch based on selection */}
                {selectedOption === 'single' && <SingleProductDispatch />}
                {selectedOption === 'multiple' && <MultipleProductDispatch />}
            </Box>
        </Box>
    );
}

export default DispatchToRetailer;
