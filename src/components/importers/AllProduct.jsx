import React, { useEffect, useState } from 'react';
import { Box, Divider, Table, Thead, Tbody, Tr, Th, Td, Text, Button } from '@chakra-ui/react';
import { etherContract } from '../../contants';
import { useActiveAccount } from 'thirdweb/react';
import ProductDetails from './ProductDetails'; // Import the ProductDetails component
import DispatchToDistributor from './DispatchToDistributor'; // Import DispatchToDistributor component

function AllProduct() {
    const [deliveredProducts, setDeliveredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [dispatchProductId, setDispatchProductId] = useState(null); // State for dispatch component
    const [isHidden, setIsHidden] = useState(true);
    const activeAccount = useActiveAccount();

    const fetchDeliveredProducts = async () => {
        try {
            const filter = etherContract.filters.ProductDelivered();
            const events = await etherContract.queryFilter(filter);

            // Fetch details and update state
            const parsedEvents = await Promise.all(
                events
                    .filter(event => event.args.receiver === activeAccount?.address)
                    .map(async event => {
                        const details = await etherContract.dispatches(event.args.id.toString());
                        return {
                            dispatchId: event.args.id.toString(),
                            recipient: event.args.receiver,
                            timestamp: event.args.timestamp.toNumber(),
                            details
                        };
                    })
            );

            console.log(parsedEvents);
            setDeliveredProducts(parsedEvents);
        } catch (error) {
            console.error('Error fetching delivered products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeliveredProducts();

        // Listen for new ProductDelivered events
        const handleProductDelivered = async (dispatchId, recipient, timestamp) => {
            const details = await etherContract.dispatches(dispatchId.toString());
            setDeliveredProducts(prev => [
                ...prev,
                { dispatchId: dispatchId.toString(), recipient, timestamp: timestamp.toNumber(), details }
            ]);
        };

        etherContract.on('ProductDelivered', handleProductDelivered);

        // Cleanup listener on component unmount
        return () => {
            etherContract.off('ProductDelivered', handleProductDelivered);
        };
    }, [activeAccount?.address]);

    if (loading) {
        return <Text>Loading...</Text>;
    }

    return (
        <Box p={4}>
            <Box textAlign='center' mb={4}>
                <Text fontSize='4xl' fontWeight='bold' mb={2}>Accepted Products</Text>
                <Text>List of products confirmed as delivered (Dispatch ID)</Text>
            </Box>
            <Divider mb={4} />
            {deliveredProducts.length > 0 ? (
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>Dispatch ID</Th>
                            <Th>Recipient</Th>
                            <Th>Timestamp</Th>
                            <Th>IPFS Doc Hash</Th>
                            <Th>Product ID</Th>
                            <Th>Quantity</Th>
                            <Th>Dispatch</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {deliveredProducts.map((product, index) => (
                            <Tr key={index}>
                                <Td>{product.dispatchId}</Td>
                                <Td>{product.recipient}</Td>
                                <Td>{new Date(product.timestamp * 1000).toLocaleString()}</Td>
                                <Td>{product.details.ipfsDocHash}</Td>
                                <Td>
                                    <Button onClick={() => {
                                        setSelectedProductId(product.details.productId.toString());
                                        setIsHidden(!isHidden);
                                    }}>
                                        {product.details.productId.toString()}
                                    </Button>
                                </Td>
                                <Td>{product.details.quantity.toString()}</Td>
                                <Td>
                                    <Button
                                        colorScheme='blue'
                                        onClick={() => setDispatchProductId(product.details.productId.toString())}
                                    >
                                        Dispatch
                                    </Button>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            ) : (
                <Text>No products delivered yet.</Text>
            )}

            {selectedProductId && isHidden && <ProductDetails productID={selectedProductId} />}
            {dispatchProductId && (
                <DispatchToDistributor pid={dispatchProductId} />
            )}
        </Box>
    );
}

export default AllProduct;
