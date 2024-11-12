import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../portfolio.css';
import Header from './Header';
import Footer from './Footer';

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); 
  const email = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!email) return;
      try {
        const response = await axios.get('http://localhost:5000/api/portfolio', {
          params: { userId: email }
        });
        setPortfolio(response.data);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
        setError('Error fetching portfolio');
      }
    };
    fetchPortfolio();
  }, [email]);

  const handleRemoveFromPortfolio = async (symbol) => {
    if (!window.confirm(`Are you sure you want to remove ${symbol} from your portfolio?`)) {
      return;
    }
    
    try {
      await axios.delete(`http://localhost:5000/api/portfolio/${symbol}`, {
        params: { userId: email }
      });
      
      setPortfolio(portfolio.filter(stock => stock.symbol !== symbol));
      setMessage(`Successfully removed ${symbol} from your portfolio.`);
    } catch (error) {
      console.error('Error removing stock from portfolio:', error);
      setError('Error removing stock');
    }
  };

  return (
    <div>
      <Header />
      <div className='portfolio-container'>
      <h3>Portfolio</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>} 
      {portfolio.length > 0 ? (
        <table className="portfolio-table">
          <thead>
            <tr>
            <th className="portfolio-table-header">Symbol</th>
                <th className="portfolio-table-header">Price</th>
                <th className="portfolio-table-header">Change</th>
                <th className="portfolio-table-header">Change (%)</th>
                <th className="portfolio-table-header">Last Updated</th>
              <th className="portfolio-table-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map((stock, index) => (
              <tr key={index}>
                <td className="portfolio-stock-symbol">{stock.symbol}</td>
                  <td className="portfolio-stock-price">₹{stock.price}</td>
                  <td className="portfolio-stock-change">{stock.change}</td>
                  <td className="portfolio-stock-changepercent">{stock.changePercent}</td>
                  <td className="portfolio-stock-lastupdated">{stock.lastUpdated}</td>
                <td className="icon-cell">
                  <i
                    className="fa-solid fa-trash"
                    title="Remove from portfolio"
                    onClick={() => handleRemoveFromPortfolio(stock.symbol)}
                    style={{ cursor: 'pointer', color: 'red' }}
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No stocks in portfolio</p>
      )}</div>

      <Footer />
    </div>
  );
}