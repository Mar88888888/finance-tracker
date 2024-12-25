import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import TransactionsList from '../components/TransactionsList';
import '../styles/TransactionsPage.css';

const TransactionsPage = () => {
  const { authToken, setUser, setAuthToken } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/transactions`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setTransactions(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setAuthToken(null);
          setUser(null);
          navigate('/login');
        } else {
          setError('Failed to load transactions.');
          setLoading(false);
        }
      }
    };

    if (authToken) {
      fetchTransactions();
    } else {
      setLoading(false);
    }
  }, [authToken, navigate, setAuthToken, setUser]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="transactions-page-container">
      <h1>My Transactions</h1>
      <button
        className="add-transaction-button"
        onClick={() => navigate('/transactions/add')}
      >
        Add Transaction
      </button>
      <TransactionsList transactionsData={transactions} authToken={authToken} />
    </div>
  );
};

export default TransactionsPage;
