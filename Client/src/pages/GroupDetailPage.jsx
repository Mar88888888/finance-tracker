import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/GroupDetailPage.css';

const GroupDetailPage = () => {
  const { groupId } = useParams();
  const { authToken } = useContext(AuthContext);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');
  const [copyTimeout, setCopyTimeout] = useState(null);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/groups/${groupId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const groupData = response.data;
        const { members, owner } = groupData;
        groupData.members = [
          { ...owner, isOwner: true },
          ...members.filter((member) => member.id !== owner.id),
        ];

        setGroup(groupData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load group details.');
        setLoading(false);
      }
    };

    if (authToken) {
      fetchGroupDetails();
    } else {
      setLoading(false);
    }

    return () => {
      if (copyTimeout) clearTimeout(copyTimeout);
    };
  }, [authToken, groupId, copyTimeout]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(group.joinCode);
    setCopySuccess('Join code copied to clipboard!');

    if (copyTimeout) clearTimeout(copyTimeout);

    const timeout = setTimeout(() => setCopySuccess(''), 3000);
    setCopyTimeout(timeout);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="groupdetailpage-container">
      <h1>{group.title}</h1>
      <div className="join-code-container" onClick={copyToClipboard}>
        <p className="join-code-label">Join Code:</p>
        <p className="join-code">{group.joinCode}</p>
      </div>
      {copySuccess && <p className="copy-success">{copySuccess}</p>}
      <h2>Members</h2>
      {group.members.length === 0 ? (
        <p>No members in this group.</p>
      ) : (
        <div className="members-list">
          {group.members.map((member) => (
            <div key={member.id} className="member-item">
              <h3>
                {member.name} {member.isOwner && <span className="owner-badge">Owner</span>}
              </h3>
              <p>Email: {member.email}</p>
              <p>Age: {member.age}</p>
              <p>Gender: {member.gender ? 'Male' : 'Female'}</p>
            </div>
          ))}
        </div>
      )}
      <Link to="/groups" className="back-link">
        Back to Groups
      </Link>
    </div>
  );
};

export default GroupDetailPage;
