import { useState, useRef, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { QRCode } from "react-qrcode-logo";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import useWallet from "../../hooks/userWallet";

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

function SingleProductEntry({ customsAddr }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [countryOfOrigin, setCountryOfOrigin] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [importerAddr, setImporterAddr] = useState("");
  const [showQr, setShowQr] = useState(false);
  const [loading, setLoading] = useState(false);

  const [oldCounter, setOldCounter] = useState(0);
  const [base64Logo, setBase64Logo] = useState("");

  const qrRef = useRef(null);
  const toast = useToast();
  const { traceChainBDContract } = useWallet();

  // Load the logo as base64 when the component mounts
  useEffect(() => {
    const logoUrl = "https://res.cloudinary.com/dnmehw2un/image/upload/v1724790010/josm1wowxjneee0c3fva.png";
    convertImageToBase64(logoUrl)
      .then(setBase64Logo)
      .catch((error) => console.error("Error converting logo to base64:", error));
  }, []);

  const singleProductEntry = async () => {
    if (
      !name || !description || !category || !countryOfOrigin ||
      !manufacturer || !price || !quantity || !importerAddr || !customsAddr
    ) {
      toast({
        title: "Error",
        description: "All fields are required",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const _old = await traceChainBDContract.productCounter();
      setOldCounter(_old.toNumber());

      const tx = await traceChainBDContract.bulkProudctEntry(
        name, description, category, countryOfOrigin, manufacturer, price, quantity, importerAddr, customsAddr,
        { gasPrice: 0, gasLimit: 3000000 }
      );

      toast({
        title: "Processing",
        description: "Adding product to ledger",
        status: "info",
        duration: 9000,
        isClosable: true,
        position: "top-right",
      });

      const transactionReceipt = await tx.wait();

      if (transactionReceipt !== undefined) {
        toast({
          title: "Product Added",
          description: "Product added successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });

        setLoading(false);
        // Show QR code after successful transaction
        setShowQr(true);
        setName("");
        setDescription("");
        setCategory("");
        setCountryOfOrigin("");
        setManufacturer("");
        setPrice("");
        setQuantity("");
        setImporterAddr("");
      } else {
        throw new Error("Product not added");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Product not added",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
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
      setLoading(true);
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
      setLoading(false);
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

    <div className="flex justify-center mt-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col mx-auto gap-4">
          <input
            type="text"
            placeholder="Enter Product Name"
            className='border p-3 rounded-lg w-[500px]'
            style={{ borderColor: '#5160be', borderWidth: '2px' }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className='border p-3 rounded-lg w-[500px]'
            style={{ borderColor: '#5160be', borderWidth: '2px' }}
            placeholder="Enter Product Details"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            className='border p-3 rounded-lg w-[500px]'
            style={{ borderColor: '#5160be', borderWidth: '2px' }}
            placeholder="Enter Product Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            type="text"
            className='border p-3 rounded-lg w-[500px]'
            style={{ borderColor: '#5160be', borderWidth: '2px' }}
            placeholder="Enter Product Country of Origin"
            value={countryOfOrigin}
            onChange={(e) => setCountryOfOrigin(e.target.value)}
          />
          <input
            type="text"
            className='border p-3 rounded-lg w-[500px]'
            style={{ borderColor: '#5160be', borderWidth: '2px' }}
            placeholder="Enter Product Manufacturer"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
          />
          <input
            type="number"
            className='border p-3 rounded-lg w-[500px]'
            style={{ borderColor: '#5160be', borderWidth: '2px' }}
            placeholder="Enter Product Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            type="number"
            className='border p-3 rounded-lg w-[500px]'
            style={{ borderColor: '#5160be', borderWidth: '2px' }}
            placeholder="Enter Product Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <input
            type="text"
            className='border p-3 rounded-lg w-[500px]'
            style={{ borderColor: '#5160be', borderWidth: '2px' }}
            placeholder="Enter Importer Address"
            value={importerAddr}
            onChange={(e) => setImporterAddr(e.target.value)}
          />
          <input
            type="text"
            className='border p-3 rounded-lg w-[500px]'
            style={{ borderColor: '#5160be', borderWidth: '2px' }}
            placeholder="Enter Customs Address"
            value={customsAddr}
            readOnly
          />

          <div className="flex justify-center">
            <button
              onClick={singleProductEntry}
              className="bg-[#5160be] hover:bg-[#30486c] text-white font-bold py-2 px-4 rounded"

            >
              {
                loading ? "Processing..." : "Add Product to Ledger"
              }
            </button>
          </div>
        </div>
        <div>
          {showQr && (
            <div className="flex flex-col items-center mt-8">
              <div ref={qrRef} className="grid grid-cols-5 gap-x-4">
                {Array.from({ length: quantity }, (_, index) => (
                  <div key={index} className="mb-4">
                    <QRCode
                      value={`URL: https://tracechainbd-three.vercel.app/check-product/${oldCounter + index}`}
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
                ))}
              </div>
              <button
                onClick={handleGeneratePdf}
                className="bg-green-600 p-4 text-white rounded-xl w-[300px] font-bold"
              >
                {loading ? "Generating PDF..." : "Download QR Codes as PDF"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>

  );
}

export default SingleProductEntry;
