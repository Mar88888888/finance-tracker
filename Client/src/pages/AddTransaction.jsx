import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/AxiosInstance';
import { AuthContext } from '../context/AuthContext';
import '../styles/AddTransaction.css';

const AddTransaction = () => {
  const { authToken } = useContext(AuthContext);
  const [form, setForm] = useState({
    purposeId: '',
    sum: '',
    currency: '',
    date: '',
  });
  const [currencies, setCurrencies] = useState([]);
  const [purposes, setPurposes] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurposes = async () => {
      try {
        const response = await API.get('/purposes', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setPurposes(response.data);
      } catch (err) {
        setError('Failed to load purposes');
      }
    };

    const fetchCurrencies = async () => {
      try {
        const response = await API.get('/currencies', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setCurrencies(response.data);
      } catch (err) {
        setError('Failed to load currencies');
      }
    };

    fetchPurposes();
    fetchCurrencies();
  }, [authToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'sum'
          ? parseFloat(value)
          : name === 'purposeId'
          ? parseInt(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/transactions', form, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.status === 201) {
        navigate('/transactions');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add transaction');
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.date).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <div className="add-transaction-container">
      <h2>Add Transaction</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Purpose:
          <select
            name="purposeId"
            value={form.purposeId}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              Select a purpose
            </option>
            {purposes.map((purpose) => (
              <option key={purpose.id} value={purpose.id}>
                {purpose.category}
              </option>
            ))}
          </select>
        </label>
        <label>
          Price:
          <div className="amount-currency-wrapper">
            <input
              type="number"
              name="sum"
              value={form.sum}
              onChange={handleInputChange}
              required
            />
            <select
              name="currency"
              value={form.currency}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Select
              </option>
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}
                </option>
              ))}
            </select>
          </div>
        </label>
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleInputChange}
            max={getTodayDate()}
            required
          />
        </label>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Add Transaction</button>
      </form>
    </div>
  );
};

export default AddTransaction;
