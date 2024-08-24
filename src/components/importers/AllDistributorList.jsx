import React, { useState, useEffect } from 'react';
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td, Text, IconButton, Center, Spinner, Divider } from '@chakra-ui/react';
import { ArrowLeftIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { etherContract } from '../../contants'; // Adjust the path if necessary
import backgroundImage from "../../img/homeBG3.png";

function AllDistributorList() {
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
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <Center height="100vh">
                <Box textAlign="center">
                    <Spinner size="xl" color="blue.500" />
                    <Text mt={4} fontSize="xl" fontWeight="bold">Loading distributor list. Please wait...</Text>
                </Box>
            </Center>
        );
    }

    return (
        <Box className='px-10 py-5 w-full min-h-screen bg-cover bg-center flex flex-col' style={{ backgroundImage: `url(${backgroundImage})` }}>
            <Box className='flex justify-between'>
                <IconButton icon={<ArrowLeftIcon />} onClick={() => navigate(0)} />
                <Text className='text-center font-bold text-4xl'>All Distributor List</Text>
                <Box></Box>
            </Box>
            <Text className='text-center mt-4'>Show as table contains details</Text>
            <Divider className='mt-5' />

            {importers.length > 0 ? (
                <Box className='mt-5 border bg-white'>
                    <Table variant='simple' size='md'>
                        <Thead bg="#5160be">
                            <Tr>
                                <Th color="white" textAlign="center">SL</Th>
                                <Th color="white" textAlign="center">Name</Th>
                                <Th color="white" textAlign="center">Address</Th>
                                <Th color="white" textAlign="center">Country of Origin</Th>
                                <Th color="white" textAlign="center">Details</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {importers
                                .filter(importer => importer.role === 'DISTRIBUTOR')
                                .map((importer, index) => (
                                    <Tr key={index} _hover={{ bg: "gray.100" }}>
                                        <Td textAlign="center">{index + 1}</Td>
                                        <Td textAlign="center">{importer.name}</Td>
                                        <Td textAlign="center">{importer.address_registered.slice(0, 6) + '...' + importer.address_registered.slice(-4)}</Td>
                                        <Td textAlign="center">{importer.countryOfOrigin}</Td>
                                        <Td textAlign="center">
                                            <Button colorScheme='teal' onClick={() => {
                                                getMoreDetailsBtn(importer);
                                                setIsHidden(!isHidden);
                                            }}>
                                                More
                                            </Button>
                                        </Td>
                                    </Tr>
                                ))}
                        </Tbody>
                    </Table>
                </Box>
            ) : (
                <Text className='text-center mt-5'>No distributors found.</Text>
            )}

            {selectedImporter && !isHidden && (
                <Box mt={4} p={4} borderWidth={1} borderRadius="md" boxShadow="md" bg="white">
                    <Text className='text-lg font-bold mb-2'>Distributor Details</Text>
                    <Text><strong>Name:</strong> {selectedImporter.name}</Text>
                    <Text><strong>Address:</strong> {selectedImporter.address_registered}</Text>
                    <Text><strong>Location:</strong> {selectedImporter.locAddress}</Text>
                    <Text><strong>Contract Number:</strong> {selectedImporter.contractNumber}</Text>
                    <Text><strong>Country of Origin:</strong> {selectedImporter.countryOfOrigin}</Text>
                    <Text><strong>Role:</strong> {selectedImporter.role}</Text>
                </Box>
            )}
        </Box>
    );
}

export default AllDistributorList;
