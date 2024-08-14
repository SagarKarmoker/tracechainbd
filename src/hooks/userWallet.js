import { useState, useEffect } from 'react';
import { magic } from '../utils/Magic';
import userAuth from './userAuth';

const useWallet = () => {
    const { isConnected, account } = userAuth();
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);

    useEffect(() => {
        const checkWalletProvider = async () => {
            if (isConnected && account !== null) {
                const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
                setProvider(provider);
                const signer = provider.getSigner();
                setSigner(signer);
            }
        }

        checkWalletProvider();
    }, [provider, signer]);

    return { provider, signer };
}

export default useWallet;