import { useState, useEffect, useCallback } from 'react';
// import handleGetBalance from '../utils/handleBalance';

const useWalletConnexion = () => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(null);

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });

        setAccount(accounts[0]);
        setChainId(chainId);
        setProvider(window.ethereum);

      } catch (error) {
        console.error('Failed to connect to wallet:', error);
      }
    } else {
      console.error('Ethereum provider not found!');
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setChainId(null);
    setProvider(null);
  }, []);

  const getBalance = useCallback(async (address) => {
    if (provider) {
      try {
        const balance = await provider.request({
          method: 'eth_getBalance',
          params: [address, 'latest'],
        });
        return parseInt(balance, 16) / 1e18; // Convert from Wei to Ether
        // return ethers.parseUnits(balance, 16) / 1e18; // Convert from Wei to Ether
      } catch (error) {
        console.error('Failed to get address balance:', error);
        return null;
      }
    }
    return null;
  }, [provider]);

  useEffect(() => {
    if (provider) {
      const handleAccountsChanged = (accounts) => {
        setAccount(accounts[0] || null);
      };

      const handleChainChanged = (chainId) => {
        setChainId(chainId);
      };

      const handleDisconnect = () => {
        disconnectWallet();
      };

      provider.on('accountsChanged', handleAccountsChanged);
      // provider.on('accountsChanged', handleGetBalance);
      provider.on('chainChanged', handleChainChanged);
      // provider.on('chainChanged', handleGetBalance);
      provider.on('disconnect', handleDisconnect);

      return () => {
        provider.removeListener('accountsChanged', handleAccountsChanged);
        // provider.removeListener('accountsChanged', getBalance);
        provider.removeListener('chainChanged', handleChainChanged);
        // provider.removeListener('chainChanged', getBalance);
        provider.removeListener('disconnect', handleDisconnect);
      };
    }
  }, [provider, disconnectWallet]);

  return {
    account,
    chainId,
    connectWallet,
    disconnectWallet,
    getBalance,
  };
};

export default useWalletConnexion;
