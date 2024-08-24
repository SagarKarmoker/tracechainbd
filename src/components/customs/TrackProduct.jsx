import React, { useState } from 'react';
import { useToast, Box, Button, Input, Spinner, List, ListItem, Heading, IconButton } from '@chakra-ui/react';
import { ArrowLeftIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { etherContract } from '../../contants';
import useAuth from '../../hooks/userAuth';
import backgroundImage from "../../img/homeBG2.png"; // Ensure the image path is correct

function TrackProduct() {
    const toast = useToast();
    const [pId, setPid] = useState("");
    const [trackingInfo, setTrackingInfo] = useState([]);
    const [loading, setLoading] = useState(false);
    const { account } = useAuth();
    const navigate = useNavigate();

    const handleTrackBtn = async () => {
        if (!pId) {
            toast({
                title: "Warning",
                description: "Please enter a product ID",
                status: "warning",
                duration: 9000,
                isClosable: true,
            });
            return;
        }

        setLoading(true);
        try {
            const events = await etherContract.queryFilter('ProductDispatched');

            const trackingList = events
                .map(event => {
                    const { dispatchId, productId, from, to, dispatchedOn, quantity } = event.args || {};
                    if (from === account && productId.toString() === pId && quantity > 0) {
                        return {
                            dispatchId: dispatchId.toString(),
                            productId: productId.toString(),
                            from,
                            to,
                            timestamp: dispatchedOn.toNumber(),
                            quantity: quantity.toString()
                        };
                    }
                    return null;
                })
                .filter(event => event !== null);

            setTrackingInfo(trackingList);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch tracking data",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='px-10 py-5 w-full min-h-screen bg-cover bg-center flex flex-col' style={{ backgroundImage: `url(${backgroundImage})` }}>
            <Box p={10}>
                <div className='flex justify-between'>
                    <IconButton icon={<ArrowLeftIcon />} onClick={() => navigate(0)} /> {/* Back button to navigate to the previous page */}
                    <h1 className='text-center font-bold text-4xl'>Track Product by Customs</h1>
                    <p></p>
                </div>
                <Box display="flex" justifyContent="center" className='mt-4'>
                    <Box width="96" display="flex" flexDirection="column" gap={4}>
                        <Input
                            type="number"
                            bg="white"
                            placeholder="Enter Product ID to get details"
                            value={pId}
                            onChange={(e) => setPid(e.target.value)}
                            isRequired
                            border="2px"
                            borderColor="#5160be"  // Border color set to #5160be
                        />
                        <Button
                            onClick={handleTrackBtn}
                            bg="#5160be"
                            _hover={{ bg: "#7db6f9" }} // Hover background color
                            color="white"
                            fontWeight="bold"
                            py={2}
                            px={4}
                            rounded="md"
                        >
                            {loading ? <Spinner size="sm" /> : 'Track Product'}
                        </Button>
                    </Box>
                </Box>

                <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
                    <Heading as="h2" size="lg" textAlign="center" mb={4}>Tracking Information</Heading>
                    {trackingInfo.length > 0 ? (
                        <List spacing={3} w="full" maxW="600px">
                            {trackingInfo.map((info, index) => (
                                <ListItem key={index} border="1px solid" borderColor="#5160be" p={3} rounded="md" bg="white">
                                    <strong>Dispatch ID:</strong> {info.dispatchId}<br />
                                    <strong>Product ID:</strong> {info.productId}<br />
                                    <strong>From:</strong> {info.from}<br />
                                    <strong>To:</strong> {info.to}<br />
                                    <strong>Timestamp:</strong> {new Date(info.timestamp * 1000).toLocaleString()}<br />
                                    <strong>Quantity:</strong> {info.quantity}
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Box mt={4} fontSize="lg" color="gray.600">
                            No tracking information available.
                        </Box>
                    )}
                </Box>
            </Box>
        </div>
    );
}

export default TrackProduct;
