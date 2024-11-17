import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/GroupsPage.css';

const GroupsPage = () => {
  const { authToken } = useContext(AuthContext); 
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/groups`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        console.log(response.data);
        setGroups(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load groups.');
        setLoading(false);
      }
    };

    if (authToken) {
      fetchGroups();
    } else {
      setLoading(false);
    }
  }, [authToken]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="groupspage-container">
      <h1>Your Groups</h1>
      <div className="groups-list">
        {groups.length === 0 ? (
          <p>You are not a member of any group.</p>
        ) : (
          groups.map(group => (
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
