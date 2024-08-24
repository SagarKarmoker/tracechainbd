import React, { useState } from 'react';
import { useToast, Box, Button, Input, Heading, Table, Thead, Tbody, Tr, Th, Td, Spinner, IconButton } from '@chakra-ui/react';
import { ArrowLeftIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { etherContract } from '../../contants';
import useWallet from '../../hooks/userWallet';
import useAuth from '../../hooks/userAuth';
import backgroundImage from "../../img/homeBG2.png"; // Ensure you have this image in the correct path

function DispatchToImporter() {
  const toast = useToast();
  const [boxId, setBoxId] = useState("");
  const [isHidden, setIsHidden] = useState(true);
  const [hideGetBtn, setHideGetBtn] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [importerAddr, setImporterAddr] = useState('');
  const [_ipfsDocHash, setIpfsDocHash] = useState('');

  const { traceChainBDContract, zeroGas } = useWallet();
  const { account } = useAuth();
  const navigate = useNavigate();

  const handleDetails = async () => {
    if (boxId !== '') {
      try {
        setLoading(true);
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

        if (isDispatched.owner === account) {
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
    } else {
      try {
        const tx = await traceChainBDContract.dispatch(
          productDetails.startId, productDetails.endId, importerAddr, _ipfsDocHash, zeroGas
        );

        await tx.wait();

        toast({
          title: "Success",
          description: "Product dispatched successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
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

  return (
    <div className='px-10 py-5 w-full min-h-screen bg-cover bg-center flex flex-col' style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Box p={10}>
        <div className='flex justify-between'>
          <IconButton icon={<ArrowLeftIcon />} onClick={() => navigate(0)} />
          <h1 className='text-center font-bold text-4xl'>Customs Dispatch Dashboard</h1>
          <p></p>
        </div>
        <Box display="flex" justifyContent="center" className='mt-4'>
          <Box width="96" display="flex" flexDirection="column" gap={4}>
            <Input
              type="number"
              bg="white"
              placeholder="Enter Box ID to get details"
              value={boxId}
              onChange={(e) => setBoxId(e.target.value)}
              isRequired
              border="2px"
              borderColor="#5160be"  // Border color set to #5160be
            />
            <Button
              onClick={handleDetails}
              bg="#5160be"
              _hover={{ bg: "#7db6f9" }} // Hover background color
              color="white"
              fontWeight="bold"
              py={2}
              px={4}
              rounded="md"
              hidden={hideGetBtn}
            >
              Get Details
            </Button>

          </Box>
        </Box>


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
                    <Button mt={4} colorScheme="blue" onClick={handleDispatch}>
                      Dispatch Product to Importer
                    </Button>
                  </div>
                </Box>
              ) : (
                <Box>No product details available.</Box>
              )
            )}
          </Box>
        )}
      </Box>
    </div>
  );
}

export default DispatchToImporter;
