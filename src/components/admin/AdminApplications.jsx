import { Divider, IconButton } from '@chakra-ui/react'
import { ArrowLeftIcon } from '@chakra-ui/icons'
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { TraceChainContract } from '../../contants';
import { ABI } from '../../contractABI';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure, Button
} from '@chakra-ui/react'

const gatewayBaseUrl = 'http://127.0.0.1:8080/ipfs/';

function AdminApplications() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(TraceChainContract, ABI, signer);

    const getAllApplications = async () => {
      try {
        const data = await contract.getApplictions();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    // Call the function to get applications
    getAllApplications();
  }, [])

  console.log(applications)

  return (
    <>
      <div className='px-10 py-5'>
        <div className='flex justify-between'>
          <IconButton icon={<ArrowLeftIcon />} />
          <h1 className='text-center font-bold text-4xl'>Registation Applications</h1>
          <p></p>
        </div>
        <Divider className='mt-5' />
        <div className='mt-5 border'>
          <TableContainer className='rounded-md'>
            <Table variant='striped' colorScheme='teal'>
              <TableCaption>Apply for Registation</TableCaption>
              <Thead>
                <Tr>
                  <Th>SL No</Th>
                  <Th>Applied By</Th>
                  <Th>Name</Th>
                  <Th>Contact</Th>
                  {/* <Th>Location</Th> */}
                  <Th>Country of Origin</Th>
                  <Th>Tin Number</Th>
                  {/* <Th>Vat Reg Number</Th> */}
                  <Th>Role</Th>
                  <Th>Documents</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {
                  applications
                    .map((application, index) => {
                      return (
                        <Tr key={index}>
                          <Td>{index + 1}</Td>
                          <Td>{application.address_registered}</Td>
                          <Td>{application.name}</Td>
                          <Td>{application.contractNumber}</Td>
                          {/* <Td>{application.locAddress}</Td> */}
                          <Td>{application.countryOfOrigin}</Td>
                          <Td>{application.tinNumber}</Td>
                          {/* <Td>{application.vatRegNumber}</Td> */}
                          <Td>{application.role}</Td>
                          <Td>
                            <button className='bg-sky-500 p-2 font-semibold rounded-lg' onClick={onOpen}>
                              View Documents
                            </button>
                          </Td>
                          <Td>
                            <button className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'>
                              Accept
                            </button>
                            <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>
                              Deny
                            </button>
                          </Td>


                          <Modal isOpen={isOpen} onClose={onClose}>
                            <ModalOverlay />
                            <ModalContent>
                              <ModalHeader>Details of Company: {application.name}</ModalHeader>
                              <ModalCloseButton />
                              <ModalBody>
                                <p>Applied By: {application.address_registered}</p>
                                <p>Comp Name: {application.name}</p>
                                <p>Contact: {application.contractNumber}</p>
                                <p>Location: {application.locAddress}</p>
                                <p>Country of Origin: {application.countryOfOrigin}</p>
                                <p>Tin Number: {application.tinNumber}</p>
                                <p>Vat Reg Number: {application.vatRegNumber}</p>
                                <p>Applied for Role: {application.role}</p>
                                <p>Document TIN: <a className='bg-emerald-500 p-2 rounded-lg' target='_blank' href={`${gatewayBaseUrl}${application.ipfsDocHash}/doc-${application.address_registered}/doc1.jpg`}>View Tin</a></p>
                                <p>Document Trade Licence: <a className='bg-emerald-500 p-2 rounded-lg' target='_blank' href={`${gatewayBaseUrl}${application.ipfsDocHash}/doc-${application.address_registered}/doc2.jpg`}>View Trade Lic</a></p>
                                <p>Document VAT REG: <a className='bg-emerald-500 p-2 rounded-lg' target='_blank' href={`${gatewayBaseUrl}${application.ipfsDocHash}/doc-${application.address_registered}/doc3.jpg`}>View Vat Reg</a></p>
                              </ModalBody>
                              <ModalFooter>
                                <Button colorScheme='blue' mr={3} onClick={onClose}>
                                  Close
                                </Button>
                              </ModalFooter>
                            </ModalContent>
                          </Modal>
                        </Tr>
                      )
                    })
                }

              </Tbody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  )
}

export default AdminApplications