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
} from '@chakra-ui/react';
import { FiAlertCircle } from 'react-icons/fi';
import useAuth from '../hooks/userAuth';
import { etherContract } from '../contants';

function ReportHistory() {
    const { account } = useAuth();
    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHistoryData = async () => {
        try {
            const events = await etherContract.queryFilter('ReportForProduct');
            const list = events.map(event => {
                const { productID, reportDesc, reportBy, reportFor, reportedOn } = event.args;
                return {
                    productID: productID.toString(),
                    reportDesc: reportDesc.toString(),
                    reportBy: reportBy,
                    reportFor: reportFor,
                    timestamp: Number(reportedOn.toString()),
                };
            });

            const filteredList = list.filter(report => report.reportBy === account);
            setReport(filteredList);
        } catch (error) {
            console.error('Error fetching history data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistoryData();
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
            {report.length > 0 ? (
                <TableContainer>
                    <Table variant="striped" colorScheme="teal">
                        <TableCaption>Your product report history</TableCaption>
                        <Thead>
                            <Tr>
                                <Th>SL No</Th>
                                <Th>Product ID</Th>
                                <Th>Description</Th>
                                <Th>Reported For</Th>
                                <Th>Reported On</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {report.map((item, index) => (
                                <Tr key={index}>
                                    <Td>{index + 1}</Td>
                                    <Td>{item.productID}</Td>
                                    <Td>{item.reportDesc}</Td>
                                    <Td>{item.reportFor}</Td>
                                    <Td>{new Date(item.timestamp * 1000).toLocaleString()}</Td>
                                </Tr>
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

export default ReportHistory;
