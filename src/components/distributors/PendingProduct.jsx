import React, { useEffect, useState } from 'react';
import { Box, Divider, Table, Thead, Tbody, Tr, Th, Td, Text, Button, IconButton, Spinner, Center, Image, useToast, keyframes } from '@chakra-ui/react';
import { etherContract } from '../../contants';
import useAuth from '../../hooks/userAuth';
import { ethers } from 'ethers';
import useWallet from '../../hooks/userWallet';
import { ProductStatus } from '../../utils/ProductStatus';
import backgroundImage from '../../img/homeBG5.png';
import blinkingImage from '../../img/svg.png'; // Ensure this is the correct path for your image

// Define the blinking animation for the image
const blinkAnimation = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;

function PendingProduct() {
    const [dispatches, setDispatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingStates, setLoadingStates] = useState({});
    const { account } = useAuth();
    const { traceChainBDContract, zeroGas } = useWallet();
    const toast = useToast();

    useEffect(() => {
        const fetchHistoryData = async () => {
            try {
                const multiProductEvents = await etherContract.queryFilter('MultiProductDispatched');
                const singleProductEvents = await etherContract.queryFilter('ProductDispatched');

                const multiProductDispatches = multiProductEvents.map(event => {
                    const { dispatchId, dispatchedOn, endId, quantity, from, startId, to } = event.args;

                    return {
                        dispatchId: dispatchId.toString(),
                        startId: Number(startId.toString()),
                        endId: Number(endId.toString()),
                        from: from,
                        to: to,
                        timestamp: Number(dispatchedOn.toString()),
                        quantity: quantity.toString(),
                        type: 'Multi'
                    };
                });

                const singleProductDispatches = singleProductEvents.map(event => {
                    const { dispatchId, dispatchedOn, productId, quantity, from, to } = event.args;

                    return {
                        dispatchId: dispatchId.toString(),
                        startId: Number(productId.toString()),
                        endId: 'N/A',
                        from: from,
                        to: to,
                        timestamp: Number(dispatchedOn.toString()),
                        quantity: quantity.toString(),
                        type: 'Single'
                    };
                });

                const allDispatches = [...multiProductDispatches, ...singleProductDispatches];
                console.log(allDispatches)

                const filteredDispatches = await Promise.all(
                    allDispatches
                        .filter(dispatch => dispatch.to.toLowerCase() === account.toLowerCase())
                        .map(async (dispatch) => {
                            const checkOwner = await etherContract.productLifeCycles(dispatch.startId);
                            console.log(Number(checkOwner.status));

                            // Check the conditions and return the dispatch or null
                            return (checkOwner.status === ProductStatus.Dispatched && checkOwner.owner === account)
                                ? dispatch
                                : null;
                        })
                );

                // Filter out any null values (those that didn't meet the status condition)
                const validDispatches = filteredDispatches.filter(dispatch => dispatch !== null);

                console.log(validDispatches);
                setDispatches(validDispatches);
            } catch (error) {
                console.error('Error fetching history data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistoryData();
    }, [account]);

    const handleAccept = async (_dispatchId) => {
        setLoadingStates(prev => ({ ...prev, [_dispatchId]: true }));

        try {
            const tx = await traceChainBDContract.confirmDelivery(_dispatchId, {
                gasLimit: 3000000,
                ...zeroGas
            });
            const response = await tx.wait();

            if (response) {
                toast({
                    title: "Dispatch accepted successfully",
                    description: `Dispatch ${_dispatchId} accepted successfully`,
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Not Accepted",
                    description: `Something went wrong`,
                    status: "warning",
                    duration: 9000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Error accepting dispatch:', error);
            toast({
                title: "Error accepting dispatch",
                description: `Something went wrong`,
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        } finally {
            setLoadingStates(prev => ({ ...prev, [_dispatchId]: false }));
        }
    };

    if (loading) {
        return (
            <Center height="100vh" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <Box textAlign="center">
                    {/* Image in the center */}
                    <Center textAlign="center" position="relative" display="inline-block">
                        <Image
                            src={blinkingImage}
                            alt="Loading"
                            boxSize="50px"
                            animation={`${blinkAnimation} 1.5s infinite`}
                            position="absolute"
                            top="27%"
                            left="50%"
                            transform="translate(-50%, -50%)"
                        />

                        {/* Spinner surrounding the image */}
                        <Spinner
                            width="60px" height="60px" color="#5160be"
                            position="relative"
                            zIndex="0"
                        />
                        <Text mt={4} fontSize="xl" fontWeight="bold">
                            Please wait while we load the pending products. This won't take long.
                        </Text>
                    </Center>
                </Box>
            </Center>
        );
    }

    return (
        <Box
            className='px-10 py-5 w-full min-h-screen bg-cover bg-center flex flex-col'
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <Box className='flex justify-center'>
                <Text className='text-center font-bold text-4xl'>Pending Products</Text>
                <Box></Box>
            </Box>
            <Text className='text-center mt-4'>List of all pending products to accept</Text>
            <Divider className='mt-5' borderWidth='1px' borderColor='#5160be' />
            {dispatches.length > 0 ? (
                <Box className='mt-5 border bg-white'>
                    <Table variant='simple' size='md'>
                        <Thead bg="#5160be">
                            <Tr>
                                <Th color="white" textAlign="center">Dispatch ID</Th>
                                <Th color="white" textAlign="center">Start ID</Th>
                                <Th color="white" textAlign="center">End ID</Th>
                                <Th color="white" textAlign="center">Receiver</Th>
                                <Th color="white" textAlign="center">Timestamp</Th>
                                <Th color="white" textAlign="center">Quantity</Th>
                                <Th color="white" textAlign="center">Action</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {dispatches.map((dispatch) => (
                                <Tr key={dispatch.dispatchId} _hover={{ bg: "gray.100" }}>
                                    <Td textAlign="center">{dispatch.dispatchId}</Td>
                                    <Td textAlign="center">{dispatch.startId}</Td>
                                    <Td textAlign="center">{dispatch.endId}</Td>
                                    <Td textAlign="center">Self</Td>
                                    <Td textAlign="center">{new Date(dispatch.timestamp * 1000).toLocaleString()}</Td>
                                    <Td textAlign="center">{dispatch.quantity}</Td>
                                    <Td textAlign="center">
                                        <Button
                                            colorScheme='green'
                                            isLoading={loadingStates[dispatch.dispatchId]}
                                            onClick={() => handleAccept(dispatch.dispatchId)}
                                        >
                                            Accept
                                        </Button>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
            ) : (
                <Text>No pending products.</Text>
            )}
        </Box>
    );
}

export default PendingProduct;
