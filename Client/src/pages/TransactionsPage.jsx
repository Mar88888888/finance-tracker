import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import TransactionsList from '../components/TransactionsList';
import API from "../services/AxiosInstance";
import TransactionsCharts from '../components/TransactionsCharts';

import '../styles/TransactionsPage.css';

const TransactionsPage = () => {
  const { authToken, setUser, setAuthToken } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleDeleteTransaction = async (transactionId) => {
    try {
      await API.delete(`/transactions/${transactionId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setTransactions((prevTransactions) =>
        prevTransactions.filter((t) => t.id !== transactionId)
      );
    } catch (err) {
      setError('Failed to delete transaction.');
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await API.get(`/transactions`, {
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

  if (loading) return <div>Loading...(Please, be patient, it can take some time)</div>;
  if (error) return <div>{error}</div>;

  return (
  <>
    <div className="transactions-page-container">

      <h1>My Transactions</h1>

      <button
        className="create-btn"
        onClick={() => navigate('/transactions/add')}
        >
        Add Transaction
      </button>

      <TransactionsList transactionsData={transactions} authToken={authToken} onDeleteTransaction={handleDeleteTransaction} />
      {transactions.length > 0 && <TransactionsCharts transactions={transactions}  authToken={authToken} />}
    </div>
  </>
  );
};

export default TransactionsPage;
