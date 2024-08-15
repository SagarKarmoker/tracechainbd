import { ethers } from 'ethers';

const adminProvider = new ethers.providers.Web3Provider(window.ethereum);
const adminSigner = adminProvider.getSigner();

export { adminProvider, adminSigner };