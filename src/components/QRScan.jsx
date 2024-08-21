import React, { useState } from 'react';
import { Button, Input } from '@chakra-ui/react';
import { Scanner } from '@yudiel/react-qr-scanner';

function QRScan() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(URL.createObjectURL(file));
      // Close the live scanner if an image is selected
      setIsScannerOpen(false);
    }
  };

  const handleScan = (result) => {
    if (result) {
      console.log(result);
      alert(`QR Code Result: ${result}`);
      // Close the scanner after a successful scan
      setIsScannerOpen(false);
      setSelectedFile(null);
    }
  };

  const handleError = (error) => {
    console.error(error);
  };

  return (
    <section className="px-20 mt-10">
      <h1 className="text-3xl font-bold text-center">QR Scan</h1>
      <p className="text-gray-500 text-center">Scan the QR code to get the product details</p>

      <div className="mt-10">
        <Input type="file" accept="image/*" onChange={handleFileChange} mb={4} />
        {selectedFile && (
          <Scanner
            image={selectedFile}
            onScan={handleScan}
            onError={handleError}
            style={{ width: '100%' }}
          />
        )}
      </div>

      <p className="text-center my-4">OR</p>

      <div className="text-center">
        <Button colorScheme="green" onClick={() => setIsScannerOpen(!isScannerOpen)}>
          {isScannerOpen ? 'Close Scanner' : 'Scan QR'}
        </Button>
        {isScannerOpen && (
          <Scanner
            onScan={handleScan}
            onError={handleError}
            style={{ width: '100%', marginTop: '10px' }}
          />
        )}
      </div>
    </section>
  );
}

export default QRScan;
