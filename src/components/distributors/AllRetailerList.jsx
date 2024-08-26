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
    Divider, 
    Spinner, 
    Center, 
    IconButton, 
    Image, 
    keyframes 
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { etherContract } from '../../contants'; // Adjust the path if necessary
import backgroundImage from "../../img/homeBG5.png";
import blinkingImage from '../../img/svg.png'; // Replace with your image path

// Define the blinking animation for the image
const blinkAnimation = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;

// Define the vanishing animation for the selected importer details box
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

function AllRetailerList() {
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
                <Box textAlign="center">
                    {/* Image in the center */}
                    <Center textAlign="center" position="relative" display="inline-block">
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
                            position="relative"
                            zIndex="0"
                        />
                        <Text mt={4} fontSize="xl" fontWeight="bold">
                            Please wait while we load the retailer list. This won't take long.
                        </Text>
                    </Center>
                </Box>
            </Center>
        );
    }

    return (
        <Box className='px-10 py-5 w-full min-h-screen bg-cover bg-center flex flex-col' style={{ backgroundImage: `url(${backgroundImage})` }}>
            <Box className='flex justify-center'>
                <Heading as='h1' size='xl' textAlign='center' mb={4}>All Retailer List</Heading>
            </Box>
            <Text textAlign='center' mb={4}>Show as table contains details</Text>
            <Divider className='mt-5' borderWidth='1px' borderColor='#5160be' />
            <Box className='mt-5 border bg-white'>
                <Table variant='simple' size='lg'>
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
                        .filter(importer => importer.role === 'RETAILER')
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
                        Retailer Details
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
                                setTimeout(() => setIsHidden(true), 500);
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

export default AllRetailerList;
