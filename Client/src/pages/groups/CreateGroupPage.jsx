import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import API from '../../services/AxiosInstance';
import '../styles/CreateGroupPage.css';

const CreateGroupPage = () => {
  const { authToken } = useContext(AuthContext);
  const [groupTitle, setGroupTitle] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post(
        '/groups',
        { title: groupTitle },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      navigate(`/groups/${response.data.id}`);
    } catch (err) {
      setError('Failed to create group.');
    }
  };

  return (
    <div className="creategroup-container">
      <h2>Create New Group</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="groupTitle">Group Title</label>
          <input
            type="text"
            id="groupTitle"
            value={groupTitle}
            onChange={(e) => setGroupTitle(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Group</button>
      </form>
    </div>
  );
};

export default CreateGroupPage;
