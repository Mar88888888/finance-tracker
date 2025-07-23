import { useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../services/AxiosInstance';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/subscriptions/AddSubscription.css';

const AddSubscription = () => {
  const { authToken } = useContext(AuthContext);
  const [form, setForm] = useState({
    startDate: '',
    endDate: '',
    interval: 1,
    unit: 'MONTH',
  });
  const [error, setError] = useState(null);
  const { transactionId } = useParams();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'intervalValue' || name === 'sum' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post(
        `/transactions/${transactionId}/subscriptions`,
        form,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      if (response.status === 201) {
        navigate('/subscriptions');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add subscription');
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
    <div className="add-subscription-container">
      <h2>Add Subscription</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Start Date:
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          End Date:
          <input
            type="date"
            name="endDate"
            min={
              form.startDate
                ? form.startDate > getTodayDate()
                  ? form.startDate
                  : getTodayDate()
                : getTodayDate()
            }
            value={form.endDate}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Interval:
          <div className="interval-group">
            <input
              type="number"
              name="intervalValue"
              value={form.intervalValue}
              onChange={handleInputChange}
              min={1}
              required
            />
            <select
              name="intervalUnit"
              value={form.intervalUnit}
              onChange={handleInputChange}
              required
            >
              <option value="DAY">Day</option>
              <option value="WEEK">Week</option>
              <option value="MONTH">Month</option>
              <option value="YEAR">Year</option>
            </select>
          </div>
        </label>

        {error && <p className="error-message">{error}</p>}

        <button type="submit">Add Subscription</button>
      </form>
    </div>
  );
};

export default AddSubscription;
