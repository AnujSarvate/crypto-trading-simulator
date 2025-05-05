import React from 'react';

function PortfolioPage({ portfolio, cryptoData }) {
  const getPriceForSymbol = (symbol) => {
    const coin = cryptoData.find(c => c.symbol.toUpperCase() === symbol);
    return coin?.current_price || 0;
  };

  const portfolioEntries = Object.entries(portfolio).filter(([_, amount]) => amount > 0);
  const totalValue = portfolioEntries.reduce((total, [symbol, amount]) => {
    const price = getPriceForSymbol(symbol);
    return total + price * amount;
  }, 0);

  const formatCurrency = (value) =>
    value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div>
      <h2>Your Portfolio</h2>

      {portfolioEntries.length === 0 ? (
        <p>No holdings.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Amount</th>
              <th>Current Price</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {portfolioEntries.map(([symbol, amount]) => {
              const price = getPriceForSymbol(symbol);
              const value = price * amount;
              return (
                <tr key={symbol}>
                  <td>{symbol}</td>
                  <td>{amount.toFixed(4)}</td>
                  <td>${formatCurrency(price)}</td>
                  <td>${formatCurrency(value)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {portfolioEntries.length > 0 && (
        <h3>Total Portfolio Value: ${formatCurrency(totalValue)}</h3>
      )}
    </div>
  );
}

export default PortfolioPage;