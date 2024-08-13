// useAuth.js
import { useState, useEffect } from 'react';
import { magic } from '../utils/Magic';

const useAuth = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const checkIfUserIsLoggedIn = async () => {
      const isLoggedIn = await magic.user.isLoggedIn();
      setIsConnected(isLoggedIn);

      if (isLoggedIn) {
        const accounts = await magic.wallet.getInfo();
        setAccount(accounts.publicAddress);
      }
    };

    checkIfUserIsLoggedIn();
  }, []);

  const connectWallet = async () => {
    try {
      const accounts = await magic.wallet.connectWithUI();
      setIsConnected(true);
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  return { isConnected, account, connectWallet };
};

export default useAuth;
