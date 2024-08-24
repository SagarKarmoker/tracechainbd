import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  Divider,
  Text,
  Center,
  Spinner
} from '@chakra-ui/react';
import { ArrowLeftIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import backgroundImage from "../../img/homeBG3.png";
import { etherContract } from '../../contants';
import useAuth from '../../hooks/userAuth';

function CustomsDispatchHistory() {
  const [dispatches, setDispatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { account } = useAuth();
  const navigate = useNavigate();

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
      } finally {
        setLoading(false);
      }
    };

    if (etherContract) {
      fetchHistoryData();
    }
  }, []);

  const formatAddress = (address) => `${address.slice(0, 5)}...${address.slice(-7)}`;

  if (loading) {
    return (
      <Center height="100vh">
        <Box textAlign="center">
          <Spinner size="xl" color="blue.500" />
          <Text mt={4} fontSize="xl" fontWeight="bold">Loading dispatch history. Please wait...</Text>
        </Box>
      </Center>
    );
  }

  return (
    <div className='px-10 py-5 w-full min-h-screen bg-cover bg-center flex flex-col' style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className='flex justify-between'>
        <IconButton icon={<ArrowLeftIcon />} onClick={() => navigate(0)} />
        <Heading as='h1' size='xl' textAlign='center'>Customs to Importer Dispatch History</Heading>
        <p></p>
      </div>
      <Divider className='mt-5' />
      <Text textAlign='center' mt={2} mb={4}>Here you can find the history of all dispatches made by customs to importers.</Text>
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
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default CustomsDispatchHistory;
