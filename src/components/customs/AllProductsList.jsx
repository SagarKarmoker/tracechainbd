import {
    Divider,
    Box,
    Heading,
    Text,
    Stack,
    Spinner,
    SimpleGrid,
    Collapse,
    Button,
    Image,
    Center,
    keyframes
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { etherContract } from '../../contants';
import useAuth from '../../hooks/userAuth';
import backgroundImage from "../../img/homeBG1.png";
import blinkingImage from '../../img/svg.png';

const blinkAnimation = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;

const spinAround = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

function AllProductsList() {
    const [totalProducts, setTotalProducts] = useState(0);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedProductIds, setExpandedProductIds] = useState({}); // Track which products are expanded
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

    const toggleExpand = (productId) => {
        setExpandedProductIds(prevState => ({
            ...prevState,
            [productId]: !prevState[productId] // Toggle the expanded state of the selected product
        }));
    };

    return (
        <div className='px-10 py-5 w-full min-h-screen bg-cover bg-center flex flex-col' style={{ backgroundImage: `url(${backgroundImage})` }}>
            <Box p={10}>
                <div className='flex justify-center'>
                    <h1 className='text-center font-bold text-4xl'>All Products List</h1>
                </div>
                <Divider my={4} />

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
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
                            <Spinner
                                width="60px" height="60px" color="#5160be"
                                animation={`${spinAround} 0.9s linear infinite`}
                                position="relative"
                                zIndex="0"
                            />
                            <Text mt={4} fontSize="xl" fontWeight="bold">
                                Please wait while we load the products. This won't take long.
                            </Text>
                        </Center>
                    </Box>
                ) : (
                    products.length > 0 ? (
                        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
                            {products
                                .filter(product => product.customsAddr === account)
                                .map((product, index) => (
                                    <Box key={index} p={4} borderWidth={1} borderRadius="md" boxShadow="sm" className='bg-white'>
                                        <Stack spacing={2}>
                                            <Heading as="h3" size="md">{product.name} (ID: {product.proId})</Heading>
                                            <Text fontSize="sm">{product.description}</Text>
                                            <Button
                                                size="sm"
                                                bg="#5160be"
                                                color="white"
                                                _hover={{ bg: "#7db6f9" }}
                                                onClick={() => toggleExpand(product.proId)}
                                            >
                                                {expandedProductIds[product.proId] ? "Collapse" : "Expand"}
                                            </Button>


                                            <Collapse in={expandedProductIds[product.proId]} animateOpacity>
                                                <Stack spacing={2} mt={4}>
                                                    <Text>Category: {product.category}</Text>
                                                    <Text>Country of Origin: {product.countryOfOrigin}</Text>
                                                    <Text>Manufacturer: {product.manufacturer}</Text>
                                                    <Text>Price: {product.price}</Text>
                                                    <Text>Quantity: {product.quantity}</Text>
                                                    <Text>Imported Date: {new Date(product.importedDate * 1000).toLocaleDateString()}</Text>
                                                    <Text>Importer Address: {product.importerAddr}</Text>
                                                    <Text>Customs Address: {product.customsAddr}</Text>
                                                </Stack>
                                            </Collapse>
                                        </Stack>
                                    </Box>
                                ))}
                        </SimpleGrid>
                    ) : (
                        <Text textAlign="center">No products found.</Text>
                    )
                )}
            </Box>
        </div>
    );
}

export default AllProductsList;
