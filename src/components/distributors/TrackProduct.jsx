import React, { useState } from 'react';
import { Box, Center, Divider, Text, useToast } from '@chakra-ui/react';
import { etherContract } from '../../contants';
import backgroundImage from "../../img/homeBG3.png";
import ProductDetails from '../../pages/ProductDetails';
import useAuth from '../../hooks/userAuth';

function TrackProduct() {
    const [pId, setPid] = useState("");
    const [trackingInfo, setTrackingInfo] = useState([]);
    const [loading, setLoading] = useState(false);
    const { account } = useAuth();
    const [showDetails, setShowDetails] = useState(false);
    const toast = useToast();

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
        setTrackingInfo([]); // Clear previous tracking info
        setShowDetails(false); // Reset showDetails

        try {
            const events = await etherContract.queryFilter('ProductDispatched');

            // Process events
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
                .filter(event => event !== null); // Filter out null values

            setTrackingInfo(trackingList);
            setShowDetails(true);
        } catch (error) {
            console.error("Error fetching tracking data:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            className='px-10 py-5 w-full min-h-screen bg-cover bg-center flex flex-col'
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <Box className='flex justify-center'>
                <Text className='text-center font-bold text-4xl'>Track Product</Text>
                <Box></Box>
            </Box>
            <Text className='text-center mt-4'>
                Track the step-by-step dispatch history of a product
            </Text>
            <Divider className='mt-5' borderWidth='1px' borderColor='#5160be' />
            <Center className='flex flex-col gap-4'>
                <Box className='flex flex-col gap-4 w-96 mt-5'>
                    <input
                        type="number"
                        className='p-3 bg-white border-2 border-[#5160be] rounded-lg'
                        placeholder='Enter product ID to get details'
                        value={pId}
                        onChange={(e) => setPid(e.target.value)}
                        required
                    />
                    <button
                        onClick={handleTrackBtn}
                        className="bg-[#5160be] hover:bg-[#7db6f9] text-white font-bold py-2 px-4 rounded"
                    >
                        {loading ? 'Tracking...' : 'Track Product'}
                    </button>
                </Box>

                {
                    showDetails && <ProductDetails pid={pId} role={"Distributor"} />
                }
            </Center>
        </Box>
    );
}

export default TrackProduct;
