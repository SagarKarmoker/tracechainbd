import React, { useState } from 'react';
import {
    Box,
    Button,
    Divider,
    FormControl,
    FormLabel,
    Input,
    Select,
    Textarea,
    Spinner,
    Heading,
    useToast,
    Icon,
} from '@chakra-ui/react';
import { FaExclamationTriangle } from 'react-icons/fa';
import useAuth from '../hooks/userAuth';
import useWallet from '../hooks/userWallet';

function ReportProduct() {
    const [productId, setProductId] = useState('');
    const [role, setRole] = useState('');
    const [comment, setComment] = useState('');
    const [reportee, setReportee] = useState('');
    const [proof, setProof] = useState(null);
    const { account } = useAuth();
    const { traceChainBDContract, zeroGas } = useWallet();
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    const checkProductOwner = async () => {
        try {
            const product = await traceChainBDContract.productLifeCycles(productId);

            if (product.owner === account) {
                return true;
            }else{
                toast({
                    title: 'Error',
                    description: 'You are not the owner of the product',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                });
                return false;
            }

        } catch (error) {
            toast({
                title: 'Error',
                description: 'Error while fetching product owner',
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
            return null;
        }
    }

    const handleReport = async () => {
        if (!productId || !role || !comment) {
            toast({
                title: 'Error',
                description: 'Please fill all the fields',
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
            return;
        }

        const isOwner = await checkProductOwner();
        if (isOwner === null) {
            toast({
                title: 'Error',
                description: 'Error while checking product owner',
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
            return;
        } else if (!isOwner) {
            toast({
                title: 'Error',
                description: 'You are not the owner of the product',
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
            return;
        }

        setLoading(true);
        try {
            const tx = await traceChainBDContract.reportProduct(productId, comment, reportee, proof, zeroGas);
            await tx.wait();

            toast({
                title: 'Success',
                description: 'Product reported successfully',
                status: 'success',
                duration: 9000,
                isClosable: true,
            });

            // Clear form fields after success
            setProductId('');
            setRole('');
            setComment('');
            setReportee('');
            setProof(null);

        } catch (error) {
            toast({
                title: 'Error',
                description: 'Error while reporting product',
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box padding="10" maxW="600px" mx="auto" mt="10" bg="gray.50" boxShadow="lg" borderRadius="lg">
            <Heading textAlign="center" mb="5">Report Portal</Heading>
            <Divider mb="5" />
            <Box as="form" className="flex flex-col gap-4">
                <FormControl>
                    <FormLabel>Product ID</FormLabel>
                    <Input
                        type="number"
                        placeholder="Enter Product ID"
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Your Role</FormLabel>
                    <Select placeholder="Select your role" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="Importer">Importer</option>
                        <option value="Distributor">Distributor</option>
                        <option value="Retailer">Retailer</option>
                    </Select>
                </FormControl>

                <FormControl>
                    <FormLabel>Against Role</FormLabel>
                    <Select placeholder="Select the role you are reporting against" value={reportee} onChange={(e) => setReportee(e.target.value)}>
                        <option value="Importer">Importer</option>
                        <option value="Distributor">Distributor</option>
                        <option value="Retailer">Retailer</option>
                    </Select>
                </FormControl>

                <FormControl>
                    <FormLabel>Reportee Address</FormLabel>
                    <Input
                        type="text"
                        placeholder="Enter Reportee Address"
                        value={reportee}
                        onChange={(e) => setReportee(e.target.value)}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Your Comment</FormLabel>
                    <Textarea
                        placeholder="Enter your report details"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Proof (if Any)</FormLabel>
                    <Input
                        type="file"
                        onChange={(e) => setProof(e.target.files[0])}
                    />
                </FormControl>

                <Box display="flex" justifyContent="center" mt="5">
                    <Button
                        colorScheme="blue"
                        size="lg"
                        leftIcon={loading ? <Spinner size="sm" /> : <Icon as={FaExclamationTriangle} />}
                        onClick={handleReport}
                        isDisabled={loading}
                    >
                        {loading ? 'Reporting...' : 'Report'}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default ReportProduct;
