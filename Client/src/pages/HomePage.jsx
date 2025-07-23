import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/AxiosInstance';
import { AuthContext } from '../context/AuthContext';
import TransactionsList from '../components/transactions/TransactionsList';
import '../styles/HomePage.css';
import { fetchTransactionsWithRelations } from '../pages/transactions/TransactionService';

const HomePage = () => {
  const { authToken, user, setUser, setAuthToken } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const transactionsResponse = await API.get('/transactions', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const transactionsWithDetails = await fetchTransactionsWithRelations(
          transactionsResponse.data.slice(0, 10),
          authToken
        );

        setTransactions(transactionsWithDetails);
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

    if (user) {
      fetchTransactions();
    } else {
      setLoading(false);
    }
  }, [authToken, user, setUser, setAuthToken, navigate]);

  if (loading)
    return (
      <div>
        Loading...(Please, be patient, it can take a minute for the first time)
      </div>
    );
  if (error) return <div>{error}</div>;

  return (
    <div className="homepage-container">
      {user ? (
        <>
          <h1>Welcome back, {user.name}!</h1>
          <div className="transactions-section">
            <h2>Recent Transactions</h2>
            <TransactionsList
              transactionsData={transactions}
              authToken={authToken}
            />
          </div>
        </>
      ) : (
        <div className="info-section">
          <h1>Welcome to Finance Tracker</h1>
          <p>
            Our app helps you effortlessly track your expenses and income, so
            you can focus on reaching your financial goals.
          </p>
          <ul>
            <li>Monitor all your transactions in one place</li>
            <li>Gain insights into your spending patterns</li>
            <li>Set and achieve your financial targets</li>
            <li>Secure, user-friendly, and free to use</li>
          </ul>
          <p>
            <strong>
              <Link to="/signup">Sign up</Link>
            </strong>{' '}
            or{' '}
            <strong>
              <Link to="/login">Log In</Link>
            </strong>{' '}
            to get started!
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
