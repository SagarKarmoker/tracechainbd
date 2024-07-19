'use client';
import { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    IconButton,
    Divider, Center, useToast
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { prepareContractCall } from "thirdweb"
import { TransactionButton, useSendTransaction } from "thirdweb/react";
import { contract } from "../../chain";

function AddAndShowAdmin({ isAdmin }) {
    const toast = useToast()
    const [loading, setLoading] = useState(false);
    const [adminAddr, setAdminAddr] = useState('');
    const { mutate: sendTransaction } = useSendTransaction();

    // use to add admins and customs role
    const addRole = () => {
        setLoading(true);
        if (adminAddr !== '' && isAdmin) {
            const _account = adminAddr;
            const transaction = prepareContractCall({
                contract,
                method: "function addAdmins(address _account)",
                params: [_account]
            });
            console.log(transaction)
            sendTransaction(transaction)

            // .then(() => {
            //     setLoading(false);
            //     // Show toast success message
            //     toast({
            //         title: "Admin added successfully",
            //         status: "success",
            //         duration: 9000,
            //         isClosable: true,
            //     });
            // })
            // .catch((error) => {
            //     setLoading(false);
            //     // Show toast error message
            //     toast({
            //         title: "Failed to add admin",
            //         description: error.message,
            //         status: "error",
            //         duration: 9000,
            //         isClosable: true,
            //     });
            // });
        } else if (adminAddr !== '' && !isAdmin) {
            const _account = adminAddr;
            const transaction = prepareContractCall({
                contract,
                method: "function addCustoms(address _account)",
                params: [_account]
            });
            console.log(transaction)
            sendTransaction(transaction)
        } else {
            setLoading(false);
            // Show toast error message
            toast({
                title: "Admin address is required",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        }
    }

    return (
        <div className='px-20'>
            {
                isAdmin ? (
                    <h1 className='text-center py-5 text-4xl font-bold'>Admin Management</h1>
                ) : (
                    <h1 className='text-center py-5 text-4xl font-bold'>Customs Management</h1>
                )
            }
            <div className="flex flex-col lg:flex-row p-6 gap-6">
                {/* Role Adding Feature */}
                <Box className="w-1/4 bg-white p-6 shadow-md rounded-lg h-full">
                    <FormControl id="adminName" mb={4}>
                        {isAdmin ? (<FormLabel>Admin Address</FormLabel>) :
                            (<FormLabel>Customs Address</FormLabel>)}
                        <Input type="text" placeholder="Enter address start with 0x"
                            value={adminAddr} onChange={(e) => setAdminAddr(e.target.value)}
                        />
                    </FormControl>
                    {/* <FormControl id="adminEmail" mb={4}>
                        <FormLabel>Admin Email</FormLabel>
                        <Input type="email" placeholder="Enter admin email" />
                    </FormControl> */}
                    <Button className='w-full' leftIcon={<AddIcon />} onClick={addRole} colorScheme="teal" variant="solid" isLoading={loading}>
                        {loading ? "Adding..." : "Add to Ledger"}
                    </Button>
                </Box>
                <Center className='h-screen'>
                    <Divider orientation='vertical' />
                </Center>
                {/* Role table */}
                <Box className="flex-1 bg-white p-6 shadow-md rounded-lg">
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Email</Th>
                                <Th>Address</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr>
                                <Td>John Doe</Td>
                                <Td>john.doe@example.com</Td>
                                <Td>
                                    <IconButton
                                        aria-label="Delete Admin"
                                        icon={<DeleteIcon />}
                                        colorScheme="red"
                                    />
                                </Td>
                            </Tr>
                            {/* Add more rows as needed */}
                        </Tbody>
                    </Table>
                </Box>
            </div>
        </div>
    );
}

export default AddAndShowAdmin;
