import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Heading } from '@chakra-ui/react';
import { useActiveAccount } from 'thirdweb/react';
import { etherContract } from '../../contants';

function ImporterDispatchHistory() {
  const [dispatches, setDispatches] = useState([]);
  const activeAccount = useActiveAccount();

  useEffect(() => {
    const fetchHistoryData = async () => {
      const events = await etherContract.queryFilter('ProductDispatched');
      // Process events
      const dispatchesList = events.map(event => {
        const { id, productId, ipfsDocHash, from, to, timestamp, quantity } = event.args;
        return {
          id: id.toString(),
          productId: productId.toString(),
          ipfsDocHash,
          from: from,
          to: to,
          timestamp: timestamp.toNumber(),
          quantity: quantity.toString()
        };
      });

      setDispatches(dispatchesList);
    };
    
    fetchHistoryData();
  }, []);

  return (
    <Box p={5}>
      <Heading as='h1' size='xl' mb={5} textAlign='center'>
        Importer to Distributor Dispatch History
      </Heading>
      <TableContainer>
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Product ID</Th>
              <Th>IPFS Doc Hash</Th>
              <Th>From</Th>
              <Th>To</Th>
              <Th>Timestamp</Th>
              <Th>Quantity</Th>
            </Tr>
          </Thead>
          <Tbody>
            {dispatches
            .filter(dispatch => dispatch.quantity > 0 && dispatch.from === activeAccount?.address)
            .map(dispatch => (
              <Tr key={dispatch.id}>
                <Td>{dispatch.id}</Td>
                <Td>{dispatch.productId}</Td>
                <Td>{dispatch.ipfsDocHash}</Td>
                {/* {dispatch.from} */}
                <Td>Self</Td> 
                <Td>{dispatch.to}</Td>
                <Td>{new Date(dispatch.timestamp * 1000).toLocaleString()}</Td>
                <Td>{dispatch.quantity}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ImporterDispatchHistory;
