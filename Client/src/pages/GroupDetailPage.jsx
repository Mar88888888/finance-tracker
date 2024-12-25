import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/GroupDetailPage.css';
import TransactionsList from '../components/TransactionsList';

const GroupDetailPage = () => {
  const { groupId } = useParams();
  const { authToken } = useContext(AuthContext);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');
  const [copyTimeout, setCopyTimeout] = useState(null);
  const [viewMode, setViewMode] = useState('members');
  const [transactions, setTransactions] = useState([]);

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
      } catch (err) {
        setError('Failed to load group details.');
      } finally {
        setLoading(false);
      }
    };

    const fetchGroupTransactions = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/groups/${groupId}/transactions`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setTransactions(response.data);
      } catch (err) {
        setError('Failed to load transactions.');
      }
    };

    if (authToken) {
      fetchGroupDetails();
      fetchGroupTransactions();
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

  const renderMembers = () => (
    <div>
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
    </div>
  );

  const renderTransactions = () => (
    <div>
      <h2>Transactions</h2>
      {transactions.length === 0 ? (
        <p>No transactions available for this group.</p>
      ) : (
        <TransactionsList transactionsData={transactions} authToken={authToken} />

      )}
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="groupdetailpage-container">
      <h1>{group.title}</h1>
      <div className="join-code-container" onClick={copyToClipboard}>
        <p className="join-code-label">Join Code:</p>
        <p className="join-code">{group.joinCode}</p>
      </div>

      {copySuccess && <div className="copy-success-message">{copySuccess}</div>}

      <div className="view-mode-toggle">
        <button
          className={viewMode === 'members' ? 'active' : ''}
          onClick={() => setViewMode('members')}
        >
          View Members
        </button>
        <button
          className={viewMode === 'transactions' ? 'active' : ''}
          onClick={() => setViewMode('transactions')}
        >
          View Transactions
        </button>
      </div>

      {viewMode === 'members' ? renderMembers() : renderTransactions()}

      <Link to="/groups" className="back-link">
        Back to Groups
      </Link>
    </div>
  );
};

export default GroupDetailPage;
