import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/AxiosInstance';
import { AuthContext } from '../context/AuthContext';

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const { setUser, setAuthToken } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      setAuthToken(token);
      API.get('/users/auth/bytoken', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((res) => {
        setUser(res.data);
        navigate('/');
      }).catch(() => {
        navigate('/login');
      });
    } else {
      navigate('/login');
    }
  }, [navigate, setUser, setAuthToken]);

  return <div>Signing in with Google...</div>;
};

export default OAuth2RedirectHandler;
