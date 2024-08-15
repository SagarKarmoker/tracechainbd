import { useEffect, useState } from 'react';
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
import { contract } from "../../chain";
import { adminProvider, adminSigner } from '../utils/adminWallet';
import { etherContract } from '../../contants';

function AddAndShowAdmin({ isAdmin }) {
    const toast = useToast()
    const [loading, setLoading] = useState(false);
    const [adminAddr, setAdminAddr] = useState('');
    const [adminList, setAdminList] = useState([]);
    const [customsList, setCustomsList] = useState([]);

    // use to add admins and customs role
    const addRole = async () => {
        setLoading(true);
        if (adminAddr !== '' && isAdmin) {
            const _account = adminAddr;
            // send tx to add admin
            const connectedWallet = etherContract.connect(adminSigner);
            const tx = await connectedWallet.addAdmins(_account);
            await tx.wait();
            setLoading(false);
            setAdminAddr('');
            // Show toast success message
            toast({
                title: "Admin added successfully",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
        } else if (adminAddr !== '' && !isAdmin) {
            const _account = adminAddr;
            // send tx to add customs
            const connectedWallet = etherContract.connect(adminSigner);
            const tx = await connectedWallet.addCustoms(_account);
            await tx.wait();
            setLoading(false);
            setAdminAddr('');
            // Show toast success message
            toast({
                title: "Customs added successfully",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
        } else {
            setLoading(false);
            // Show toast error message
            toast({
                title: "Address is required",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        }
    }

    const handleDelete = async (_account) => {
        if (isAdmin) {
            // send tx to delete admin
            const connectedWallet = etherContract.connect(adminSigner);
            const tx = await connectedWallet.deleteAdmins(_account);
            await tx.wait();
            setLoading(false);
            // Show toast success message
            toast({
                title: "Admin deleted successfully",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
        } else {
            // send tx to delete customs
            const connectedWallet = etherContract.connect(adminSigner);
            const tx = await connectedWallet.deleteCustoms(_account);
            await tx.wait();
            setLoading(false);
            // Show toast success message
            toast({
                title: "Customs deleted successfully",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
        }
    }

    useEffect(() => {
        // fetch all admins and customs from the ledger
        const fetchAdminsNCustoms = async () => {
            const admins = await etherContract.getAllAdmins();
            const customs = await etherContract.getAllCustoms();
            setAdminList(admins);
            setCustomsList(customs);
        }
        fetchAdminsNCustoms();
    }, [loading]);

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
                                <Th>Sl No</Th>
                                <Th>ID</Th>
                                <Th>Address</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                isAdmin ? (
                                    adminList
                                        .filter(admin => admin !== '0x0000000000000000000000000000000000000000')
                                        .map((admin, index) => (
                                            <Tr key={index}>
                                                <Td>{index + 1}</Td>
                                                <Td>admin@tracechain</Td>
                                                <Td>{admin}</Td>
                                                <Td>
                                                    <IconButton
                                                        aria-label="Delete Admin"
                                                        icon={<DeleteIcon />}
                                                        colorScheme="red"
                                                        onClick={() => handleDelete(admin)}
                                                    />
                                                </Td>
                                            </Tr>
                                        ))
                                ) : (
                                    customsList
                                        .filter(customs => customs !== '0x0000000000000000000000000000000000000000')
                                        .map((customs, index) => (
                                            <Tr key={index}>
                                                <Td>{index + 1}</Td>
                                                <Td>customs@tracechain</Td>
                                                <Td>{customs}</Td>
                                                <Td>
                                                    <IconButton
                                                        aria-label="Delete Customs"
                                                        icon={<DeleteIcon />}
                                                        colorScheme="red"
                                                        onClick={() => handleDelete(customs)}
                                                    />
                                                </Td>
                                            </Tr>
                                        ))
                                )
                            }
                        </Tbody>
                    </Table>
                </Box>
            </div>
        </div>
    );
}

export default AddAndShowAdmin;
