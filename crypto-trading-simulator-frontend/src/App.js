import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import HomePage from './pages/HomePage';
import PortfolioPage from './pages/PortfolioPage';
import BuySellPage from './pages/BuySellPage';
import WalletSummary from './components/WalletSummary';

import axios from 'axios';

function App() {
  const [portfolio, setPortfolio] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [cryptoData, setCryptoData] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);

  
  useEffect(() => {
    axios.get('http://localhost:8080/api/crypto/list')
      .then(res => setCryptoData(res.data))
      .catch(err => console.error("Crypto list fetch error", err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get('http://localhost:8080/api/crypto/list')
        .then(res => setCryptoData(res.data))
        .catch(err => console.error("Auto-refresh price fetch error:", err));
    }, 300000); 
  
    return () => clearInterval(interval); // cleanup
  }, []);


  const handleTrade = ({ symbol, amount, type }) => {
    setTransactions(prev => [...prev, { symbol, amount, type, time: new Date() }]);

    setPortfolio(prev => {
      const current = prev[symbol] || 0;
      const updated = type === 'buy' ? current + amount : current - amount;
      return { ...prev, [symbol]: Math.max(0, updated) };
    });
  };

  return (
    <Router>
      <div>
        <h1>Crypto Trading Simulator</h1>
        <nav>
          <Link to="/">Home</Link> |{" "}
          <Link to="/portfolio">Portfolio</Link> |{" "}
          <Link to="/trade">Trade</Link> |{" "}
        </nav>

        <WalletSummary
        walletBalance={walletBalance}
        setWalletBalance={setWalletBalance}
      />

        <Routes>
          <Route path="/" element={<HomePage cryptoData={cryptoData} />} />
          <Route path="/portfolio" element={
          <PortfolioPage portfolio={portfolio} cryptoData={cryptoData} />} />
          <Route
            path="/trade"
            element={
              <BuySellPage
                onTrade={handleTrade}
                portfolio={portfolio}
                cryptoData={cryptoData}
                walletBalance={walletBalance}
                setWalletBalance={setWalletBalance}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;