import React, { useState, useEffect } from 'react';
import useWalletConnexion from '../hooks/useWalletConnexion';

export default function InjectedWallet() {
  const { account, chainId, connectWallet, disconnectWallet, getBalance } = useWalletConnexion();
  const [addressInput, setAddressInput] = useState('');
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (account) {
      setAddressInput(account);
      handleGetBalance(addressInput);
    }
  }, [account]);

  const handleAddressChange = (e) => {
    setAddressInput(e.target.value);
  };

  const handleGetBalance = async () => {
    if (addressInput) {
      console.log(addressInput)
      const balance = await getBalance(addressInput);
      console.log(balance)
      setBalance(balance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Custom Wallet Connexion</h1>

        {account ? (
          <div className="mb-6">
            <p className="text-sm font-medium text-black mb-2">Connected Account:</p>
            <p className="bg-gray-100 rounded p-2 break-all text-gray-800">{account}</p>
            <p className="text-sm font-medium text-black mt-4 mb-2">Chain ID:</p>
            <p className="bg-gray-100 rounded p-2 text-gray-800">{parseInt(chainId)}</p>
            <button
              onClick={() => {
                disconnectWallet();
                setAddressInput("");
                setBalance(0);
              }}
              // onClick={disconnectWallet}
              className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-200"
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200 mb-6"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}

        <div className="mb-4">
          <input
            type="text"
            value={addressInput}
            onChange={(e) => handleAddressChange(e)}
            // onChange={handleAddressChange}
            placeholder="Enter wallet address"
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />
          <button
            onClick={handleGetBalance}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            Get Address Balance
          </button>
        </div>

        {balance !== null && (
          <div className="bg-gray-100 rounded p-4">
            <p className="text-lg font-semibold text-gray-800">Balance: {balance} ETH</p>
          </div>
        )}
      </div>
    </div>
  );
};