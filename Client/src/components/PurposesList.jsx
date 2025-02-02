import React from 'react';
import PropTypes from 'prop-types';
import PurposeItem from './PurposeItem';
import '../styles/PurposesList.css';

const PurposesList = ({ purposesData }) => {
  if (!purposesData.length) {
    return <p>No purposes available.</p>;
  }

  return (
    <div className="purposes-list">
      <div className="purposes-header">
        <div>Category</div>
      </div>
      {purposesData.map((purpose) => (
        <PurposeItem key={purpose.id} purpose={purpose} />
      ))}
    </div>
  );
};

PurposesList.propTypes = {
  purposesData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default PurposesList;
