import { useState, useEffect } from 'react';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Spinner,
    Heading,
    Icon,
    Button,
    useToast
} from '@chakra-ui/react';
import { FiAlertCircle } from 'react-icons/fi';
import { adminSigner } from '../utils/adminWallet';
import { ethers } from 'ethers';
import { TraceChainContract } from '../../contants';
import { ABI } from '../../contractABI';

function AllReport() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    const etherContract = new ethers.Contract(TraceChainContract, ABI, adminSigner);

    const fetchReports = async () => {
        try {
            const listOfReports = await etherContract.getAllReports();
            console.log(listOfReports)
            setReports(listOfReports);
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (productId) => {
        try {
            console.log(productId.toString());
            await etherContract.acceptReport(productId);
            toast({
                title: 'Report accepted successfully',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            fetchReports();
        } catch (error) {
            console.error('Error accepting report:', error);
            toast({
                title: 'Error accepting report',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleDeny = async (productId) => {
        try {
            const reason = prompt('Enter reason for denial:');
            if (reason) {
                await etherContract.deniedReport(productId, reason);
                toast({
                    title: 'Report denied successfully',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                fetchReports();
            }
        } catch (error) {
            console.error('Error denying report:', error);
            toast({
                title: 'Error denying report',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    if (loading) {
        return (
            <Box textAlign="center" py={10}>
                <Spinner size="xl" />
            </Box>
        );
    }

    return (
        <Box p={4}>
            <Heading as="h2" size="lg" mb={6} textAlign="center">
                <Icon as={FiAlertCircle} mr={2} />
                Report History
            </Heading>
            {reports.length > 0 ? (
                <TableContainer>
                    <Table variant="striped" colorScheme="teal">
                        <TableCaption>Your product report history</TableCaption>
                        <Thead>
                            <Tr>
                                <Th>SL no</Th>
                                <Th>Product ID</Th>
                                <Th>Description</Th>
                                <Th>Reported By</Th>
                                <Th>Reported For</Th>
                                <Th>Proof</Th>
                                <Th>Reported On</Th>
                                <Th>Status</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {reports.map((item, index) => (
                                index === 0 ? null : (
                                    <Tr key={index}>
                                        <Td>{index}</Td>
                                        <Td>{item.productID.toString()}</Td>
                                        <Td>{item.reportDesc}</Td>
                                        <Td>{item.reportBy}</Td>
                                        <Td>{item.reportFor}</Td>
                                        <Td>
                                            <a
                                                href={`http://127.0.0.1:8080/ipfs/${item.proofHash}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                View more
                                            </a>
                                        </Td>
                                        <Td>{new Date(item.reportedOn * 1000).toLocaleString()}</Td>
                                        <Td>{["Pending", "Accepted", "Declined"][item.status]}</Td>
                                        <Td>
                                            {item.status === 0 ? (
                                                <Box className='flex gap-4'>
                                                    <Button
                                                        colorScheme="green"
                                                        onClick={() => handleAccept(index)}
                                                    >
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        colorScheme="red"
                                                        onClick={() => handleDeny(index)}
                                                    >
                                                        Deny
                                                    </Button>
                                                </Box>
                                            ) :
                                                (
                                                    <Button
                                                        colorScheme="gray"
                                                    >
                                                        No Action
                                                    </Button>
                                                )
                                            }
                                        </Td>
                                    </Tr>
                                )
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            ) : (
                <Box textAlign="center" mt={10}>
                    No reports found.
                </Box>
            )}
        </Box>
    );
}

export default AllReport;
