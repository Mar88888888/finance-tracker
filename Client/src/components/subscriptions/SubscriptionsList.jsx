import { useState } from 'react';
import PropTypes from 'prop-types';
import SubscriptionItem from './SubscriptionItem';

import '../../styles/subscriptions/SubscriptionsList.css';

const SubscriptionsList = ({ subscriptions, onDeleteSubscription }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(subscriptions.length / itemsPerPage);
  const paginatedSubscriptions = subscriptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="subscriptions-list">
      {subscriptions.length === 0 ? (
        <p>No subscriptions found.</p>
      ) : (
        <>
          <div className="subscription-header">
            <div>Start Date</div>
            <div>Interval</div>
            <div>Unit</div>
            <div>Next Execution</div>
            <div>End Date</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          {paginatedSubscriptions.map((sub) => (
            <SubscriptionItem
              key={sub.id}
              subscription={sub}
              onDelete={onDeleteSubscription}
            />
          ))}

          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={currentPage === i + 1 ? 'active' : ''}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

SubscriptionsList.propTypes = {
  subscriptions: PropTypes.array.isRequired,
  onDeleteSubscription: PropTypes.func.isRequired,
};

export default SubscriptionsList;
