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
import { create } from 'ipfs-http-client';
import useAuth from '../hooks/userAuth';
import useWallet from '../hooks/userWallet';

// IPFS client setup
const ipfs = create({ url: "http://127.0.0.1:5001/api/v0/add" });

function ReportProduct() {
    const [productId, setProductId] = useState('');
    const [role, setRole] = useState('');
    const [comment, setComment] = useState('');
    const [reportee, setReportee] = useState('');
    const [reporteeAddr, setReporteeAddr] = useState('');
    const [proof, setProof] = useState(null);
    const [ipfsProofHash, setIpfsProofHash] = useState('');
    const { account } = useAuth();
    const { traceChainBDContract, zeroGas } = useWallet();
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    const checkProductOwner = async () => {
        try {
            const product = await traceChainBDContract.productLifeCycles(productId);
            console.log(product)

            if (product.owner === account) {
                return true;
            } else {
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
    };

    const uploadProofToIPFS = async (file) => {
        try {
            const addedFile = await ipfs.add(file);
            console.log(addedFile.cid.toString())
            setIpfsProofHash(addedFile.cid.toString());
            toast({
                title: "Success",
                description: "Proof uploaded to IPFS successfully.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Error uploading proof to IPFS.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            console.error("Error uploading proof to IPFS:", error);
        }
    };

    const handleReport = async () => {
        if (!productId || !role || !comment || !reportee || !reporteeAddr) {
            toast({
                title: 'Error',
                description: 'Please fill all the fields',
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
            return;
        }
        setLoading(true);
        const isOwner = await checkProductOwner();
        if(!isOwner) return;

        try {
            if (proof) {
                const proofFile = await fetch(proof).then((r) => r.blob());
                await uploadProofToIPFS(proofFile);
            }

            const tx = await traceChainBDContract.reportProduct(productId, comment, reporteeAddr, ipfsProofHash , zeroGas);
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
            setReporteeAddr('');
            setProof(null);
            setIpfsProofHash('');

        } catch (error) {
            toast({
                title: 'Error',
                description: 'Error while reporting product',
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
            console.error('Error while reporting product:', error);
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
                        value={reporteeAddr}
                        onChange={(e) => setReporteeAddr(e.target.value)}
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
