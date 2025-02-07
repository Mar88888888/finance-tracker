import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import '../styles/PurposeItem.css';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const PurposeItem = ({ purpose, groupId, setPurposes, purposes, isOwner }) => {
  const { authToken } = useContext(AuthContext);

  const handleDeletePurpose = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/groups/${groupId}/purposes/${purpose.id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setPurposes(purposes.filter((p) => p.id !== purpose.id));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="purpose-item">
      <div className='category-container'>{purpose.category}</div>
      {isOwner && (
        <div className='btn-container'>
          <button onClick={handleDeletePurpose} className='create-btn'>Delete</button>
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
