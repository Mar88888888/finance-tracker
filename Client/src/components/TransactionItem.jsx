import React from 'react';

const TransactionItem = ({ transaction, onDeleteTransaction }) => {
  console.log(onDeleteTransaction);
  return (
    <div className="transaction-item">
      <div>{transaction.member.name}</div>
      <div>{transaction.purpose.category}</div>
      <div>${transaction.sum.toFixed(2)}</div>
      <div>{new Date(transaction.date).toLocaleDateString()}</div>
      {onDeleteTransaction &&
        <div><button className='delete-btn' onClick={() => onDeleteTransaction(transaction.id)}>Delete</button></div>
      }
    </div>
  );
};

export default TransactionItem;

