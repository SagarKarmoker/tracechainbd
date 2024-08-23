import React, { useEffect, useRef, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Heading, Button, useToast } from '@chakra-ui/react';
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
    const logoUrl = "https://ipfs.io/ipfs/QmPNsmbVBDd7Kz6dHNcRwm8fHs8vazgn8VDDPHFRveDYNh";
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
    fetchHistoryData();
  }, [account]);

  const handleGeneratePdf = async () => {
    if (!qrRef.current || !printId) {
      toast({
        title: "Error",
        description: "QR Code not found or Dispatch ID is not set.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const qrElements = qrRef.current.querySelectorAll('div');

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

      for (const element of qrElements) {
        const canvas = await html2canvas(element);
        const qrImage = canvas.toDataURL("image/png");

        const width = 200;
        const height = 200;

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

      pdf.save(`product_${printId}_qr_codes.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 5)}...${address.slice(-7)}`;
  };

  return (
    <Box p={5}>
      <Heading as='h1' size='xl' mb={5} textAlign='center'>
        Customs to Importer Dispatch History
      </Heading>
      <TableContainer>
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th>Dispatch ID</Th>
              <Th>Start PID</Th>
              <Th>End PID</Th>
              <Th>From</Th>
              <Th>Importer</Th>
              <Th>Timestamp</Th>
              <Th>Quantity</Th>
              <Th>Download QR</Th>
            </Tr>
          </Thead>
          <Tbody>
            {dispatches
              .filter(dispatch => dispatch.quantity > 0 && dispatch.from === account)
              .map(dispatch => (
                <Tr key={dispatch.dispatchId}>
                  <Td>{dispatch.dispatchId}</Td>
                  <Td>{dispatch.startId}</Td>
                  <Td>{dispatch.endId}</Td>
                  <Td>Self</Td>
                  <Td>{formatAddress(dispatch.to)}</Td>
                  <Td>{new Date(dispatch.timestamp * 1000).toLocaleString()}</Td>
                  <Td>{dispatch.quantity}</Td>
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
              fgColor="#00712D"
              bgColor="#D5ED9F"
              logoImage={base64Logo}
              logoWidth={200}
              logoHeight={200}
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
    </Box>
  );
}

export default CustomsDispatchHistory;
