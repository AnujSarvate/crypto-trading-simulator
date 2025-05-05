import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BuySellForm from '../components/BuySellForm';

function BuySellPage({ onTrade, portfolio, cryptoData, walletBalance, setWalletBalance }) {
  const [cryptoList, setCryptoList] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/crypto/list')
      .then(res => setCryptoList(res.data))
      .catch(err => console.error("Failed to fetch crypto list", err));
  }, []);

  return (
    <div>
      <h2>Trade Crypto</h2>
  
      {cryptoData.length === 0 ? (
        <p>Loading crypto list...</p>
      ) : (
        <BuySellForm
          onTrade={onTrade}
          allowedCryptos={cryptoData}
          portfolio={portfolio}
          walletBalance={walletBalance}
          setWalletBalance={setWalletBalance}
        />
      )}
    </div>
  );
}

export default BuySellPage;