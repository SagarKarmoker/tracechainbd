import React, { useEffect, useState } from 'react';
import { Box, Divider, Table, Thead, Tbody, Tr, Th, Td, Text, Button } from '@chakra-ui/react';
import { etherContract } from '../../contants';
import useAuth from '../../hooks/userAuth';

function AllProduct() {
    const [deliveredProducts, setDeliveredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { account } = useAuth();

    const fetchDeliveredProducts = async () => {
        try {
            // Fetch ProductAccepted events filtered by the current user's account
            const filter = etherContract.filters.ProductAccepted(null, null, account);
            const events = await etherContract.queryFilter(filter);

            // Parse the events and retrieve dispatch details along with product details
            const parsedEvents = await Promise.all(
                events.map(async event => {
                    const dispatchId = event.args.dispatchId.toString();
                    const productId = event.args.productId.toString();
                    const acceptedBy = event.args.acceptedBy;
                    const acceptedOn = event.args.acceptedOn.toNumber();
                    const status = event.args.status;

                    const _dispatchLen = await etherContract.getDispatchLength(dispatchId);

                    for (let i = 0; i < _dispatchLen; i++) {
                        const details = await etherContract.dispatches(dispatchId, i);
                        const product = await etherContract.products(productId);
                        const owner = await etherContract.productLifeCycles(productId);

                        return {
                            dispatchId,
                            productId,
                            acceptedBy,
                            acceptedOn,
                            status,
                            ipfsDocHash: details.ipfsDocHash,
                            quantity: details.quantity.toString(),
                            boxId: product.boxId.toString(),
                            name: product.name,
                            description: product.description,
                            category: product.category,
                            countryOfOrigin: product.countryOfOrigin,
                            manufacturer: product.manufacturer,
                            price: product.price.toString(),
                            importedDate: product.importedDate.toNumber(),
                            importerAddr: product.importerAddr,
                            customsAddr: product.customsAddr,
                            owner: owner.owner,
                        };
                    }
                })
            );

            console.log(parsedEvents);

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
                try {
                    const _dispatchLen = await etherContract.getDispatchLength(dispatchId.toString());

                    for (let i = 0; i < _dispatchLen; i++) {
                        const details = await etherContract.dispatches(dispatchId.toString(), i);
                        const product = await etherContract.products(productId);
                        const owner = await etherContract.productLifeCycles(productId);

                        setDeliveredProducts(prev => [
                            ...prev,
                            {
                                dispatchId: dispatchId.toString(),
                                productId: productId.toString(),
                                acceptedBy,
                                acceptedOn: acceptedOn.toNumber(),
                                status: status.toNumber(),
                                ipfsDocHash: details.ipfsDocHash,
                                quantity: details.quantity.toString(),
                                boxId: product.boxId.toString(),
                                name: product.name,
                                description: product.description,
                                category: product.category,
                                countryOfOrigin: product.countryOfOrigin,
                                manufacturer: product.manufacturer,
                                price: product.price.toString(),
                                importedDate: product.importedDate.toNumber(),
                                importerAddr: product.importerAddr,
                                customsAddr: product.customsAddr,
                                owner: owner.owner
                            }
                        ]);
                    }
                } catch (error) {
                    console.error('Error handling ProductAccepted event:', error);
                }
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
                        .filter(product => product.acceptedBy === account)
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
                                    product.owner !== account ? (
                                        <Td>
                                            <Button colorScheme='green'>Done</Button>
                                        </Td>
                                    ) :
                                        (<Td>

                                            <Button colorScheme='blue'>In House</Button>
                                        </Td>)
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
