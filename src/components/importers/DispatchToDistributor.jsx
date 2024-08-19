import React, { useState } from 'react';
import { Box, Button, Heading, VStack, Icon } from '@chakra-ui/react';
import { FiPackage, FiLayers } from 'react-icons/fi'; 
import SingleProductDispatch from './SingleProductDispatch';
import MultipleProductDispatch from './MultipleProductDispatch';

function DispatchToDistributor() {
    const [selectedOption, setSelectedOption] = useState(null);

    return (
        <Box p={4}>
            <Heading size="lg" mb={6}>Importer to Distributor Dispatch</Heading>
            <Heading size="md" mb={4}>Please choose your option:</Heading>
            <VStack spacing={4} className='flex'>
                <Button
                    leftIcon={<Icon as={FiPackage} />}
                    colorScheme={selectedOption === 'single' ? 'blue' : 'gray'}
                    variant={selectedOption === 'single' ? 'solid' : 'outline'}
                    onClick={() => setSelectedOption('single')}
                >
                    Single Product Dispatch
                </Button>
                <Button
                    leftIcon={<Icon as={FiLayers} />}
                    colorScheme={selectedOption === 'multiple' ? 'green' : 'gray'}
                    variant={selectedOption === 'multiple' ? 'solid' : 'outline'}
                    onClick={() => setSelectedOption('multiple')}
                >
                    Multiple Product Dispatch
                </Button>
            </VStack>

            <Box mt={8}>
                {selectedOption === 'single' && <SingleProductDispatch />}
                {selectedOption === 'multiple' && <MultipleProductDispatch />}
            </Box>
        </Box>
    );
}

export default DispatchToDistributor;
