import React, { useEffect, useState } from 'react';
import { Divider, Table, Thead, Tbody, Tr, Th, Td, Box, Text, useToast, Button } from '@chakra-ui/react';
import { etherContract } from '../../contants';
import useAuth from '../../hooks/userAuth';
import { ethers } from 'ethers';
import useWallet from '../../hooks/userWallet';
import { ProductStatus } from '../../utils/ProductStatus';

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

                console.log(validDispatches)
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
            console.log(_dispatchId)
            const tx = await traceChainBDContract.confirmDelivery(_dispatchId, {
                gasLimit: 3000000,
                ...zeroGas
            });
            const response = await tx.wait();

            console.log(response)

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
            })
        } finally {
            setLoadingStates(prev => ({ ...prev, [_dispatchId]: false }));
        }
    };

    if (loading) {
        return <Text>Loading...</Text>;
    }

    return (
        <Box p={4}>
            <Box textAlign='center' mb={4}>
                <Text fontSize='4xl' fontWeight='bold' mb={2}>Pending Product</Text>
                <Text>List of all pending products to accept</Text>
            </Box>
            <Divider mb={4} />
            {dispatches.length > 0 ? (
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>Dispatch ID</Th>
                            <Th>Start ID</Th>
                            <Th>End ID</Th>
                            <Th>Receiver</Th>
                            <Th>Timestamp</Th>
                            <Th>Quantity</Th>
                            <Th>Action</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {dispatches.map((dispatch) => (
                            <Tr key={dispatch.dispatchId}>
                                <Td>{dispatch.dispatchId}</Td>
                                <Td>{dispatch.startId}</Td>
                                <Td>{dispatch.endId}</Td>
                                <Td>Self</Td>
                                <Td>{new Date(dispatch.timestamp * 1000).toLocaleString()}</Td>
                                <Td>{dispatch.quantity}</Td>
                                <Td>
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
            ) : (
                <Text>No pending products.</Text>
            )}
        </Box>
    );
}

export default PendingProduct;
