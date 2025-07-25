import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/AxiosInstance';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/transactions/AddTransaction.css';

const AddPurpose = () => {
  const { authToken } = useContext(AuthContext);
  const [form, setForm] = useState({ category: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/purposes', form, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.status === 201) {
        navigate('/purposes');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add transaction');
    }
  };

  return (
    <div className="add-transaction-container">
      <h2>Add Purpose</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleInputChange}
            required
          />
        </label>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Add Purpose</button>
      </form>
    </div>
  );
};

export default AddPurpose;
