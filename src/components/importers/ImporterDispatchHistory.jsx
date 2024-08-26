import React, { useEffect, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Text, Divider, TableContainer, Spinner, Center, Image, keyframes } from '@chakra-ui/react';
import { etherContract } from '../../contants';
import useAuth from '../../hooks/userAuth';
import backgroundImage from "../../img/homeBG3.png";
import blinkingImage from '../../img/svg.png'; // Replace with your image path

// Define the blinking animation for the image
const blinkAnimation = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;

// Define the spinning animation for the spinner
const spinAround = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

function ImporterDispatchHistory() {
    const [dispatches, setDispatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const { account } = useAuth();

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
                        endId: Number(productId.toString()),
                        from: from,
                        to: to,
                        timestamp: Number(dispatchedOn.toString()),
                        quantity: quantity.toString(),
                        type: 'Single'
                    };
                });

                const allDispatches = [...multiProductDispatches, ...singleProductDispatches];
                allDispatches.sort((a, b) => b.timestamp - a.timestamp);

                setDispatches(allDispatches);
            } catch (error) {
                console.error('Error fetching history data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (etherContract) {
            fetchHistoryData();
        }
    }, [etherContract, account]);

    const formatAddress = (address) => {
        return `${address.slice(0, 5)}...${address.slice(-7)}`;
    };

    if (loading) {
        return (
            <Center height="100vh" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <Box textAlign="center" position="relative" display="inline-block">
                    {/* Image in the center */}
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
                        animation={`${spinAround} 0.9s linear infinite`}
                        position="relative"
                        zIndex="0"  // Ensures the spinner stays behind the image
                    />
                    <Text mt={4} fontSize="xl" fontWeight="bold">
                        Please wait while we load the dispatch history. This won't take long.
                    </Text>
                </Box>
            </Center>
        );
    }

    return (
        <Box className='px-10 py-5 w-full min-h-screen bg-cover bg-center flex flex-col' style={{ backgroundImage: `url(${backgroundImage})` }}>
            <Box className='flex justify-center'>
                <Text className='text-center font-bold text-4xl'>Importer to Distributor Dispatch History</Text>
            </Box>
            <Text textAlign='center' mt={4}>List of all the distributors whom you already send products</Text>
            <Divider className='mt-5' borderWidth='1px' borderColor='#5160be' />
            {dispatches.length > 0 ? (
                <Box className='mt-5 border bg-white'>
                    <TableContainer>
                        <Table variant='simple' size='md'>
                            <Thead bg="#5160be">
                                <Tr>
                                    <Th color="white" textAlign="center">Dispatch ID</Th>
                                    <Th color="white" textAlign="center">Start PID</Th>
                                    <Th color="white" textAlign="center">End PID</Th>
                                    <Th color="white" textAlign="center">From</Th>
                                    <Th color="white" textAlign="center">Distributor</Th>
                                    <Th color="white" textAlign="center">Timestamp</Th>
                                    <Th color="white" textAlign="center">Quantity</Th>
                                    <Th color="white" textAlign="center">Type</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {dispatches
                                    .filter(dispatch => dispatch.quantity > 0 && dispatch.from === account)
                                    .map(dispatch => (
                                        <Tr key={dispatch.dispatchId} _hover={{ bg: "gray.100" }}>
                                            <Td textAlign="center">{dispatch.dispatchId}</Td>
                                            <Td textAlign="center">{dispatch.startId}</Td>
                                            <Td textAlign="center">{dispatch.endId}</Td>
                                            <Td textAlign="center">Self</Td>
                                            <Td textAlign="center">{formatAddress(dispatch.to)}</Td>
                                            <Td textAlign="center">{new Date(dispatch.timestamp * 1000).toLocaleString()}</Td>
                                            <Td textAlign="center">{dispatch.quantity}</Td>
                                            <Td textAlign="center">{dispatch.type}</Td>
                                        </Tr>
                                    ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>
            ) : (
                <Text className='text-center mt-5'>No dispatch history available.</Text>
            )}
        </Box>
    );
}

export default ImporterDispatchHistory;
