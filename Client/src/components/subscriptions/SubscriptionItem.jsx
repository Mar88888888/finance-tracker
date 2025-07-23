const SubscriptionItem = ({ subscription, onDelete }) => {
  return (
    <div className="subscription-item">
      <div>{new Date(subscription.startDate).toLocaleDateString()}</div>
      <div>{subscription.interval}</div>
      <div>{subscription.unit}</div>
      <div>{new Date(subscription.nextExecutionDate).toLocaleDateString()}</div>
      {subscription.endDate === null ? (
        <div>Not set</div>
      ) : (
        <div>{new Date(subscription.endDate).toLocaleDateString()}</div>
      )}
      <div>{subscription.isActive ? 'Active' : 'Inactive'}</div>
      <div>
        <button
          className="delete-btn"
          onClick={() => onDelete(subscription.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default SubscriptionItem;
