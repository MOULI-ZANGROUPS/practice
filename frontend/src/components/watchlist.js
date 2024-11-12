import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../portfolio.css';
import Header from './Header';
import Footer from './Footer';

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const email = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!email) return;
      try {
        const response = await axios.get('http://localhost:5000/api/watchlist', {
          params: { userId: email }
        });
        setWatchlist(response.data);
      } catch (error) {
        console.error('Error fetching watchlist:', error);
        setError('Error fetching watchlist');
      }
    };
    fetchWatchlist();
  }, [email]);

  const handleRemoveFromWatchlist = async (symbol) => {
    if (!window.confirm(`Are you sure you want to remove ${symbol} from your watchlist?`)) {
      return;
    }
    
    try {
      await axios.delete(`http://localhost:5000/api/watchlist/${symbol}`, {
        params: { userId: email }
      });
      
      setWatchlist(watchlist.filter(stock => stock.symbol !== symbol));
      setMessage(`Successfully removed ${symbol} from your watchlist.`);
    } catch (error) {
      console.error('Error removing stock from watchlist:', error);
      setError('Error removing stock');
    }
  };

  return (
    <div>
      <Header />

      <div className="watchlist-container">
        <h3>Watchlist</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {watchlist.length > 0 ? (
          <table className="watchlist-table">
            <thead>
              <tr>
                <th className="watchlist-header">Symbol</th>
                <th className="watchlist-header">Price</th>
                <th className="watchlist-header">Change</th>
                <th className="watchlist-header">Change (%)</th>
                <th className="watchlist-header">Last Updated</th>
                <th className="watchlist-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((stock, index) => (
                <tr key={index}>
                  <td className="watchlist-symbol">{stock.symbol}</td>
                  <td className="watchlist-price">₹{stock.price}</td>
                  <td className="watchlist-change">{stock.change}</td>
                  <td className="watchlist-change-percent">{stock.changePercent}</td>
                  <td className="watchlist-last-updated">{stock.lastUpdated}</td>
                  <td className="icon-cell">
                    <i
                      className="fa-solid fa-trash"
                      title="Remove from watchlist"
                      onClick={() => handleRemoveFromWatchlist(stock.symbol)}
                      style={{ cursor: 'pointer', color: 'red' }}
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Your watchlist is empty. Start adding stocks!</p>
        )}
      </div>

      <Footer />
    </div>
  );
}