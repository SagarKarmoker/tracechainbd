import React, { useEffect, useState } from 'react';
import { Box, Divider, Table, Thead, Tbody, Tr, Th, Td, Text, Button } from '@chakra-ui/react';
import useAuth from '../../hooks/userAuth';
import { ProductStatus } from '../../utils/ProductStatus';

function AllProduct() {
    const [deliveredProducts, setDeliveredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { account } = useAuth();

    const fetchDeliveredProducts = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/delivered-products/${account}`);
            const data = await response.json();

            // Update state only if the data has changed
            if (JSON.stringify(data) !== JSON.stringify(deliveredProducts)) {
                setDeliveredProducts(data);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching delivered products:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeliveredProducts();

        // Polling every 1 minute for new data
        const intervalId = setInterval(fetchDeliveredProducts, 60000);

        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId);
    }, [account, deliveredProducts]);

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
                            <Th>Product ID</Th>
                            <Th>Product Name</Th>
                            <Th>Category</Th>
                            <Th>Country of Origin</Th>
                            <Th>Manufacturer</Th>
                            <Th>Price</Th>
                            <Th>Recipient</Th>
                            <Th>Timestamp</Th>
                            <Th>Quantity</Th>
                            <Th>Distribution Status</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {deliveredProducts
                            .filter((product, index, self) =>
                                index === self.findIndex((p) => (
                                    p.dispatchId === product.dispatchId && p.productId === product.productId
                                ))
                            )
                            .filter(product => product.acceptedBy === account.toLowerCase() && product.status === ProductStatus.AcceptedByImporter)
                            .map((product, index) => (
                                <Tr key={index}>
                                    <Td>{product.dispatchId}</Td>
                                    <Td>{product.productId}</Td>
                                    <Td>{product.name}</Td>
                                    <Td>{product.category}</Td>
                                    <Td>{product.countryOfOrigin}</Td>
                                    <Td>{product.manufacturer}</Td>
                                    <Td>{product.price}</Td>
                                    <Td>Self</Td>
                                    <Td>{new Date(product.acceptedOn * 1000).toLocaleString()}</Td>
                                    <Td>{product.quantity}</Td>
                                    {
                                        product.owner !== account.toLowerCase() ? (
                                            <Td>
                                                <Button colorScheme='green'>Done</Button>
                                            </Td>
                                        ) : (
                                            <Td>
                                                <Button colorScheme='blue'>In House</Button>
                                            </Td>
                                        )
                                    }
                                </Tr>
                            ))}
                    </Tbody>

                </Table>
            ) : (
                <Text>No products delivered yet.</Text>
            )}
        </Box>
    );
}

export default AllProduct;
