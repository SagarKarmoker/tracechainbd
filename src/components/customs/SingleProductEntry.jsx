import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { contract } from "../../chain";
import useWallet from '../../hooks/userWallet'

function SingleProductEntry({ customsAddr }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [countryOfOrigin, setCountryOfOrigin] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [importerAddr, setImporterAddr] = useState("");

  const toast = useToast();
  const { signer, traceChainBDContract, zeroGas } = useWallet();

  const singleProductEntry = async () => {
    if (
      name === "" ||
      description === "" ||
      category === "" ||
      countryOfOrigin === "" ||
      manufacturer === "" ||
      price === "" ||
      quantity === "" ||
      importerAddr === "" ||
      customsAddr === ""
    ) {
      toast({
        title: "Error",
        description: "All fields are required",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else {
      const tx = await traceChainBDContract.boxWiseEntry(
        name, description, category, countryOfOrigin, manufacturer, price, quantity, importerAddr, customsAddr, {
          gasPrice: 0,
          gasLimit: 3000000
        }
      )

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

        setName("");
        setDescription("");
        setCategory("");
        setCountryOfOrigin("");
        setManufacturer("");
        setPrice("");
        setQuantity("");
        setImporterAddr("");
      } else {
        toast({
          title: "Error",
          description: "Product not added",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <div className="flex justify-center mt-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold mb-5 text-center">
          Product Entry and Accept
        </h1>
        <input
          type="text"
          className="p-2 border rounded-lg w-[500px]"
          placeholder="Enter Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          className="p-2 border rounded-lg w-[500px]"
          placeholder="Enter Product Details"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          className="p-2 border rounded-lg w-[500px]"
          placeholder="Enter Product Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="text"
          className="p-2 border rounded-lg w-[500px]"
          placeholder="Enter Product Country of Origin"
          value={countryOfOrigin}
          onChange={(e) => setCountryOfOrigin(e.target.value)}
        />
        <input
          type="text"
          className="p-2 border rounded-lg w-[500px]"
          placeholder="Enter Product Manufacturer"
          value={manufacturer}
          onChange={(e) => setManufacturer(e.target.value)}
        />
        <input
          type="number"
          className="p-2 border rounded-lg w-[500px]"
          placeholder="Enter Product Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="number"
          className="p-2 border rounded-lg w-[500px]"
          placeholder="Enter Product Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <input
          type="text"
          className="p-2 border rounded-lg w-[500px]"
          placeholder="Enter Importer Address"
          value={importerAddr}
          onChange={(e) => setImporterAddr(e.target.value)}
        />
        <input
          type="text"
          className="p-2 border rounded-lg w-[500px]"
          placeholder="Enter Customs Address"
          value={customsAddr}
          readOnly
        />

        <div className="flex justify-center">
          <button
            onClick={singleProductEntry}
            className="bg-blue-600 p-4 text-white rounded-xl w-[300px] font-bold"
          >
            Add Product to Ledger
          </button>
        </div>
      </div>
    </div>
  );
}

export default SingleProductEntry;
