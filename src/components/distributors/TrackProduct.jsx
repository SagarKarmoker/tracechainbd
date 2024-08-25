import React, { useState } from 'react';
import { Box, Center, Divider, Input, Text, Button, IconButton } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/userAuth';
import { etherContract } from '../../contants';
import backgroundImage from "../../img/homeBG3.png";

function TrackProduct() {
    const [pId, setPid] = useState("");
    const [trackingInfo, setTrackingInfo] = useState([]);
    const [loading, setLoading] = useState(false);
    const { account } = useAuth();

    const handleTrackBtn = async () => {
        if (!pId) {
            alert("Please enter a product ID");
            return;
        }

        setLoading(true);
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
                <Box className='flex flex-col justify-center gap-4 w-full mt-5'>
                    {trackingInfo.length > 0 ? (
                        <Box>
                            {trackingInfo.map((info, index) => (
                                <Box key={index} className='border p-3 rounded mb-2 bg-white'>
                                    <Text fontWeight="bold">Dispatch ID:</Text> {info.dispatchId}<br />
                                    <Text fontWeight="bold">Product ID:</Text> {info.productId}<br />
                                    <Text fontWeight="bold">From:</Text> {info.from}<br />
                                    <Text fontWeight="bold">To:</Text> {info.to}<br />
                                    <Text fontWeight="bold">Timestamp:</Text> {new Date(info.timestamp * 1000).toLocaleString()}<br />
                                    <Text fontWeight="bold">Quantity:</Text> {info.quantity}
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Text>No tracking information available.</Text>
                    )}
                </Box>
            </Center>
        </Box>
    );
}

export default TrackProduct;
