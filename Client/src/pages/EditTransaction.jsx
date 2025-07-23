import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/AxiosInstance';
import { AuthContext } from '../context/AuthContext';
import '../styles/AddTransaction.css';

const EditTransaction = () => {
  const { transactionId } = useParams();
  const { authToken } = useContext(AuthContext);
  const [form, setForm] = useState({ purposeId: '', sum: '', date: '' });
  const [purposes, setPurposes] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);

  const fetchTransactionDetails = useCallback(async () => {
    try {
      const response = await API.get(`/transactions/${transactionId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const transactionData = response.data;

      setTransaction(transactionData);
    } catch (err) {
      setError('Failed to load group details.');
    }
  }, [transactionId, authToken]);

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
    fetchTransactionDetails();

    fetchPurposes();
  }, [authToken, fetchTransactionDetails]);

  useEffect(() => {
    if (transaction) {
      setForm({
        purposeId: transaction.purposeId || '',
        sum: transaction.sum || '',
        date: transaction.date ? transaction.date.split('T')[0] : '',
      });
    }
  }, [transaction]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (e.target.type !== 'date') {
      setForm((prev) => ({ ...prev, [name]: parseInt(value) }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.patch(
        `/transactions/${transaction.id}`,
        form,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      if (response.status === 200) {
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
      <h2>Edit Transaction</h2>
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
        <button type="submit">Save Transaction</button>
      </form>
    </div>
  );
};

export default EditTransaction;
