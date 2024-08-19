import React, { useState } from 'react';
import useAuth from '../../hooks/userAuth';
import { etherContract } from '../../contants';

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
        <>
            <div className='flex flex-col gap-4'>
                <h1 className='text-center text-4xl font-bold mb-4'>Track Product by Importer</h1>
                <div className='flex justify-center'>
                    <div className='flex flex-col gap-4 w-96'>
                        <input
                            type="number"
                            className='p-3 border rounded-lg'
                            placeholder='Enter product ID to get details'
                            value={pId}
                            onChange={(e) => setPid(e.target.value)}
                            required
                        />
                        <button
                            onClick={handleTrackBtn}
                            className='bg-blue-600 p-3 text-white font-bold rounded-xl'
                        >
                            {loading ? 'Tracking...' : 'Track Product'}
                        </button>
                    </div>
                </div>

                <div className='flex flex-col justify-center gap-4'>
                    <p className='font-semibold text-center'>Get the step by step track of a product</p>
                    <div>
                        {trackingInfo.length > 0 ? (
                            <ul>
                                {trackingInfo.map((info) => (
                                    <li key={info.id} className='border p-3 rounded mb-2'>
                                        <strong>Dispatch ID:</strong> {info.dispatchId}<br />
                                        <strong>Product ID:</strong> {info.productId}<br />
                                        <strong>From:</strong> {info.from}<br />
                                        <strong>To:</strong> {info.to}<br />
                                        <strong>Timestamp:</strong> {new Date(info.timestamp * 1000).toLocaleString()}<br />
                                        <strong>Quantity:</strong> {info.quantity}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No tracking information available.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default TrackProduct;
