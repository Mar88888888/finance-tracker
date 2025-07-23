import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../styles/PurposeItem.css';
import API from '../../services/AxiosInstance';
import { AuthContext } from '../../context/AuthContext';

const PurposeItem = ({ purpose, groupId, setPurposes, purposes, isOwner }) => {
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDeletePurpose = async () => {
    try {
      await API.delete(`/groups/${groupId}/purposes/${purpose.id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setPurposes(purposes.filter((p) => p.id !== purpose.id));
    } catch (err) {
      if (err.status === 401) {
        navigate('/login');
      }
      console.error(err);
    }
  };

  const handleEditPurpose = async () => {
    navigate(`/purposes/edit/${purpose.id}`);
  };

  return (
    <div className="purpose-item">
      <div className="category-container">{purpose.category}</div>
      {isOwner && (
        <div className="btn-container">
          {!groupId && (
            <button onClick={handleEditPurpose} className="create-btn">
              Edit
            </button>
          )}
          <button onClick={handleDeletePurpose} className="create-btn">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

PurposeItem.propTypes = {
  purpose: PropTypes.shape({
    id: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
  }).isRequired,
};

export default PurposeItem;
