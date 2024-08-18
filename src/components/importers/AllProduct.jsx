import React, { useEffect, useState } from 'react';
import { Box, Divider, Table, Thead, Tbody, Tr, Th, Td, Text, Button } from '@chakra-ui/react';
import { etherContract } from '../../contants';
import ProductDetails from './ProductDetails';
import DispatchToDistributor from './DispatchToDistributor';
import useAuth from '../../hooks/userAuth';

function AllProduct() {
    const [deliveredProducts, setDeliveredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [dispatchProductId, setDispatchProductId] = useState(null);
    const [isHidden, setIsHidden] = useState(true);
    const { account } = useAuth();

    const fetchDeliveredProducts = async () => {
        try {
            // Fetch ProductAccepted events filtered by the current user's account
            const filter = etherContract.filters.ProductAccepted(null, account);
            const events = await etherContract.queryFilter(filter);

            // Parse the events and retrieve dispatch details
            const parsedEvents = await Promise.all(
                events.map(async event => {
                    const details = await etherContract.dispatches(event.args.dispatchId.toString());
                    return {
                        dispatchId: event.args.dispatchId.toString(),
                        productId: details.productId.toString(),
                        acceptedBy: event.args.acceptedBy,
                        acceptedOn: event.args.acceptedOn.toNumber(),
                        receiveStatus: event.args.status.toNumber(),
                        ipfsDocHash: details.ipfsDocHash,
                        quantity: details.quantity.toString(),
                    };
                })
            );

            // Update state with the fetched data
            setDeliveredProducts(parsedEvents);
        } catch (error) {
            console.error('Error fetching delivered products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeliveredProducts();

        // Listen for new ProductAccepted events and update state
        const handleProductAccepted = async (dispatchId, productId, acceptedBy, acceptedOn, status) => {
            if (acceptedBy === account) {
                const details = await etherContract.dispatches(dispatchId.toString());
                setDeliveredProducts(prev => [
                    ...prev,
                    {
                        dispatchId: dispatchId.toString(),
                        productId: details.productId.toString(),
                        acceptedBy,
                        acceptedOn: acceptedOn.toNumber(),
                        receiveStatus: status.toNumber(),
                        ipfsDocHash: details.ipfsDocHash,
                        quantity: details.quantity.toString(),
                    }
                ]);
            }
        };

        etherContract.on('ProductAccepted', handleProductAccepted);

        // Cleanup event listener on component unmount
        return () => {
            etherContract.off('ProductAccepted', handleProductAccepted);
        };
    }, [account]);

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
                                <Td>{product.acceptedBy}</Td>
                                <Td>{new Date(product.acceptedOn * 1000).toLocaleString()}</Td>
                                <Td>{product.ipfsDocHash}</Td>
                                <Td>
                                    <Button onClick={() => {
                                        setSelectedProductId(product.productId);
                                        setIsHidden(!isHidden);
                                    }}>
                                        {product.productId}
                                    </Button>
                                </Td>
                                <Td>{product.quantity}</Td>
                                <Td>
                                    <Button
                                        colorScheme='blue'
                                        onClick={() => setDispatchProductId(product.productId)}
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
