import React, { useState, useContext, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from "../services/AxiosInstance";
import { AuthContext } from '../context/AuthContext';
import '../styles/AddTransaction.css';

const EditPurpose = () => {
  const { purposeId } = useParams();
  const { authToken } = useContext(AuthContext);
  const [form, setForm] = useState({ category: "", type: false });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [purpose, setPurpose] = useState(null);



  const fetchPurposeDetails = useCallback(async () => {
    try {
      const response = await API.get(`/purposes/${purposeId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const purposeData = response.data;

      setPurpose(purposeData);
    } catch (err) {
      setError('Failed to load group details.');
    }
  }, [purposeId, authToken]);


  useEffect(() => {
    if (authToken) {
      fetchPurposeDetails();
    }
  }, [authToken, fetchPurposeDetails]);

  useEffect(() => {
    if (purpose) {
      setForm((prev) => ({ ...prev, category: purpose.category || "" }));
    }
  }, [purpose]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.patch(`/purposes/${purpose.id}`,
        form,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      if (response.status === 201) {
        navigate('/purposes');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add transaction');
    }
  };


  return (
    <div className="add-transaction-container">
      <h2>Edit Purpose</h2>
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
        <button type="submit">Save Purpose</button>
      </form>
    </div>
  );
};

export default EditPurpose;

