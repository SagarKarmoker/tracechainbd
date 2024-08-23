import { useState, useEffect } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { MdWork as WorkIcon, MdStar as StarIcon } from 'react-icons/md';
import { etherContract } from '../contants';

function ProductDetails() {
    const [productId, setProductId] = useState("2");
    const [productLifeCycle, setProductLifeCycle] = useState({});
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistoryData = async () => {
            try {
                setLoading(true);

                const multiEvents = await etherContract.queryFilter('MultiProductDispatched');
                const singleEvents = await etherContract.queryFilter('ProductDispatched');
                const acceptedEvents = await etherContract.queryFilter('ProductAccepted');

                const multiDispatchesList = multiEvents.map(event => ({
                    type: 'Multi Dispatch',
                    dispatchId: event.args.dispatchId.toString(),
                    startId: event.args.startId.toString(),
                    endId: event.args.endId.toString(),
                    from: event.args.from,
                    to: event.args.to,
                    timestamp: Number(event.args.dispatchedOn.toString()),
                    quantity: event.args.quantity.toString(),
                    icon: <WorkIcon />,
                    background: 'rgb(33, 150, 243)',
                }));

                const singleDispatchesList = singleEvents.map(event => ({
                    type: 'Single Dispatch',
                    dispatchId: event.args.dispatchId.toString(),
                    productId: event.args.productId.toString(),
                    from: event.args.from,
                    to: event.args.to,
                    timestamp: Number(event.args.dispatchedOn.toString()),
                    quantity: event.args.quantity.toString(),
                    status: event.args.status.toString(),
                    icon: <WorkIcon />,
                    background: 'rgb(33, 150, 243)',
                }));

                const productAcceptedList = acceptedEvents.map(event => ({
                    type: 'Product Accepted',
                    dispatchId: event.args.dispatchId.toString(),
                    productId: event.args.productId.toString(),
                    acceptedBy: event.args.acceptedBy,
                    timestamp: Number(event.args.acceptedOn.toString()),
                    status: event.args.status.toString(),
                    icon: <StarIcon />,
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
                    status: Number(lifeCycle.status.toString()),
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
        <VerticalTimeline>
            {events.map((event, index) => (
                <VerticalTimelineElement
                    key={index}
                    date={new Date(event.timestamp * 1000).toLocaleString()}
                    iconStyle={{ background: event.background, color: '#fff' }}
                    icon={event.icon}
                >
                    <h3 className="vertical-timeline-element-title">{
                            event.type === 'Multi Dispatch' ? `Dispatch ID: ${event.dispatchId}` :
                            event.type === 'Single Dispatch' ? `Dispatch ID: ${event.dispatchId}` :
                            event.type === 'Product Accepted' ? `Accepted By: ${event.acceptedBy}` : ''
                            
                        }</h3>
                    <h4 className="vertical-timeline-element-subtitle">{event.from} → {event.to}</h4>
                    <p>Quantity: {event.quantity} {event.status && `, Status: ${event.status}`}</p>
                </VerticalTimelineElement>
            ))}
        </VerticalTimeline>
    );
}

export default ProductDetails;
