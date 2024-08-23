import React, { useState, useEffect } from 'react';
import { useToast, Box, Button, Input, Heading, Table, Thead, Tbody, Tr, Th, Td, Spinner } from '@chakra-ui/react';
import { etherContract } from '../../contants';
import useWallet from '../../hooks/userWallet';
import useAuth from '../../hooks/userAuth';
import { QRCode } from "react-qrcode-logo";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PendingDispatch from './PendingDispatch';

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

function DispatchToImporter() {
  const toast = useToast();
  const [boxId, setBoxId] = useState("");
  const [isHidden, setIsHidden] = useState(true);
  const [hideGetBtn, setHideGetBtn] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [importerAddr, setImporterAddr] = useState('');
  const [_ipfsDocHash, setIpfsDocHash] = useState('');
  const [showQr, setShowQr] = useState(false);
  const [oldCounter, setOldCounter] = useState(0);
  const [base64Logo, setBase64Logo] = useState("");
  const [showPending, setShowPending] = useState(true);

  const { traceChainBDContract, zeroGas } = useWallet();
  const { account } = useAuth();

  // Load the logo as base64 when the component mounts
  useEffect(() => {
    const logoUrl = "https://ipfs.io/ipfs/QmPNsmbVBDd7Kz6dHNcRwm8fHs8vazgn8VDDPHFRveDYNh";
    convertImageToBase64(logoUrl)
      .then(setBase64Logo)
      .catch((error) => console.error("Error converting logo to base64:", error));
  }, []);

  const handleDetails = async () => {
    if (boxId !== '') {
      try {
        setLoading(true);
        setShowPending(false);
        // Get product details from blockchain
        const product = await etherContract.boxes(boxId);

        // Convert BigNumber and other types to strings or numbers
        const formattedProduct = {
          boxid: Number(product.boxId.toString()),
          startId: Number(product.start_productId.toString()),
          endId: Number(product.end_productId.toString()),
          name: product.name,
          description: product.description,
          category: product.category,
          countryOfOrigin: product.countryOfOrigin,
          manufacturer: product.manufacturer,
          price: Number(product.price.toString()),
          quantity: Number(product.quantity.toString()), // Convert BigNumber to number
          importedDate: Number(product.importedDate.toString()), // Convert BigNumber to number
          importerAddr: product.importerAddr,
          customsAddr: product.customsAddr
        };

        if (formattedProduct.customsAddr !== account) {
          toast({
            title: "Error",
            description: "You are not authorized to view this product",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          return;
        }

        const isDispatched = await etherContract.productLifeCycles(formattedProduct.startId);

        if (isDispatched.owner == account) {
          setImporterAddr(product.importerAddr);
          setProductDetails(formattedProduct);
          setIsHidden(false);
          setHideGetBtn(true);
        } else {
          toast({
            title: "Already Dispatched",
            description: "You are not authorized to view this product",
            status: "error",
            duration: 9000,
            isClosable: true,
            position: "top-right",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch product details",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    } else {
      // Show warning toast
      toast({
        title: "Warning",
        description: "Product ID is required",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleDispatch = async () => {
    if (_ipfsDocHash === '' || importerAddr === '' || boxId === '') {
      toast({
        title: "Error",
        description: "All fields are required",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    else {
      try {
        const _old = await etherContract.boxCounter()
        setOldCounter(_old.toNumber());

        const tx = await traceChainBDContract.dispatch(
          productDetails.startId, productDetails.endId, importerAddr, _ipfsDocHash, zeroGas
        )

        await tx.wait();

        toast({
          title: "Success",
          description: "Product dispatched successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });

        // Show QR code after successful transaction
        setShowQr(true);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to dispatch product",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }

      // Reset form fields
      setIpfsDocHash('');
    }

  };

  const handleGeneratePdf = async () => {
    if (!qrRef.current) {
      toast({
        title: "Error",
        description: "QR Code not found.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    try {
      const qrElements = qrRef.current.querySelectorAll('div'); // Select all QR code elements

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4", // Default A4 size
      });

      let x = 10; // Starting x position
      let y = 10; // Starting y position
      const maxX = 580; // Max x position before moving to next page
      const maxY = 800; // Max y position before moving to next page
      const padding = 10; // Space between QR codes

      for (const element of qrElements) {
        const canvas = await html2canvas(element);
        const qrImage = canvas.toDataURL("image/png");

        const width = 200;
        const height = 200;

        if (x + width > maxX) {
          x = 10; // Reset x position
          y += height + padding; // Move to next row
        }

        if (y + height > maxY) {
          pdf.addPage(); // Add new page if needed
          x = 10; // Reset x position
          y = 10; // Reset y position
        }

        pdf.addImage(qrImage, "PNG", x, y, width, height); // Add QR code image
        x += width + padding; // Update x position for next QR code
      }

      pdf.save(`product_${oldCounter}-qr-codes.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box p={10}>
        <Heading mb={4} textAlign="center">Customs Dispatch Dashboard</Heading>
        <Box display="flex" justifyContent="center" mb={10}>
          <Box width="96" display="flex" flexDirection="column" gap={4}>
            <Input
              type="number"
              placeholder="Enter Box ID to get details"
              value={boxId}
              onChange={(e) => setBoxId(e.target.value)}
              isRequired
            />
            <Button onClick={handleDetails} colorScheme="blue"
              isLoading={loading}
            >
              {loading ? "Fetching..." : "Get Product Details"}
            </Button>
          </Box>
        </Box>

        {/* Hidden until product details are fetched */}
        {!isHidden && (
          <Box display="flex" flexDirection="column" alignItems="center">
            {loading ? (
              <Spinner size="xl" />
            ) : (
              productDetails && productDetails.boxid !== 0 ? (
                <Box>
                  <Table variant="simple" mb={5}>
                    <Thead>
                      <Tr>
                        <Th>Box</Th>
                        <Th>Details</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>Box ID</Td>
                        <Td>{productDetails.boxid} [Product ID Range: {productDetails.startId} to {productDetails.endId}]</Td>
                      </Tr>
                      <Tr>
                        <Td>Name</Td>
                        <Td>{productDetails.name}</Td>
                      </Tr>
                      <Tr>
                        <Td>Description</Td>
                        <Td>{productDetails.description}</Td>
                      </Tr>
                      <Tr>
                        <Td>Category</Td>
                        <Td>{productDetails.category}</Td>
                      </Tr>
                      <Tr>
                        <Td>Country of Origin</Td>
                        <Td>{productDetails.countryOfOrigin}</Td>
                      </Tr>
                      <Tr>
                        <Td>Manufacturer</Td>
                        <Td>{productDetails.manufacturer}</Td>
                      </Tr>
                      <Tr>
                        <Td>Price</Td>
                        <Td>{productDetails.price}</Td>
                      </Tr>
                      <Tr>
                        <Td>Quantity</Td>
                        <Td>{productDetails.quantity}</Td>
                      </Tr>
                      <Tr>
                        <Td>Imported Date</Td>
                        <Td>{new Date(productDetails.importedDate * 1000).toLocaleDateString()}</Td>
                      </Tr>
                      <Tr>
                        <Td>Importer Address</Td>
                        <Td>{productDetails.importerAddr}</Td>
                      </Tr>
                      <Tr>
                        <Td>Customs Address</Td>
                        <Td>{productDetails.customsAddr}</Td>
                      </Tr>
                    </Tbody>
                  </Table>

                  <Heading as="h1" size="lg" textAlign="center" mb={4}>Enter Dispatch Details</Heading>
                  <Input
                    type="text"
                    placeholder="Enter IPFS Document Hash"
                    value={_ipfsDocHash}
                    onChange={(e) => setIpfsDocHash(e.target.value)}
                    isRequired
                  />
                  <div className='flex justify-center'>
                    <Button mt={4} colorScheme="blue" onClick={handleDispatch} isLoading={loading}>
                      {loading ? "Dispatching..." : "Dispatch Product to Importer"}
                    </Button>
                  </div>

                  <div>
                    {showQr && (
                      <div className="flex flex-col items-center mt-8">
                        <div ref={qrRef} className="grid grid-cols-5 gap-x-4">
                          <div key={index} className="mb-4">
                            <QRCode
                              value={`URL: https://localhost:5173/check-product/${oldCounter + index}`}
                              size={200}
                              fgColor="#00712D"
                              bgColor="#D5ED9F"
                              logoImage={base64Logo}
                              logoWidth={200}
                              logoHeight={200}
                            />
                          </div>
                        </div>
                        <button
                          onClick={handleGeneratePdf}
                          className="bg-green-600 p-4 text-white rounded-xl w-[300px] font-bold"
                        >
                          Download QR Codes as PDF
                        </button>
                      </div>
                    )}
                  </div>
                </Box>
              ) : (
                <Box>No product details available.</Box>
              )
            )}
          </Box>
        )}
      </Box>

      {
        showPending && (
          <PendingDispatch />
        )
      }
    </>
  );
}

export default DispatchToImporter;
