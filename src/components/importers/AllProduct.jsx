import React, { useEffect, useState } from 'react';
import { Box, Divider, Table, Thead, Tbody, Tr, Th, Td, Text, Button, IconButton, Spinner, Center } from '@chakra-ui/react';
import { etherContract } from '../../contants';
import useAuth from '../../hooks/userAuth';
import backgroundImage from "../../img/homeBG3.png";

function AllProduct() {
    const [deliveredProducts, setDeliveredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { account } = useAuth();

    const fetchDeliveredProducts = async () => {
        try {
            const filter = etherContract.filters.ProductAccepted(null, null, account);
            const events = await etherContract.queryFilter(filter);

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

            setDeliveredProducts(parsedEvents);
        } catch (error) {
            console.error('Error fetching delivered products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeliveredProducts();

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

        return () => {
            etherContract.off('ProductAccepted', handleProductAccepted);
        };
    }, [account]);

    if (loading) {
        return (
            <Center height="100vh">
                <Box textAlign="center">
                    <Spinner size="xl" color="blue.500" />
                    <Text mt={4} fontSize="xl" fontWeight="bold">Please wait while we load the accepted products. This won't take long.</Text>
                </Box>
            </Center>
        );
    }

    return (
        <Box className='px-10 py-5 w-full min-h-screen bg-cover bg-center flex flex-col' style={{ backgroundImage: `url(${backgroundImage})` }}>
            <Box className='flex justify-center'>
                
                <Text className='text-center font-bold text-4xl'>Accepted Products</Text>
                <Box></Box>
            </Box>
            <Text className='text-center mt-4'>List of products confirmed as delivered (Dispatch ID)</Text>
            <Divider className='mt-5' borderWidth='1px' borderColor='#5160be' />
            {deliveredProducts.length > 0 ? (
                <Box className='mt-5 border bg-white'>
                    <Table variant='simple' size='md'>
                        <Thead bg="#5160be">
                            <Tr>
                                <Th color="white" textAlign="center">Dispatch ID</Th>
                                <Th color="white" textAlign="center">Product ID</Th>
                                <Th color="white" textAlign="center">Product Name</Th>
                                <Th color="white" textAlign="center">Category</Th>
                                <Th color="white" textAlign="center">Country of Origin</Th>
                                <Th color="white" textAlign="center">Manufacturer</Th>
                                <Th color="white" textAlign="center">Price</Th>
                                <Th color="white" textAlign="center">Recipient</Th>
                                <Th color="white" textAlign="center">Timestamp</Th>
                                <Th color="white" textAlign="center">Quantity</Th>
                                <Th color="white" textAlign="center">Distribution Status</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {deliveredProducts.filter(product => product.acceptedBy === account).map((product, index) => (
                                <Tr key={index} _hover={{ bg: "gray.100" }}>
                                    <Td textAlign="center">{product.dispatchId}</Td>
                                    <Td textAlign="center">{product.productId}</Td>
                                    <Td textAlign="center">{product.name}</Td>
                                    <Td textAlign="center">{product.category}</Td>
                                    <Td textAlign="center">{product.countryOfOrigin}</Td>
                                    <Td textAlign="center">{product.manufacturer}</Td>
                                    <Td textAlign="center">{product.price}</Td>
                                    <Td textAlign="center">Self</Td>
                                    <Td textAlign="center">{new Date(product.acceptedOn * 1000).toLocaleString()}</Td>
                                    <Td textAlign="center">{product.quantity}</Td>
                                    <Td textAlign="center">
                                        {product.owner !== account ? (
                                            <Button colorScheme='green'>Done</Button>
                                        ) : (
                                            <Button colorScheme='blue'>In House</Button>
                                        )}
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
            ) : (
                <Text>No products delivered yet.</Text>
            )}
        </Box>
    );
}

export default AllProduct;
