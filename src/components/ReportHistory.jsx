import { useState, useEffect } from 'react';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Spinner,
    Heading,
    Icon,
    Center,
    Text,
    Image,
    keyframes,
    Divider
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
    const [rolesData, setRolesData] = useState([]);

    const fetchRolesData = async () => {
        try {
            const response = await fetch('https://tracechainbd-backend.onrender.com/api/roles');
            const data = await response.json();
            setRolesData(data);
        } catch (error) {
            console.error('Error fetching roles data:', error);
        }
    }

    const getRoleData = (address) => {
        try {
            const role = rolesData.find(role => role.address_registered === address);
            return role ? `${role.name} (${role.role})` : "Unknown Role";
        } catch (error) {
            console.error("Error getting role data:", error);
            return "Error Fetching Role";
        }
    };

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
        fetchRolesData();
        fetchHistoryData();
    }, [loading]);

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
        <Box
            p={5}
            minH="100vh"
            bg={`url(${backgroundImage})`}
            bgSize="cover"
            bgPosition="center"
        >
            <Box className='flex justify-center'>
                <Heading as='h1' size='xl' mb={5} textAlign='center'>
                    <Icon as={FiAlertCircle} mr={2} />
                    Report History
                </Heading>
            </Box>
            <Text textAlign='center' mb={4}>List of reports created for products.</Text>
            <Divider className='mt-5 mb-5' borderWidth='1px' borderColor='#5160be' />
            {report.length > 0 ? (
                <TableContainer bg="white" borderRadius="md" boxShadow="md" p={4}>
                    <Table variant='simple'>
                        <Thead bg="#5160be">
                            <Tr>
                                <Th color="white" textAlign="center">SL No</Th>
                                <Th color="white" textAlign="center">Product ID</Th>
                                <Th color="white" textAlign="center">Description</Th>
                                <Th color="white" textAlign="center">Reported For</Th>
                                <Th color="white" textAlign="center">Reported On</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {report.map((item, index) => (
                                <Tr key={index} _hover={{ bg: "gray.100" }}>
                                    <Td textAlign="center">{index + 1}</Td>
                                    <Td textAlign="center">{item.productID}</Td>
                                    <Td textAlign="center">{item.reportDesc}</Td>
                                    <Td textAlign="center">{getRoleData(item.reportFor)}</Td>
                                    <Td textAlign="center">{new Date(item.timestamp * 1000).toLocaleString()}</Td>
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
