import React from 'react';

const TransactionItem = ({ transaction }) => {
  return (
    <div className="transaction-item">
      <div>{transaction.member.name}</div>
      <div>{transaction.purpose.category}</div>
      <div>${transaction.sum.toFixed(2)}</div>
      <div>{new Date(transaction.date).toLocaleDateString()}</div>
    </div>
  );
};

export default TransactionItem;

