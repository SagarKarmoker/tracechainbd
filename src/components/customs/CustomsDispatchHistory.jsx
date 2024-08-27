import React, { useEffect, useRef, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Heading,
  Button,
  useToast,
  Divider,
  Text,
  IconButton,
} from '@chakra-ui/react';
import backgroundImage from "../../img/homeBG3.png";
import { etherContract } from '../../contants';
import useAuth from '../../hooks/userAuth';
import { QRCode } from "react-qrcode-logo";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

function CustomsDispatchHistory() {
  const [dispatches, setDispatches] = useState([]);
  const { account } = useAuth();
  const [printId, setPrintId] = useState(null);
  const [base64Logo, setBase64Logo] = useState("");
  const qrRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Load the logo as base64 when the component mounts
  useEffect(() => {
    const logoUrl = "https://res.cloudinary.com/dnmehw2un/image/upload/v1724790010/josm1wowxjneee0c3fva.png";
    convertImageToBase64(logoUrl)
      .then(setBase64Logo)
      .catch((error) => console.error("Error converting logo to base64:", error));
  }, []);

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const events = await etherContract.queryFilter('MultiProductDispatched');
        const dispatchesList = events.map(event => {
          const { dispatchId, dispatchedOn, endId, quantity, from, startId, to } = event.args;
          return {
            dispatchId: dispatchId.toString(),
            startId: startId.toString(),
            endId: endId.toString(),
            from: from,
            to: to,
            timestamp: Number(dispatchedOn.toString()),
            quantity: quantity.toString()
          };
        });
        setDispatches(dispatchesList);
      } catch (error) {
        console.error('Error fetching history data:', error);
      }
    };

    // Fetch history data on component mount or when etherContract changes
    if (etherContract) {
      fetchHistoryData();
    }
  }, [etherContract]);

  // Helper function to format address
  const formatAddress = (address) => {
    return `${address.slice(0, 5)}...${address.slice(-7)}`;
  };

  // Function to handle PDF generation and download
  const handleGeneratePdf = async () => {
    setLoading(true);
    try {
      const canvas = await html2canvas(qrRef.current);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10);
      pdf.save(`QRCode_${printId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='px-10 py-5 w-full min-h-screen bg-cover bg-center flex flex-col' style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className='flex justify-center'>
        <Heading as='h1' size='xl' textAlign='center'>Customs to Importer Dispatch History</Heading>
        <div></div>
      </div>
      <Text textAlign='center' mt={2} mb={4}>Here you can find the history of all dispatches made by customs to importers.</Text>
      <Divider className='mb-5' borderWidth='1px' borderColor='#5160be' />

      <TableContainer className="rounded-md shadow-lg bg-white">
        <Table variant='simple' size='md'>
          <Thead bg="#5160be">
            <Tr>
              <Th color="white" fontSize="md" textAlign="center">Dispatch ID</Th>
              <Th color="white" fontSize="md" textAlign="center">Start PID</Th>
              <Th color="white" fontSize="md" textAlign="center">End PID</Th>
              <Th color="white" fontSize="md" textAlign="center">From</Th>
              <Th color="white" fontSize="md" textAlign="center">Importer</Th>
              <Th color="white" fontSize="md" textAlign="center">Timestamp</Th>
              <Th color="white" fontSize="md" textAlign="center">Quantity</Th>
              <Th color="white" fontSize="md" textAlign="center">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {dispatches
              .filter(dispatch => dispatch.quantity > 0 && dispatch.from === account)
              .map(dispatch => (
                <Tr key={dispatch.dispatchId} _hover={{ bg: "gray.100" }}>
                  <Td textAlign="center">{dispatch.dispatchId}</Td>
                  <Td textAlign="center">{dispatch.startId}</Td>
                  <Td textAlign="center">{dispatch.endId}</Td>
                  <Td textAlign="center">Self</Td>
                  <Td textAlign="center">{formatAddress(dispatch.to)}</Td>
                  <Td textAlign="center">{new Date(dispatch.timestamp * 1000).toLocaleString()}</Td>
                  <Td textAlign="center">{dispatch.quantity}</Td>
                  <Td>
                    <Button
                      onClick={() => setPrintId(dispatch.dispatchId)}
                      className="bg-green-600 p-4 text-white rounded-xl w-[300px] font-bold"
                    >
                      Show QR Codes
                    </Button>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>

      {printId && (
        <div className="flex flex-col items-center mt-8">
          <div ref={qrRef} className="flex justify-center gap-x-4">
            <QRCode
              value={`URL: https://localhost:5173/accept-product/${printId}`}
              size={200}
              fgColor="#0e57af"
              bgColor="#fbfffe"
              logoImage={base64Logo}
              logoWidth={50}
              logoHeight={50}
              removeQrCodeBehindLogo={true}
              eyeRadius={10}
            />
          </div>
          <Button
            onClick={handleGeneratePdf}
            isLoading={loading}
            className="bg-green-600 p-4 text-white rounded-xl w-[300px] font-bold mt-4"
          >
            {loading ? "Generating PDF..." : "Download QR Codes as PDF"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default CustomsDispatchHistory;
