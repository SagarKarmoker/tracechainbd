import React, { useEffect, useState } from 'react';
import { Button, Box, Text, VStack, Icon, HStack, useToast } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import Html5QrcodePlugin from './Html5QrcodePlugin';
import useWallet from '../hooks/userWallet';
import useAuth from '../hooks/userAuth';
import { etherContract } from '../contants';

function QRScan() {
  const [decodedResults, setDecodedResults] = useState([]);
  const { traceChainBDContract, zeroGas } = useWallet();
  const { account } = useAuth();
  const toast = useToast();
  const [id, setId] = useState('');
  const [loadingStates, setLoadingStates] = useState({});
  const [owner, setOwner] = useState('');

  const onNewScanResult = (decodedText, decodedResult) => {
    const url = decodedResult.decodedText;
    const decodeId = url.split('/').pop();
    setId(decodeId);
    setDecodedResults(prev => [...prev, decodedResult]);
  };

  useEffect(() => {
    // Run checkOwner only when id is updated
    if (id) {
      checkOwner();
    }
  }, [id]);

  const checkOwner = async () => {
    try {
      const check = await etherContract.productLifeCycles(id);
      console.log(check.owner);
      console.log(account)
      setOwner(check.owner);
    } catch (error) {
      toast({
        title: "Error checking owner",
        description: `Something went wrong: ${error.message}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleAccept = async (_dispatchId) => {
    setLoadingStates(prev => ({ ...prev, [_dispatchId]: true }));

    try {
      const tx = await traceChainBDContract.confirmDelivery(_dispatchId, {
        gasLimit: 3000000,
        ...zeroGas,
      });
      const response = await tx.wait();

      if (response) {
        toast({
          title: "Dispatch accepted successfully",
          description: `Dispatch ${_dispatchId} accepted successfully`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Not Accepted",
          description: `Something went wrong`,
          status: "warning",
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error accepting dispatch:', error);
      toast({
        title: "Error accepting dispatch",
        description: `Something went wrong: ${error.message}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [_dispatchId]: false }));
    }
  };

  console.log(owner)
  console.log(id)

  return (
    <Box p={4}>
      <VStack spacing={4} align="center">
        {/* QR Code Scanner */}
        <Box border="1px" borderColor="gray.200" p={4} borderRadius="md" boxShadow="md" w="100%" maxW="400px">
          <Html5QrcodePlugin
            fps={10}
            qrbox={250}
            disableFlip={false}
            qrCodeSuccessCallback={onNewScanResult}
          />
        </Box>

        {/* Display Decoded Results */}
        <VStack spacing={3} align="stretch" w="100%" maxW="400px">
          {decodedResults.length > 0 ? (
            decodedResults.map((result, index) => {
              const resultId = result.decodedText.split('/').pop();
              return (
                <HStack key={index} p={3} bg="green.100" borderRadius="md" boxShadow="sm">
                  <Icon as={CheckCircleIcon} color="green.500" />
                  <Text fontWeight="bold">{result.decodedText}</Text>
                  {
                    owner === account ? (
                      <Button
                        colorScheme="green"
                        isLoading={loadingStates[resultId]}
                        onClick={() => handleAccept(resultId)}
                      >
                        Accept
                      </Button>
                    ) : (
                      <Text>Not your product</Text>
                    )
                  }
                </HStack>
              );
            })
          ) : (
            <Text>No QR code scanned yet.</Text>
          )}
        </VStack>
      </VStack>
    </Box>
  );
}

export default QRScan;
