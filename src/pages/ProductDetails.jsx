import { useState, useEffect } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineLocalShipping } from "react-icons/md";
import { AiOutlineFileDone } from "react-icons/ai";
import { etherContract } from '../contants';
import { useParams } from 'react-router-dom';
import { ProductStatus } from '../utils/ProductStatus';

function ProductDetails() {
    const { id } = useParams();
    const [productId, setProductId] = useState(id);
    const [productLifeCycle, setProductLifeCycle] = useState({});
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const checkForStatus = (status) => {
        switch (Number(status)) {
            case ProductStatus.Default:
                return 'Default';
            case ProductStatus.Dispatched:
                return 'Dispatched';
            case ProductStatus.Sold:
                return 'Sold';
            case ProductStatus.Verified:
                return 'Verified';
            case ProductStatus.AcceptedByCustoms:
                return 'Accepted by Customs';
            case ProductStatus.RejectedByCustoms:
                return 'Rejected by Customs';
            case ProductStatus.AcceptedByImporter:
                return 'Accepted by Importer';
            case ProductStatus.RejectedByImporter:
                return 'Rejected by Importer';
            case ProductStatus.AcceptedByDistributor:
                return 'Accepted by Distributor';
            case ProductStatus.RejectedByDistributor:
                return 'Rejected by Distributor';
            case ProductStatus.AcceptedByRetailer:
                return 'Accepted by Retailer';
            case ProductStatus.RejectedByRetailer:
                return 'Rejected by Retailer';
            default:
                return 'Unknown Status';
        }
    };

    useEffect(() => {
        const fetchHistoryData = async () => {
            try {
                setLoading(true);

                const multiEvents = await etherContract.queryFilter('MultiProductDispatched');
                const singleEvents = await etherContract.queryFilter('ProductDispatched');
                const acceptedEvents = await etherContract.queryFilter('ProductAccepted');

                const multiDispatchesList = multiEvents
                .filter(event => {
                    const startId = Number(event.args.startId.toString());
                    const endId = Number(event.args.endId.toString());
                    const productIdNum = Number(productId); // Ensure productId is a number
                
                    return productIdNum >= startId && productIdNum <= endId;
                })
                .map(event => ({
                    type: 'Multi Dispatch',
                    dispatchId: event.args.dispatchId.toString(),
                    productId: productId,
                    from: event.args.from,
                    to: event.args.to,
                    timestamp: Number(event.args.dispatchedOn.toString()),
                    quantity: event.args.quantity.toString(),
                    status: checkForStatus(event.args.status.toString()),
                    icon: <MdOutlineLocalShipping />,
                    background: 'rgb(33, 150, 243)',
                }))
                

                console.log(multiDispatchesList)

                const singleDispatchesList = singleEvents.map(event => ({
                    type: 'Single Dispatch',
                    dispatchId: event.args.dispatchId.toString(),
                    productId: event.args.productId.toString(),
                    from: event.args.from,
                    to: event.args.to,
                    timestamp: Number(event.args.dispatchedOn.toString()),
                    quantity: event.args.quantity.toString(),
                    status: event.args.to !== "0x0000000000000000000000000000000000000000" ? checkForStatus(event.args.status.toString()) : 'Sold',
                    icon: event.args.to !== "0x0000000000000000000000000000000000000000" ? <MdOutlineLocalShipping /> : <IoMdCheckmarkCircleOutline />,
                    background: 'rgb(33, 150, 243)',
                }));

                const productAcceptedList = acceptedEvents.map(event => ({
                    type: 'Product Accepted',
                    dispatchId: event.args.dispatchId.toString(),
                    productId: event.args.productId.toString(),
                    acceptedBy: event.args.acceptedBy,
                    timestamp: Number(event.args.acceptedOn.toString()),
                    status: checkForStatus(event.args.status.toString()),
                    icon: <AiOutlineFileDone />,
                    background: 'rgb(16, 204, 82)',
                }));

                const allEvents = [...multiDispatchesList, ...singleDispatchesList, ...productAcceptedList];
                const sortedEvents = allEvents
                    .filter(event => event.productId === productId)
                    .sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp (newest first)

                setEvents(sortedEvents);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching history data:', error);
                setLoading(false);
            }
        };
        fetchHistoryData();
    }, [productId]);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const lifeCycle = await etherContract.productLifeCycles(productId);
                setProductLifeCycle({
                    productId: Number(lifeCycle.productId.toString()),
                    customDispatchId: Number(lifeCycle.customDispatchId.toString()),
                    importerDispatchId: Number(lifeCycle.importerDispatchId.toString()),
                    distributorDispatchId: Number(lifeCycle.distributorDispatchId.toString()),
                    retailerDispatchId: Number(lifeCycle.retailerDispatchId.toString()),
                    soldDispatchId: lifeCycle.consumerDispatchId,
                    status: checkForStatus(lifeCycle.status.toString()),
                });
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };
        fetchProductDetails();
    }, [productId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1 className='text-center font-bold text-2xl p-4'>Product #{productId} TraceChain</h1>

            <VerticalTimeline>
                {events.map((event, index) => (
                    <VerticalTimelineElement
                        key={index}
                        date={new Date(event.timestamp * 1000).toLocaleString()}
                        iconStyle={{ background: event.background, color: '#fff' }}
                        icon={event.icon}
                    >
                        <h3 className="vertical-timeline-element-title">
                            {event.type === 'Multi Dispatch' ? `Dispatch ID: ${event.dispatchId}` :
                                event.type === 'Single Dispatch' ? `Dispatch ID: ${event.dispatchId}` :
                                    event.type === 'Product Accepted' ? `Accepted By: ${event.acceptedBy}` : ''}
                        </h3>
                        <h4 className="vertical-timeline-element-subtitle">{event.from} → {event.to}</h4>
                        <p>Quantity: {event.quantity} {event.status && `, Status: ${event.status}`}</p>
                    </VerticalTimelineElement>
                ))}
            </VerticalTimeline>
        </div>
    );
}

export default ProductDetails;
