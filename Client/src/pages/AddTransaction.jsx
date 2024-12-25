import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/AddTransaction.css';

const AddTransaction = () => {
  const { authToken } = useContext(AuthContext);
  const [form, setForm] = useState({ purposeId: "", sum: "", date: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/transactions`,
        form,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
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
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <div className="add-transaction-container">
      <h2>Add Transaction</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Purpose:
          <input
            type="text"
            name="purposeId"
            value={form.purposeId}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            name="sum"
            value={form.sum}
            onChange={handleInputChange}
            required
          />
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
