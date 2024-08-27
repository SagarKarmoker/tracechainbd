import { useEffect, useState } from 'react';
import {
    Box,
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Spinner,
    TableContainer,
} from '@chakra-ui/react';
import { etherContract } from '../../contants';

function EntryHistory() {
    const [products, setProducts] = useState([]);
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


    useEffect(() => {
        fetchRolesData();
        const fetchProductHistory = async () => {
            try {
                // Fetch the 'ProductAdded' events
                const events = await etherContract.queryFilter('ProductAdded');
                
                // Group products by boxId
                const groupedProducts = events.reduce((acc, event) => {
                    const {
                        boxId,
                        id,
                        name,
                        description,
                        category,
                        countryOfOrigin,
                        manufacturer,
                        price,
                        quantity,
                        importedDate,
                        importerAddr,
                        customsAddr,
                    } = event.args;

                    if (!acc[boxId]) {
                        acc[boxId] = {
                            boxId: boxId.toString(),
                            name,
                            description,
                            category,
                            countryOfOrigin,
                            manufacturer,
                            price: Number(price), // Format price if it's in wei
                            quantity: quantity.toString(),
                            importedDate: new Date(importedDate.toNumber() * 1000).toLocaleString(), // Convert timestamp to date
                            importerAddr,
                            customsAddr,
                            ids: [],
                        };
                    }
                    
                    acc[boxId].ids.push(id.toString());
                    
                    return acc;
                }, {});

                // Convert the object into an array of products
                const productData = Object.values(groupedProducts);

                // Update state with the grouped data
                setProducts(productData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching ProductAdded events:', error);
                setLoading(false);
            }
        };

        fetchProductHistory();
    }, []);

    return (
        <Box p={6}>
            <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={4}>
                Product History
            </Text>

            {loading ? (
                <Spinner size="xl" thickness="4px" color="blue.500" />
            ) : (
                <TableContainer>
                    <Table variant="striped" colorScheme="gray">
                        <Thead>
                            <Tr>
                                <Th>Box ID</Th>
                                <Th>IDs</Th>
                                <Th>Name</Th>
                                <Th>Description</Th>
                                <Th>Category</Th>
                                <Th>Country of Origin</Th>
                                <Th>Manufacturer</Th>
                                <Th>Price</Th>
                                {/* <Th>Quantity</Th> */}
                                <Th>Imported Date</Th>
                                <Th>Importer Address</Th>
                                {/* <Th>Customs Address</Th> */}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {products.map((product, index) => (
                                <Tr key={index}>
                                    <Td>{product.boxId}</Td>
                                    <Td>{product.ids.join(', ')}</Td>
                                    <Td>{product.name}</Td>
                                    <Td>{product.description}</Td>
                                    <Td>{product.category}</Td>
                                    <Td>{product.countryOfOrigin}</Td>
                                    <Td>{product.manufacturer}</Td>
                                    <Td>{product.price} TAKA</Td>
                                    {/* <Td>{product.quantity}</Td> */}
                                    <Td>{product.importedDate}</Td>
                                    <Td>{getRoleData(product.importerAddr)}</Td>
                                    {/* <Td>{product.customsAddr}</Td> */}
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}

export default EntryHistory;
