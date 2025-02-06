import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/GroupDetailPage.css';
import TransactionsList from '../components/TransactionsList';
import PurposesList from '../components/PurposesList';

const GroupDetailPage = () => {
  const { groupId } = useParams();
  const { authToken, user } = useContext(AuthContext);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');
  const [copyTimeout, setCopyTimeout] = useState(null);
  const [viewMode, setViewMode] = useState('members');
  const [transactions, setTransactions] = useState([]);
  const [groupPurposes, setGroupPurposes] = useState([]);
  const [showAddPurposeForm, setShowAddPurposeForm] = useState(false);
  const [selectedPurposeIds, setSelectedPurposeIds] = useState([]);
  const [availablePurposes, setAvailablePurposes] = useState([]);

  const fetchAvailablePurposes = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/purposes/`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setAvailablePurposes(response.data);
    } catch (err) {
      console.error('Failed to fetch available purposes:', err);
    }
  }, [authToken]);

  useEffect(() => {
    if (authToken) fetchAvailablePurposes();
  }, [authToken, fetchAvailablePurposes]);



  const fetchGroupDetails = useCallback(async () => {
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
  }, [groupId, authToken]);

  const fetchGroupTransactions = useCallback(async () => {
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
  }, [groupId, authToken]);

  const fetchPurposes = useCallback(async () => {
    if (!group?.purposes || group.purposes.length === 0) return;

    try {
      const purposeRequests = group.purposes.map((id) =>
        axios.get(`${process.env.REACT_APP_API_URL}/purposes/${id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        })
      );

      const responses = await Promise.all(purposeRequests);
      setGroupPurposes(responses.map((res) => res.data));
    } catch (err) {
      console.error('Failed to load purposes:', err);
    }
  }, [group, authToken]);

  const handleAddPurpose = async () => {
    if (selectedPurposeIds.length === 0) return;

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/groups/${groupId}/purposes`,
        { purposeIds: selectedPurposeIds.map((p) => p.id) },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      fetchPurposes();
      fetchGroupTransactions();
      setSelectedPurposeIds([]);
      setShowAddPurposeForm(false);
    } catch (err) {
      console.error('Failed to add purposes:', err);
    }
  };



  useEffect(() => {
    if (authToken) {
      fetchGroupDetails();
      fetchGroupTransactions();
    } else {
      setLoading(false);
    }

    return () => {
      if (copyTimeout) clearTimeout(copyTimeout);
    };
  }, [authToken, groupId, fetchGroupDetails, fetchGroupTransactions, copyTimeout]);

  useEffect(() => {
    if (group) fetchPurposes();
  }, [group, fetchPurposes]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(group.joinCode);
    setCopySuccess('Join code copied to clipboard!');

    if (copyTimeout) clearTimeout(copyTimeout);

    const timeout = setTimeout(() => setCopySuccess(''), 3000);
    setCopyTimeout(timeout);
  };

  const addToSelected = (purpose) => {
    setSelectedPurposeIds((prev) => [...prev, purpose]);
  };

  const removeFromSelected = (purpose) => {
    setSelectedPurposeIds((prev) => prev.filter((p) => p.id !== purpose.id));
  };



  return (
    <div className="groupdetailpage-container">
      {loading ? <div>Loading...</div> : error ? <div>{error}</div> : (
        <>
          <h1>{group.title}</h1>
          <div className="join-code-container" onClick={copyToClipboard}>
            <p className="join-code-label">Join Code:</p>
            <p className="join-code">{group.joinCode}</p>
          </div>
          {copySuccess && <div className="copy-success-message">{copySuccess}</div>}
          <div className="view-mode-toggle">
            <button className={viewMode === 'members' ? 'active' : ''} onClick={() => setViewMode('members')}>
              View Members
            </button>
            <button className={viewMode === 'transactions' ? 'active' : ''} onClick={() => setViewMode('transactions')}>
              View Transactions
            </button>
            {group.owner.id === user.id && (
              <button className={viewMode === 'settings' ? 'active' : ''} onClick={() => setViewMode('settings')}>
                View Settings
              </button>
            )}
          </div>
          {viewMode === 'members' && (
            <div>
              <h2>Members</h2>
              {group.members.length === 0 ? <p>No members in this group.</p> : (
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
          )}
          {viewMode === 'transactions' && (
            <div>
              <h2>Transactions</h2>
              {transactions.length === 0 ? <p>No transactions available for this group.</p> : (
                <TransactionsList transactionsData={transactions} authToken={authToken} />
              )}
            </div>
          )}
          {viewMode === 'settings' && group.owner.id === user.id && (
            <div>
              <h2>Group Settings</h2>
              <h3>Group Purposes</h3>
              {groupPurposes.length === 0 ? <p>No purposes assigned to this group.</p> : (
                <PurposesList purposesData={groupPurposes} groupId={group.id} setPurposes={setGroupPurposes} />
              )}
              <button
                className="add-purpose-btn"
                onClick={() => setShowAddPurposeForm((prev) => !prev)}
              >
                Add Purpose
              </button>
              {showAddPurposeForm && (
                <div className="modal-overlay" onClick={() => setShowAddPurposeForm(false)}>
                  <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                    <h3>Select Purposes</h3>

                    <div className="selected-purposes">
                      {selectedPurposeIds.length === 0 ? (
                        <p className="no-selection">No purposes selected.</p>
                      ) : (
                        selectedPurposeIds.map((purpose) => (
                          <div
                            key={purpose.id}
                            className="selected-purpose-item"
                            onClick={() => removeFromSelected(purpose)}
                          >
                            {purpose.category} <span className="remove-icon">✖</span>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="available-purposes">
                      {availablePurposes
                        .filter((purpose) => !groupPurposes.some((p) => p.id === purpose.id))
                        .length === 0 ? (
                        <p className="no-selection">No purposes to add.</p>
                      ) : (
                        availablePurposes
                          .filter((purpose) => !groupPurposes.some((p) => p.id === purpose.id))
                          .filter((purpose) => !selectedPurposeIds.some((p) => p.id === purpose.id))
                          .map((purpose) => (
                            <div
                              key={purpose.id}
                              className="purpose-item"
                              onClick={() => addToSelected(purpose)}
                            >
                              {purpose.category}
                            </div>
                          ))
                      )}
                    </div>

                    <div className="modal-footer">
                      <button className="cancel-btn" onClick={() => setShowAddPurposeForm(false)}>
                        Cancel
                      </button>
                      <button className="add-btn" onClick={handleAddPurpose}>
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}


            </div>
          )}
          <Link to="/groups" className="back-link">Back to Groups</Link>
        </>
      )}
    </div>
  );
};

export default GroupDetailPage;
