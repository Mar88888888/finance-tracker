import React from 'react';
import PropTypes from 'prop-types';
import '../styles/PurposeItem.css';

const PurposeItem = ({ purpose }) => {
  return (
    <div className="purpose-item">
      <div>{purpose.category}</div>
    </div>
  );
};

PurposeItem.propTypes = {
  purpose: PropTypes.shape({
    id: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default PurposeItem;
