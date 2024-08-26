import React, { useEffect, useState } from 'react';
import { Box, Divider, Table, Thead, Tbody, Tr, Th, Td, Text, Button, Spinner, Center, Image, useToast, keyframes } from '@chakra-ui/react';
import { etherContract } from '../../contants';
import useAuth from '../../hooks/userAuth';
import useWallet from '../../hooks/userWallet';
import backgroundImage from "../../img/homeBG3.png";
import blinkingImage from '../../img/svg.png';  // Replace with your image path
import { ProductStatus } from '../../utils/ProductStatus';

// Define the blinking animation
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

function PendingProduct() {
    const [dispatches, setDispatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingStates, setLoadingStates] = useState({});
    const { account } = useAuth();
    const { signer, traceChainBDContract, zeroGas } = useWallet();
    const toast = useToast();

    useEffect(() => {
        const fetchHistoryData = async () => {
            try {
                const events = await etherContract.queryFilter('MultiProductDispatched');
                const dispatchesList = events.map(event => {
                    const { dispatchId, startId, endId, to, dispatchedOn, quantity } = event.args;
                    return {
                        dispatchId: Number(dispatchId.toString()),
                        startId: Number(startId.toString()),
                        endId: Number(endId.toString()),
                        receiver: to,
                        quantity: Number(quantity.toString()),
                        timestamp: dispatchedOn.toNumber()
                    };
                });

                const validDispatches = [];

                for (const dispatch of dispatchesList) {
                    const confirmed1st = await etherContract.productLifeCycles(ethers.BigNumber.from(dispatch.startId));
                    const confirmedLast = await etherContract.productLifeCycles(ethers.BigNumber.from(dispatch.endId));

                    if (Number(confirmed1st.importerDispatchId.toString()) === 0 && Number(confirmedLast.importerDispatchId.toString()) === 0 && confirmed1st.owner === account && confirmed1st.status != ProductStatus.AcceptedByImporter) {
                        validDispatches.push(dispatch);
                    }
                }

                setDispatches(validDispatches);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching history data:', error);
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
                setDispatches(dispatches.filter(dispatch => dispatch.dispatchId !== _dispatchId));
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
                        Please wait while we load the list of pending products. This won't take long.
                    </Text>
                </Box>
            </Center>
        );
    }

    return (
        <Box className='px-10 py-5 w-full min-h-screen bg-cover bg-center flex flex-col' style={{ backgroundImage: `url(${backgroundImage})` }}>
            <Box className='flex justify-center'>
                <Text className='text-center font-bold text-4xl'>Pending Products</Text>
            </Box>
            <Text className='text-center mt-4'>List of products send by customs and pending for your acceptance </Text>
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
