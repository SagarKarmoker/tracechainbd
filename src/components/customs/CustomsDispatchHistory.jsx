import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Heading } from '@chakra-ui/react';
import { useActiveAccount } from 'thirdweb/react';
import { etherContract } from '../../contants';
import useAuth from '../../hooks/userAuth';

function CustomsDispatchHistory() {
  const [dispatches, setDispatches] = useState([]);
  const { account } = useAuth();

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        // Ensure etherContract is available and correctly initialized
        const events = await etherContract.queryFilter('MultiProductDispatched');
        console.log(events);

        // Process events
        const dispatchesList = events.map(event => {
          // Destructure arguments from the event
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

        console.log(dispatchesList)
        setDispatches(dispatchesList);
      } catch (error) {
        console.error('Error fetching history data:', error);
      }
    };

    // Fetch history data on component mount or when etherContract changes
    if (etherContract) {
      fetchHistoryData();
    }
  }, []);

  // Helper function to format address
  const formatAddress = (address) => {
    // Slice the address to show only specific parts
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
            </Tr>
          </Thead>
          <Tbody>
            {dispatches
            .filter(dispatch => dispatch.quantity > 0 && dispatch.from === account)
            .map(dispatch => (
              <Tr key={dispatch.dispatchId}>
                <Td className='text-center'>{dispatch.dispatchId}</Td>
                <Td className='text-center'>{dispatch.startId}</Td>
                <Td className='text-center'>{dispatch.endId}</Td>
                <Td className='text-center'>Self</Td> 
                <Td className='text-center'>{formatAddress(dispatch.to)}</Td>
                <Td className='text-center'>{new Date(dispatch.timestamp * 1000).toLocaleString()}</Td>
                <Td className='text-center'>{dispatch.quantity}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default CustomsDispatchHistory;
