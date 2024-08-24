import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    IconButton,
    Divider,
    TableContainer,
    Spinner,
    Center,
} from '@chakra-ui/react';
import { ArrowLeftIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import backgroundImage from "../../img/homeBG3.png";
import { etherContract } from '../../contants';

function AllImporterList() {
    const [importers, setImporters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImporter, setSelectedImporter] = useState(null);
    const [isHidden, setIsHidden] = useState(true);

    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const allImporters = await etherContract.getOthersParty();
            const importerDetailsPromises = allImporters.map(importer =>
                etherContract.rolesData(importer)
            );
            const importerDetails = await Promise.all(importerDetailsPromises);
            setImporters(importerDetails);
        } catch (error) {
            console.error('Error fetching importers:', error);
        } finally {
            setLoading(false);
        }
    };

    const getMoreDetailsBtn = (importer) => {
        setSelectedImporter(importer);
        setIsHidden(!isHidden);
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <Center height="100vh">
                <Box textAlign="center">
                    <Spinner size="xl" color="blue.500" />
                    <Text mt={4} fontSize="xl" fontWeight="bold">Please wait while we prepare the importer list. This won't take long.</Text>
                </Box>
            </Center>
        );
    }

    return (
        <div className='px-10 py-5 w-full min-h-screen bg-cover bg-center flex flex-col' style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className='flex justify-between'>
                <IconButton icon={<ArrowLeftIcon />} onClick={() => navigate(0)} />
                <Heading as='h1' size='xl' textAlign='center'>All Importer List</Heading>
                <p></p>
            </div>
            <Divider className='mt-5' />
            <Text textAlign='center' mt={2} mb={4}>Show as table contains details</Text>
            <TableContainer className="rounded-md shadow-lg bg-white">
                <Table variant='simple' size='md'>
                    <Thead bg="#5160be">
                        <Tr>
                            <Th color="white" fontSize="md" textAlign="center">SL No</Th>
                            <Th color="white" fontSize="md" textAlign="center">Name</Th>
                            <Th color="white" fontSize="md" textAlign="center">Address</Th>
                            <Th color="white" fontSize="md" textAlign="center">Country of Origin</Th>
                            <Th color="white" fontSize="md" textAlign="center">Details</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {importers
                            .filter(importer => importer.role === 'IMPORTER')
                            .map((importer, index) => (
                                <Tr key={index} _hover={{ bg: "gray.100" }}>
                                    <Td textAlign="center">{index + 1}</Td>
                                    <Td textAlign="center">{importer.name}</Td>
                                    <Td textAlign="center">{importer.address_registered.slice(0, 6) + '...' + importer.address_registered.slice(-4)}</Td>
                                    <Td textAlign="center">{importer.countryOfOrigin}</Td>
                                    <Td textAlign="center">
                                        <Button
                                            colorScheme="blue"
                                            onClick={() => getMoreDetailsBtn(importer)}
                                        >
                                            More
                                        </Button>
                                    </Td>
                                </Tr>
                            ))}
                    </Tbody>
                </Table>
            </TableContainer>

            {selectedImporter && isHidden && (
                <Box mt={4} p={4} borderWidth={1} borderRadius="md" boxShadow="md" bg="white">
                    <Heading as='h2' size='md' mb={2}>Importer Details</Heading>
                    <Text><strong>Name:</strong> {selectedImporter.name}</Text>
                    <Text><strong>Address:</strong> {selectedImporter.address_registered}</Text>
                    <Text><strong>Location:</strong> {selectedImporter.locAddress}</Text>
                    <Text><strong>Contract Number:</strong> {selectedImporter.contractNumber}</Text>
                    <Text><strong>Country of Origin:</strong> {selectedImporter.countryOfOrigin}</Text>
                    <Text><strong>TIN Number:</strong> {selectedImporter.tinNumber}</Text>
                    <Text><strong>VAT Registration Number:</strong> {selectedImporter.vatRegNumber}</Text>
                    <Text><strong>IPFS Document Hash:</strong> {selectedImporter.ipfsDocHash}</Text>
                    <Text><strong>Role:</strong> {selectedImporter.role}</Text>
                </Box>
            )}
        </div>
    );
}

export default AllImporterList;
