import React, { useState } from 'react';
import { Button, Input, Box, Text, VStack } from '@chakra-ui/react';
import { Scanner } from '@yudiel/react-qr-scanner';

function QRScan() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [qrResult, setQrResult] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(URL.createObjectURL(file));
      setIsScannerOpen(false);
      setQrResult('');
      setErrorMessage('');
    }
  };

  const handleScan = (result) => {
    if (result && result.data) {
      console.log('QR Code Result:', result.data);
      setQrResult(result.data);
      setSelectedFile(null);
      setIsScannerOpen(false);
    } else {
      console.log('No QR code detected in the image.');
      setErrorMessage('No QR code detected. Please try again with a different image.');
    }
  };

  const handleError = (error) => {
    console.error('Scanner Error:', error);
    setErrorMessage('An error occurred while scanning. Please try again.');
  };

  return (
    <Box px={8} py={10}>
      <VStack spacing={6}>
        <Text fontSize="3xl" fontWeight="bold" textAlign="center">
          QR Code Scanner
        </Text>
        <Text fontSize="md" color="gray.600" textAlign="center">
          Scan a QR code using your camera or upload an image containing a QR code.
        </Text>

        {/* QR Code from Image */}
        <Box w="100%" textAlign="center">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            mb={4}
            variant="filled"
          />
          {selectedFile && (
            <Scanner
              image={selectedFile}
              onScan={handleScan}
              onError={handleError}
              styles={{ width: '100%' }}
            />
          )}
        </Box>

        <Text fontSize="lg" fontWeight="bold">
          OR
        </Text>

        {/* Live Camera QR Scanner */}
        <Box textAlign="center">
          <Button colorScheme="teal" onClick={() => {
            setIsScannerOpen(!isScannerOpen);
            setQrResult('');
            setErrorMessage('');
          }}>
            {isScannerOpen ? 'Close Camera Scanner' : 'Open Camera Scanner'}
          </Button>
          {isScannerOpen && (
            <Box mt={4}>
              <Scanner
                onScan={handleScan}
                onError={handleError}
                styles={{ width: '100%' }}
              />
            </Box>
          )}
        </Box>

        {/* Display Result or Error Message */}
        {qrResult && (
          <Box p={4} bg="green.100" borderRadius="md" w="100%" textAlign="center">
            <Text fontSize="lg" color="green.800">
              <strong>Scanned QR Code:</strong> {qrResult}
            </Text>
          </Box>
        )}

        {errorMessage && (
          <Box p={4} bg="red.100" borderRadius="md" w="100%" textAlign="center">
            <Text fontSize="lg" color="red.800">
              {errorMessage}
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
}

export default QRScan;
