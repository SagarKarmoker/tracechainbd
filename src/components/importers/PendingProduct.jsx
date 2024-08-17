import React, { useEffect, useState } from 'react';
import { Divider, Table, Thead, Tbody, Tr, Th, Td, Box, Text } from '@chakra-ui/react';
import { etherContract } from '../../contants';
import useAuth from '../../hooks/userAuth';
import { ethers } from 'ethers';

function PendingProduct() {
    const [dispatches, setDispatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const { account } = useAuth();

    const getDispatchCounter = async () => {
        try {
            const dispatchCounter = await etherContract.dispatchCounter();
            // Handle dispatchCounter if necessary
        } catch (error) {
            console.error('Error fetching dispatch counter:', error);
        }
    };

    useEffect(() => {
        const fetchHistoryData = async () => {
            try {
                // Fetch events
                const events = await etherContract.queryFilter('MultiProductDispatched');

                // Process events into dispatchesList
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

                // console.log(dispatchesList);

                // Process each dispatch in dispatchesList
                const validDispatches = [];

                for (const dispatch of dispatchesList) {
                    const confirmed1st = await etherContract.productLifeCycles(ethers.BigNumber.from(dispatch.startId));
                    const confirmedLast = await etherContract.productLifeCycles(ethers.BigNumber.from(dispatch.endId));

                    if (Number(confirmed1st.importerDispatchId.toString()) === 0 && Number(confirmedLast.importerDispatchId.toString()) === 0 && confirmed1st.owner == account) {
                        validDispatches.push(dispatch);
                    }
                }

                // Set state with valid dispatches
                setDispatches(validDispatches);
                setLoading(false); // Update loading state once data is fetched
            } catch (error) {
                console.error('Error fetching history data:', error);
                setLoading(false); // Ensure loading state is updated even if there's an error
            }
        };

        fetchHistoryData();
    }, [account]);

    console.log(dispatches);

    const handleAccept = async () => {
        try {
            
        } catch (error) {
            console.error('Error accepting dispatch:', error);
        }
    }

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
                                {/* <Td>{dispatch.receiver}</Td> */}
                                <Td>Self</Td>
                                <Td>{new Date(dispatch.timestamp * 1000).toLocaleString()}</Td>
                                <Td>{dispatch.quantity}</Td>
                                <Td>
                                    <button className='bg-lime-600 font-bold p-3 rounded-lg text-white' onClick={handleAccept}>
                                        Accept
                                    </button>
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
