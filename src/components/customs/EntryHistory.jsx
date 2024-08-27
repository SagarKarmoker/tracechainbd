import { useEffect, useRef, useState } from 'react';
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
    Button,
    useToast,
} from '@chakra-ui/react';
import { QRCode } from "react-qrcode-logo";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { etherContract } from '../../contants';

// Utility function to convert an image to base64
const convertImageToBase64 = (url) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/png"));
        };
        img.onerror = reject;
    });
};

function EntryHistory({ fromDispatch }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rolesData, setRolesData] = useState([]);
    const [printBoxId, setPrintBoxId] = useState(null);
    const [qrLoading, setQrLoading] = useState(false);
    const [base64Logo, setBase64Logo] = useState("");
    const qrRef = useRef([]);
    const toast = useToast();

    // Load the logo as base64 when the component mounts
    useEffect(() => {
        const logoUrl = "https://res.cloudinary.com/dnmehw2un/image/upload/v1724790010/josm1wowxjneee0c3fva.png";
        convertImageToBase64(logoUrl)
            .then(setBase64Logo)
            .catch((error) => console.error("Error converting logo to base64:", error));
    }, []);

    const fetchRolesData = async () => {
        try {
            const response = await fetch('https://tracechainbd-backend.onrender.com/api/roles');
            const data = await response.json();
            setRolesData(data);
        } catch (error) {
            console.error('Error fetching roles data:', error);
        }
    };

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

    const handleGeneratePdf = async () => {
        setQrLoading(true);
        try {
            // Ensure qrRef elements exist
            if (!qrRef.current || qrRef.current.length === 0) {
                toast({
                    title: "Error",
                    description: "No QR codes to generate.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                setQrLoading(false);
                return;
            }

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "px",
                format: "a4",
            });

            let x = 10;
            let y = 10;
            const maxX = 580;
            const maxY = 800;
            const padding = 10;
            const width = 200;
            const height = 200;

            for (let i = 0; i < qrRef.current.length; i++) {
                const qrElement = qrRef.current[i];
                if (!qrElement) continue;

                const canvas = await html2canvas(qrElement);
                const qrImage = canvas.toDataURL("image/png");

                if (x + width > maxX) {
                    x = 10;
                    y += height + padding;
                }

                if (y + height > maxY) {
                    pdf.addPage();
                    x = 10;
                    y = 10;
                }

                pdf.addImage(qrImage, "PNG", x, y, width, height);
                x += width + padding;
            }

            pdf.save(`QRCode_${printBoxId}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast({
                title: "Error",
                description: "Failed to generate PDF.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setQrLoading(false);
        }
    };

    return (
        <Box p={6}>
            <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={4}>
                {fromDispatch ? "Pending Product Dispatch" : "Product Entry History"}
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
                                <Th>Imported Date</Th>
                                <Th>Importer Address</Th>
                                {
                                    !fromDispatch ? (
                                        <Th>Actions</Th>
                                    ) : null
                                }
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
                                    <Td>{product.importedDate}</Td>
                                    <Td>{getRoleData(product.importerAddr)}</Td>
                                    {
                                        !fromDispatch ? (
                                            <Td>
                                                <Button
                                                    colorScheme='blue'
                                                    onClick={() => setPrintBoxId(product.boxId)}
                                                >
                                                    Show QR Codes
                                                </Button>
                                            </Td>
                                        ) : null
                                    }
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            )}

            {printBoxId && (
                <div className="flex flex-col items-center mt-8">
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-4">
                        {products.find(product => product.boxId === printBoxId)?.ids.map((id, index) => (
                            <div key={index} ref={el => qrRef.current[index] = el} className="mb-4">
                                <QRCode
                                    value={`URL: https://localhost:5173/check-product/${id}`}
                                    size={200}
                                    fgColor="#0e57af"
                                    bgColor="#fbfffe"
                                    logoImage={base64Logo}
                                    logoWidth={50}
                                    logoHeight={50}
                                    removeQrCodeBehindLogo={true}
                                    eyeRadius={10}
                                />
                                <Text textAlign="center" mt={2}>Product ID: {id}</Text>
                            </div>
                        ))}
                    </div>
                    <Button
                        onClick={handleGeneratePdf}
                        isLoading={qrLoading}
                        className="bg-green-600 p-4 text-white rounded-xl w-[300px] font-bold mt-4"
                    >
                        {qrLoading ? "Generating PDF..." : "Download QR Codes as PDF"}
                    </Button>
                </div>
            )}
        </Box>
    );
}

export default EntryHistory;
