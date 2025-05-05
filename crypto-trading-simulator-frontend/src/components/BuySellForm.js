import React, { useState } from 'react';

function BuySellForm({ onTrade, allowedCryptos, portfolio, walletBalance, setWalletBalance }) {
  const [symbol, setSymbol] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('buy');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const cleanSymbol = symbol.trim().toUpperCase();
    const valid = allowedCryptos.some(c => c.symbol.toUpperCase() === cleanSymbol);
  
    if (!valid) {
      setError(`'${cleanSymbol}' is not a valid crypto symbol.`);
      return;
    }
  
    const crypto = allowedCryptos.find(c => c.symbol.toUpperCase() === cleanSymbol);
    const price = crypto.current_price;
    const tradeAmount = Number(amount);
    const totalCost = price * tradeAmount;
  
    if (type === 'buy') {
      if (totalCost > walletBalance) {
        setError(`Insufficient funds. You need $${totalCost.toFixed(2)}, but have $${walletBalance.toFixed(2)}.`);
        return;
      }
  
      setWalletBalance(prev => prev - totalCost);
    } else {
 
      const currentOwned = portfolio[cleanSymbol] || 0;
      if (tradeAmount > currentOwned) {
        setError(`You only own ${currentOwned.toFixed(4)} ${cleanSymbol}, but tried to sell ${tradeAmount}.`);
        return;
      }
  
      setWalletBalance(prev => prev + totalCost);
    }
  
    setError('');
    onTrade({ symbol: cleanSymbol, amount: tradeAmount, type });
    setSymbol('');
    setAmount('');
    setType('buy');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Buy/Sell Crypto</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input
        type="text"
        placeholder="Symbol (e.g. BTC)"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        min="0.0001"
        step="any"
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="buy">Buy</option>
        <option value="sell">Sell</option>
      </select>
      <button type="submit">Submit</button>
    </form>
  );
}

export default BuySellForm;