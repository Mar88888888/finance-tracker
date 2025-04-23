import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SubscriptionsList from '../components/SubscriptionsList';
import API from "../services/AxiosInstance";

import '../styles/SubscriptionsPage.css';

const SubscriptionsPage = () => {
  const { authToken, setUser, setAuthToken } = useContext(AuthContext);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleDeleteSubscription = async (subscriptionId) => {
    try {
      await API.delete(`/subscriptions/${subscriptionId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setSubscriptions((prev) => prev.filter((s) => s.id !== subscriptionId));
    } catch (err) {
      setError('Failed to delete subscription.');
    }
  };

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await API.get('/subscriptions', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setSubscriptions(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 401) {
          setAuthToken(null);
          setUser(null);
          navigate('/login');
        } else {
          setError('Failed to load subscriptions.');
          setLoading(false);
        }
      }
    };

    if (authToken) {
      fetchSubscriptions();
    } else {
      setLoading(false);
    }
  }, [authToken, setAuthToken, setUser, navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="subscriptions-page-container">
      <h1>My Subscriptions</h1>
      <SubscriptionsList
        subscriptions={subscriptions}
        onDeleteSubscription={handleDeleteSubscription}
      />
    </div>
  );
};

export default SubscriptionsPage;
