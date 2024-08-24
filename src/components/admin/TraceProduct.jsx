import React, { useState } from 'react';
import {
    Box, Input, Button, Spinner, IconButton, useToast, VStack
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import ProductDetails from '../../pages/ProductDetails';

function TraceProduct() {
    const [showDetails, setShowDetails] = useState(false);
    const [productId, setProductId] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleTraceProduct = () => {
        if (!productId) {
            toast({
                title: "Product ID is required.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        setLoading(true);
        setShowDetails(false);

        setTimeout(() => { // Simulate loading time
            setShowDetails(true);
            setLoading(false);
        }, 1000); // Adjust the timeout as needed
    };

    return (
        <div className='flex flex-col px-80 justify-center mt-10'>
            <h1 className='text-2xl font-bold text-center mb-5'>Search Product TraceChain </h1>
            <div>
                <VStack spacing={4} align="stretch">
                    <Box className='flex gap-4'>
                        <Input
                            placeholder='Enter Product ID'
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                            type="number"
                        />
                        <IconButton
                            icon={<SearchIcon />}
                            onClick={handleTraceProduct}
                            aria-label="Trace Product"
                            ml={2}
                        />
                    </Box>

                    {loading ? (
                        <Box textAlign="center">
                            <Spinner size="xl" />
                        </Box>
                    ) : (
                        showDetails && <ProductDetails pid={productId} />
                    )}
                </VStack>
            </div>
        </div>
    );
}

export default TraceProduct;
