import { useState, useEffect, useCallback } from 'react';
// import { ethers } from 'ethers';

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
      if (!!ethers.isAddress(address)) {
        try {
          const bal = await provider.request({
            method: 'eth_getBalance',
            params: [address, 'latest'],
          });
          console.log(bal)
          return parseInt(bal, 16) / 1e18;
          // return ethers.parseUnits(bal.toString(), 18);
        } catch (error) {
          console.error('Failed to get address balance:', error);
          return null;
        }
      } else {
        return null;
      }
    }
    return null;
  }, [provider]);

  const handleAccountsChanged = (accounts) => {
    setAccount(accounts[0] || null);
  };

  const handleChainChanged = (chainId) => {
    setChainId(chainId);
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const ethereum = window.ethereum;
      setProvider(ethereum);

      ethereum.on('accountsChanged', handleAccountsChanged);
      // ethereum.on('accountsChanged', handleDisconnect);
      ethereum.on('chainChanged', handleChainChanged);
      // ethereum.on('disconnect', handleDisconnect);

      // Cleanup listeners on unmount
      return () => {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        // ethereum.removeListener('accountsChanged', handleDisconnect);
        ethereum.removeListener('chainChanged', handleChainChanged);
        // ethereum.removeListener('disconnect', handleDisconnect);
      };
    }
  }, [disconnectWallet]);

  return {
    account,
    chainId,
    connectWallet,
    disconnectWallet,
    getBalance,
  };
};

export default useWalletConnexion;
