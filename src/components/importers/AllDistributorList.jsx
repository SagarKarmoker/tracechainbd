import React, { useState, useEffect } from 'react';
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td, Text, IconButton, Center, Spinner, Divider, Heading, Image, keyframes } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { etherContract } from '../../contants'; // Adjust the path if necessary
import backgroundImage from "../../img/homeBG3.png";
import blinkingImage from '../../img/svg.png'; // Replace with your image path

// Define the vanish animation
const vanishAnimation = keyframes`
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.9);
  }
`;

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

function AllDistributorList() {
    const [importers, setImporters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImporter, setSelectedImporter] = useState(null);
    const [isHidden, setIsHidden] = useState(true);
    const [isCrossed, setIsCrossed] = useState(false);

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
                        Please wait while we load the distributor list. This won't take long.
                    </Text>
                </Box>
            </Center>
        );
    }

    return (
        <Box className='px-10 py-5 w-full min-h-screen bg-cover bg-center flex flex-col' style={{ backgroundImage: `url(${backgroundImage})` }}>
            <Box className='flex justify-center'>
                <Heading as='h1' size='xl' textAlign='center' mb={4}>All Distributor List</Heading>
            </Box>
            <Text textAlign='center' mb={4}>List of all the distributors whom you can send products</Text>
            <Divider className='mt-5' borderWidth='1px' borderColor='#5160be' />

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
                                            <Button colorScheme='blue' onClick={() => {
                                                getMoreDetailsBtn(importer);
                                                setIsHidden(!isHidden);
                                                setIsCrossed(false);
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

            {selectedImporter && isHidden && (
                <Box
                    mt={4}
                    p={4}
                    borderWidth={3}
                    borderColor={'#5160be'}
                    borderRadius="md"
                    boxShadow="md"
                    backgroundColor={'white'}
                    position="relative"
                    overflow="hidden"
                    animation={isCrossed ? `${vanishAnimation} 0.5s forwards` : 'none'}
                >
                    <Heading as='h2' size='md' mb={2} display="flex" alignItems="center" position="relative">
                        Distributor Details
                        <IconButton
                            icon={<CloseIcon />}
                            aria-label="Close"
                            size="sm"
                            colorScheme="red"
                            variant="ghost"
                            position="absolute"
                            right={2}
                            onClick={() => {
                                setIsCrossed(true);
                                setTimeout(() => setIsHidden(true), 500); // Hide the box after animation
                            }}
                        />
                    </Heading>
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
