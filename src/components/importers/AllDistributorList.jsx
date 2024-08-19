import React, { useState, useEffect } from 'react';
import { Box, Button, Heading, Table, Thead, Tbody, Tr, Th, Td, Text } from '@chakra-ui/react';
import { etherContract } from '../../contants'; // Adjust the path if necessary

function AllDistributorList() {
    const [importers, setImporters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImporter, setSelectedImporter] = useState(null);
    const [isHidden, setIsHidden] = useState(true);

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
        return <Text>Loading...</Text>;
    }

    return (
        <Box p={4}>
            <Heading as='h1' size='xl' textAlign='center' mb={4}>All Distributor List</Heading>
            <Text textAlign='center' mb={4}>Show as table contains details</Text>
            <Table variant='simple' size='lg'>
                <Thead>
                    <Tr>
                        <Th>SL</Th>
                        <Th>Name</Th>
                        <Th>Address</Th>
                        <Th>Country of Origin</Th>
                        <Th>Details</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {importers
                    .filter(importer => importer.role === 'DISTRIBUTOR')
                    .map((importer, index) => (
                        <Tr key={index}>
                            <Td>{index + 1}</Td>
                            <Td>{importer.name}</Td>
                            <Td>{importer.address_registered.slice(0, 6) + '...' + importer.address_registered.slice(-4)}</Td>
                            <Td>{importer.countryOfOrigin}</Td>
                            <Td>
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

            {selectedImporter && isHidden && (
                <Box mt={4} p={4} borderWidth={1} borderRadius="md" boxShadow="md">
                    <Heading as='h2' size='md' mb={2}>Distributor Details</Heading>
                    <Text><strong>Name:</strong> {selectedImporter.name}</Text>
                    <Text><strong>Address:</strong> {selectedImporter.address_registered}</Text>
                    <Text><strong>Location:</strong> {selectedImporter.locAddress}</Text>
                    <Text><strong>Contract Number:</strong> {selectedImporter.contractNumber}</Text>
                    <Text><strong>Country of Origin:</strong> {selectedImporter.countryOfOrigin}</Text>
                    {/* <Text><strong>TIN Number:</strong> {selectedImporter.tinNumber}</Text>
                    <Text><strong>VAT Registration Number:</strong> {selectedImporter.vatRegNumber}</Text> */}
                    {/* <Text><strong>IPFS Document Hash:</strong> {selectedImporter.ipfsDocHash}</Text> */}
                    <Text><strong>Role:</strong> {selectedImporter.role}</Text>
                </Box>
            )}
        </Box>
    );
}

export default AllDistributorList;
