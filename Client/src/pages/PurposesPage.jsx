import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import PurposesList from '../components/PurposesList';

import '../styles/PurposesPage.css';

const PurposesPage = () => {
  const { authToken, setUser, setAuthToken } = useContext(AuthContext);
  const [purposes, setPurposes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurposes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/purposes`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setPurposes(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setAuthToken(null);
          setUser(null);
          navigate('/login');
        } else {
          setError('Failed to load purposes.');
          setLoading(false);
        }
      }
    };

    if (authToken) {
      fetchPurposes();
    } else {
      setLoading(false);
    }
  }, [authToken, navigate, setAuthToken, setUser]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="purposes-page-container">
      <h1>My Purposes</h1>
      <button
        className="create-btn"
        onClick={() => navigate('/purposes/add')}
      >
        Add Purpose
      </button>
      <PurposesList purposesData={purposes} isOwner={true} setPurposes={setPurposes} />
    </div>
  );
};

export default PurposesPage;
