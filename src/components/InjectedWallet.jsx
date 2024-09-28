import React, { useState, useEffect } from 'react';
import useWalletConnection from '../hooks/useWalletConnection';

export default function InjectedWallet() {
  const { account, chainId, connectWallet, disconnectWallet, getBalance } = useWalletConnection();
  const [addressInput, setAddressInput] = useState('');
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (account) {
      setAddressInput(account);
    }
  }, [account]);

  const handleAddressChange = (e) => {
    setAddressInput(e.target.value);
  };

  const handleGetBalance = async () => {
    if (addressInput) {
      const balance = await getBalance(addressInput);
      setBalance(balance);
    }
  };

  return (
    <div className="container">
      <h1>Custom Wallet Connexion</h1>

      {account ? (
        <>
          <p>Connected Account: {account}</p>
          <p>Chain ID: {chainId}</p>
          <button onClick={() => {
            disconnectWallet();
            setBalance(null);
            setBalance(null);
          }
          }>Disconnect Wallet</button>
        </>
      ) : (
        <button
          className="button"
          onClick={connectWallet}>Connect Wallet
        </button>
      )}

      <div>
        <input
          type="text"
          value={addressInput}
          onChange={handleAddressChange}
          placeholder="Enter wallet address"
        />
        <button onClick={handleGetBalance}>Get Address Balance</button>
      </div>

      {/* {balance !== null && (<p>Balance: {balance} ETH</p>)} */}
      {!!balance && (<p>Balance: {balance} ETH</p>)}
    </div>
  );
};