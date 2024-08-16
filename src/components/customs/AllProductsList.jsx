import { Divider, Box, Heading, Text, Stack, List, ListItem, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { etherContract } from '../../contants';
import useAuth from '../../hooks/userAuth';

function AllProductsList() {
    const [totalProducts, setTotalProducts] = useState(0);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { account } = useAuth();

    useEffect(() => {
        const productCounter = async () => {
            try {
                const total = await etherContract.productCounter();
                if (total) {
                    setTotalProducts(Number(total.toString())); // Convert BigNumber to number
                }
            } catch (error) {
                console.error("Error fetching total products:", error);
            }
        }
        productCounter();
    }, []);

    useEffect(() => {
        if (totalProducts > 0) {
            const fetchProducts = async () => {
                try {
                    setLoading(true);
                    const fetchedProducts = [];
                    for (let i = 1; i < totalProducts; i++) {
                        const product = await etherContract.products(i);
                        if (product) {
                            const formattedProduct = {
                                proId: i,
                                name: product.name,
                                description: product.description,
                                category: product.category,
                                countryOfOrigin: product.countryOfOrigin,
                                manufacturer: product.manufacturer,
                                price: Number(product.price.toString()), // Assuming price is in wei
                                quantity: Number(product.quantity.toString()), // Convert BigNumber to number
                                importedDate: Number(product.importedDate.toString()), // Convert BigNumber to number
                                importerAddr: product.importerAddr,
                                customsAddr: product.customsAddr
                            };
                            fetchedProducts.push(formattedProduct);
                        }
                    }
                    setProducts(fetchedProducts);
                } catch (error) {
                    console.error("Error fetching products:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchProducts();
        }
    }, [totalProducts]);

    console.log(products)

    return (
        <Box p={10}>
            <Box mb={4} textAlign="center">
                <Heading as="h1" size="2xl">All Products List</Heading>
                <Text fontSize="lg" fontWeight="semibold">Accepted by Customs</Text>
            </Box>

            <Divider my={4} />

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <Spinner size="xl" />
                </Box>
            ) : (
                products.length > 0 ? (
                    <List spacing={4}>
                            {products
                                .filter(product => product.customsAddr === account)
                                .map((product, index) => (
                            <ListItem key={index} p={4} borderWidth={1} borderRadius="md" boxShadow="sm">
                                <Stack spacing={2}>
                                    <Heading as="h3" size="md">{product.name} (ID: {product.proId})</Heading>
                                    <Text fontSize="sm">{product.description}</Text>
                                    <Text>Category: {product.category}</Text>
                                    <Text>Country of Origin: {product.countryOfOrigin}</Text>
                                    <Text>Manufacturer: {product.manufacturer}</Text>
                                    <Text>Price: {product.price}</Text>
                                    <Text>Quantity: {product.quantity}</Text>
                                    <Text>Imported Date: {new Date(product.importedDate * 1000).toLocaleDateString()}</Text>
                                    <Text>Importer Address: {product.importerAddr}</Text>
                                    <Text>Customs Address: {product.customsAddr}</Text>
                                </Stack>
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Text textAlign="center">No products found.</Text>
                )
            )}
        </Box>
    );
}

export default AllProductsList;
