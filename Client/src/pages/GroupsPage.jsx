import React, { useEffect, useState, useContext } from 'react';
import API from "../services/AxiosInstance";
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/GroupsPage.css';

const GroupsPage = () => {
  const { authToken, setUser, setAuthToken } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [errorTimeout, setErrorTimeout] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await API.get('/groups', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setGroups(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setAuthToken(null);
          setUser(null);
          navigate('/login');
        } else {
          setError('Failed to load groups.');
          setLoading(false);
        }
      }
    };

    if (authToken) {
      fetchGroups();
    } else {
      setLoading(false);
    }
  }, [authToken, navigate, setAuthToken, setUser]);

  const handleJoinGroup = async () => {
    try {
      const response = await API.post('/groups/members',
        { joinCode },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setJoinError('');
        navigate(`/groups/${response.data.id}`);
      }
    } catch (err) {
      if (err.status === 409) {
        setJoinError('You are already a member of this group')
      } else {
        setJoinError('Failed to join group. Please check the join code.');
      }
      if (errorTimeout) clearTimeout(errorTimeout);
      const timeout = setTimeout(() => setJoinError(''), 3000);
      setErrorTimeout(timeout);
    }
  };

  const handleCreateGroup = () => {
    navigate('/new-group');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="groupspage-container">
      <h1>Your Groups</h1>

      <div className="create-group-btn-container">
        <button className="create-btn" onClick={handleCreateGroup}>
          Create Group
        </button>
      </div>

      <div className="join-group-container">
        <h2>Join a Group</h2>
        <input
          type="text"
          placeholder="Enter Join Code"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
        />
        <button className="join-group-btn" onClick={handleJoinGroup}>
          Join Group
        </button>
      </div>

      {joinError && (
        <div className="join-error-message">
          <p>{joinError}</p>
        </div>
      )}

      <div className="groups-list">
        {groups.length === 0 ? (
          <p>You are not a member of any group.</p>
        ) : (
          groups.map((group) => (
            <div key={group.id} className="group-item">
              <h3>{group.title}</h3>
              <p>Join Code: {group.joinCode}</p>
              <Link to={`/groups/${group.id}`}>View Details</Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GroupsPage;
