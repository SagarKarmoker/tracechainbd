import React, { useEffect, useState } from 'react';
import { Divider, Table, Thead, Tbody, Tr, Th, Td, Box, Text } from '@chakra-ui/react';
import { etherContract } from '../../contants';
import { useActiveAccount } from 'thirdweb/react';

function PendingProduct() {
    const [dispatchCount, setDispatchCount] = useState(0);
    const [dispatchList, setDispatchList] = useState([]);
    const [loading, setLoading] = useState(true);
    const activeAccount = useActiveAccount();

    const getDispatchCounter = async () => {
        try {
            const dispatchCounter = await etherContract.dispatchCounter();
            setDispatchCount(Number(dispatchCounter.toString()));
        } catch (error) {
            console.error('Error fetching dispatch counter:', error);
        }
    };

    const getDispatch = async () => {
        try {
            if (dispatchCount === 0) {
                setLoading(false);
                return;
            }

            const list = [];
            for (let i = 1; i <= dispatchCount; i++) {
                const dispatch = await etherContract.dispatches(i);
                if (dispatch.to.toLowerCase() === activeAccount?.address.toLowerCase()) {
                    list.push({ index: i, ...dispatch });
                }
            }
            setDispatchList(list);
        } catch (error) {
            console.error('Error fetching dispatches:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await getDispatchCounter();
            // Wait for the dispatchCount to update before calling getDispatch
            if (dispatchCount > 0) {
                await getDispatch();
            }
        };

        fetchData();
    }, [dispatchCount]); // You should monitor dispatchCount, but fetchData needs to be called when dispatchCount is set

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
            {dispatchList.length > 0 ? (
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Product ID</Th>
                            <Th>IPFS Hash</Th>
                            <Th>From</Th>
                            <Th>To</Th>
                            <Th>Timestamp</Th>
                            <Th>Quantity</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {dispatchList.map((dispatch) => (
                            <Tr key={dispatch.index}>
                                <Td>{dispatch.index}</Td>
                                <Td>{dispatch.productId.toString()}</Td>
                                <Td>{dispatch.ipfsDocHash}</Td>
                                <Td>{dispatch.from}</Td>
                                <Td>{dispatch.to}</Td>
                                <Td>{new Date(Number(dispatch.timestamp.toString()) * 1000).toLocaleString()}</Td>
                                <Td>{dispatch.quantity.toString()}</Td>
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
