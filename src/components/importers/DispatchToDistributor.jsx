import React, { useState } from 'react';
import { useToast, Box, Button, Input, Heading, Table, Thead, Tbody, Tr, Th, Td, Spinner } from '@chakra-ui/react';
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { etherContract } from '../../contants';
import { contract } from '../../chain';

function DispatchToDistributor({ pid }) {
  const toast = useToast();
  const [isHidden, setIsHidden] = useState(true);
  const [hideGetBtn, setHideGetBtn] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [importerAddr, setImporterAddr] = useState('');
  const [_ipfsDocHash, setIpfsDocHash] = useState('');

  // dispatch
  const [distributorAddr, setDistributorAddr] = useState('');
  const [amount, setAmount] = useState('');

  console.log(pid)

  const { mutate: sendTransaction } = useSendTransaction();

  const handleDetails = async () => {
    if (pid !== '') {
      try {
        setLoading(true);
        // Get product details from blockchain
        const product = await etherContract.products(pid);

        // Convert BigNumber and other types to strings or numbers
        const formattedProduct = {
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

        setImporterAddr(product.importerAddr);
        setProductDetails(formattedProduct);
        setIsHidden(false);
        setHideGetBtn(true);
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

    if (_ipfsDocHash === '' || distributorAddr === '' || pid === '' || amount === '') {
      toast({
        title: "Error",
        description: "All fields are required",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else if (amount > productDetails.quantity) {
      toast({
        title: "Error",
        description: "Quantity to dispatch is more than available quantity",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    else {
      try {
        const transaction = prepareContractCall({
          contract,
          method: "function dispatchProductToDistributor(uint256 _productId, address _to, string _ipfsDocHash, uint256 _quantity)",
          params: [pid, distributorAddr, _ipfsDocHash, amount]
        });
        await sendTransaction(transaction);
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
      setDistributorAddr('');
      setAmount('');
    }

  };

  return (
    <>
      {
        pid === undefined ? (
          <>
            <div className='flex flex-col  justify-center items-center'>
              <p>Please go back to the previous page</p>
              <p>In order to dispatch product visit "All Product"</p>
              <button className='bg-blue-600 rounded-lg p-2 mt-4' onClick={() => window.history.back()}>Go Back</button>
            </div>
          </>
        ) : (
          <>
            <Box p={10}>
              <Heading mb={4} textAlign="center">Importer Dispatch Dashboard</Heading >
              <Box display="flex" justifyContent="center" mb={10}>
                <Box width="96" display="flex" flexDirection="column" gap={4}>
                  <Input
                    type="number"
                    placeholder="Enter product ID to get details"
                    value={pid}
                    isRequired
                    readOnly
                  />
                  {!hideGetBtn &&
                    <Button onClick={handleDetails} colorScheme="blue">Get Details</Button>
                  }
                </Box>
              </Box>

              {/* Hidden until product details are fetched */}
              {
                !isHidden && (
                  <Box display="flex" flexDirection="column" alignItems="center">
                    {loading ? (
                      <Spinner size="xl" />
                    ) : (
                      <Box>
                        <Table variant="simple" mb={5}>
                          <Thead>
                            <Tr>
                              <Th>Product</Th>
                              <Th>Details</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
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
                        {/* input */}
                        <div className='flex flex-col gap-4'>
                          <Input
                            type="text"
                            placeholder="Distributor Address"
                            value={distributorAddr}
                            onChange={(e) => setDistributorAddr(e.target.value)}
                            isRequired
                          />
                          <Input
                            type="text"
                            placeholder="Amount to Dispatch"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            isRequired
                          />
                          <Input
                            type="text"
                            placeholder="Enter IPFS Document Hash"
                            value={_ipfsDocHash}
                            onChange={(e) => setIpfsDocHash(e.target.value)}
                            isRequired
                          />
                        </div>

                        <Button className='mt-4 w-full text-center' onClick={handleDispatch} colorScheme="blue">Dispatch Product to Distributor</Button>
                      </Box>
                    )}
                  </Box>
                )
              }
            </Box >
          </>
        )
      }
    </>
  );
}

export default DispatchToDistributor;