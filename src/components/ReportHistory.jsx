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
    Center,
    Text,
    Image,
    keyframes,
} from '@chakra-ui/react';
import { FiAlertCircle } from 'react-icons/fi';
import useAuth from '../hooks/userAuth';
import { etherContract } from '../contants';
import backgroundImage from "../img/homeBG3.png"; // Import the background image
import blinkingImage from '../img/svg.png'; // Replace with your image path

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
                        Please wait while we load the report history. This won't take long.
                    </Text>
                </Box>
            </Center>
        );
    }

    return (
        <Box className='px-10 py-5 w-full min-h-screen bg-cover bg-center flex flex-col' style={{ backgroundImage: `url(${backgroundImage})` }}>
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
