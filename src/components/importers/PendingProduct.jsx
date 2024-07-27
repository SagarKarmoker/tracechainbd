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

    console.log(dispatchCount)

    const getDispatch = async () => {
        try {
            if (dispatchCount === 0) {
                setLoading(false);
                return;
            }

            const list = [];
            for (let i = 1; i <= dispatchCount; i++) {
                const dispatch = await etherContract.dispatches(i);
                if(dispatch.to == activeAccount?.address){
                    list.push(dispatch);
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
            await getDispatch();
        };

        fetchData();
    }, []);

    console.log(dispatchList)

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
                            <Th>Customs</Th>
                            <Th>To (your company)</Th>
                            <Th>Timestamp</Th>
                            <Th>Quantity</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {dispatchList.map((dispatch, index) => (
                            <Tr key={index+1}>
                                <Td>{index}</Td>
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
