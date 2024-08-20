import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Heading } from '@chakra-ui/react';
import { etherContract } from '../../contants';
import useAuth from '../../hooks/userAuth';

// TODO: old smart contract events error is showing new code is fixed 

function DistributorDispatchHistory() {
  const [dispatches, setDispatches] = useState([]);
  const { account } = useAuth();

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const multiProductEvents = await etherContract.queryFilter('MultiProductDispatched');
        const singleProductEvents = await etherContract.queryFilter('ProductDispatched');

        const multiProductDispatches = multiProductEvents.map(event => {
          const { dispatchId, dispatchedOn, endId, quantity, from, startId, to } = event.args;

          return {
            dispatchId: dispatchId.toString(),
            startId: Number(startId.toString()),
            endId: Number(endId.toString()),
            from: from,
            to: to,
            timestamp: Number(dispatchedOn.toString()),
            quantity: quantity.toString(),
            type: 'Multi' 
          };
        });

        const singleProductDispatches = singleProductEvents.map(event => {
          const { dispatchId, dispatchedOn, productId, quantity, from, to } = event.args;

          return {
            dispatchId: dispatchId.toString(),
            startId: Number(productId.toString()),
            endId: Number(productId.toString()),
            from: from,
            to: to,
            timestamp: Number(dispatchedOn.toString()),
            quantity: quantity.toString(),
            type: 'Single' 
          };
        });

        const allDispatches = [...multiProductDispatches, ...singleProductDispatches];

        allDispatches.sort((a, b) => b.timestamp - a.timestamp);

        setDispatches(allDispatches);
      } catch (error) {
        console.error('Error fetching history data:', error);
      }
    };

    if (etherContract) {
      fetchHistoryData();
    }
  }, [etherContract, account]);

  const formatAddress = (address) => {
    return `${address.slice(0, 5)}...${address.slice(-7)}`;
  };

  return (
    <Box p={5}>
      <Heading as='h1' size='xl' mb={5} textAlign='center'>
      Distributor to Retailer Dispatch History
      </Heading>
      <TableContainer>
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th>Dispatch ID</Th>
              <Th>Start PID</Th>
              <Th>End PID</Th>
              <Th>From</Th>
              <Th>Distributor</Th>
              <Th>Timestamp</Th>
              <Th>Quantity</Th>
              <Th>Type</Th>
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
                  <Td className='text-center'>{dispatch.type}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default DistributorDispatchHistory;
