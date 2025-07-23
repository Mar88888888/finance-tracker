import PropTypes from 'prop-types';
import PurposeItem from './PurposeItem';
import '../../styles/purposes/PurposesList.css';

const PurposesList = ({ purposesData, groupId, setPurposes, isOwner }) => {
  if (!purposesData.length) {
    return <p>No purposes available.</p>;
  }

  return (
    <div className="purposes-list">
      {purposesData.map((purpose) => (
        <PurposeItem
          key={purpose.id}
          isOwner={isOwner}
          purpose={purpose}
          groupId={groupId}
          setPurposes={setPurposes}
          purposes={purposesData}
        />
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
