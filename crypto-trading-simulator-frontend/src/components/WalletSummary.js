import React, { useState } from 'react';

function WalletSummary({ walletBalance, setWalletBalance }) {
  const [depositAmount, setDepositAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleDeposit = (e) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);

    if (isNaN(amount) || amount <= 0) {
      setMessage('Please enter a valid positive amount.');
      return;
    }

    setWalletBalance(prev => prev + amount);
    setDepositAmount('');
  };

  return (
    <div>
      <h3>Wallet Balance: ${walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>

      <form onSubmit={handleDeposit}>
        <input
          type="number"
          placeholder="Deposit amount"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          min="0.01"
          step="any"
          required
        />
        <button type="submit">Deposit</button>
      </form>

    </div>
  );
}

export default WalletSummary;