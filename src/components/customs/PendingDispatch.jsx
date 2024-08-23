import React, { useState, useEffect } from 'react';
import { useToast, Box, Table, Thead, Tbody, Tr, Th, Td, Spinner, Heading } from '@chakra-ui/react';
import { etherContract } from '../../contants';
import useAuth from '../../hooks/userAuth';

function PendingDispatch() {
    const { account } = useAuth();
    const [boxes, setBoxes] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        const fetchBoxes = async () => {
            try {
                const totalBoxes = await etherContract.boxCounter();
                const boxCount = Number(totalBoxes.toString());
                const fetchedBoxes = [];

                for (let i = 1; i < boxCount; i++) {
                    const box = await etherContract.boxes(i);
                    if (box) {
                        const checkOwnerFirst = await etherContract.productLifeCycles(box.start_productId);
                        if (Number(checkOwnerFirst.importerDispatchId.toString()) === 0 && box.customsAddr === account) {
                            const formattedBox = {
                                boxId: i,
                                start_productId: Number(box.start_productId.toString()),
                                end_productId: Number(box.end_productId.toString()),
                                productName: box.name,
                                quantity: Number(box.quantity.toString()),
                                importedDate: Number(box.importedDate.toString()),
                                importerAddr: box.importerAddr,
                                customsAddr: box.customsAddr,
                            };
                            fetchedBoxes.push(formattedBox);
                        }
                    }
                }

                setBoxes(fetchedBoxes);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching boxes:', error);
                toast({
                    title: "Error",
                    description: `Failed to fetch boxes: ${error.message}`,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
                setLoading(false);
            }
        };

        fetchBoxes();
    }, [account]);

    return (
        <Box p={4}>
            <Heading mb={4}>Pending Dispatches</Heading>
            {loading ? (
                <Spinner size="xl" />
            ) : (
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Box ID</Th>
                            <Th>Start Product ID</Th>
                            <Th>End Product ID</Th>
                            <Th>Product Name</Th>
                            <Th>Quantity</Th>
                            <Th>Imported Date</Th>
                            <Th>Importer Address</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {boxes.map(box => (
                            <Tr key={box.boxId}>
                                <Td>{box.boxId}</Td>
                                <Td>{box.start_productId}</Td>
                                <Td>{box.end_productId}</Td>
                                <Td>{box.productName}</Td>
                                <Td>{box.quantity}</Td>
                                <Td>{new Date(box.importedDate * 1000).toLocaleDateString()}</Td>
                                <Td>{box.importerAddr}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            )}
        </Box>
    );
}

export default PendingDispatch;
