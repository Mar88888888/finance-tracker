import React from 'react';
import { useNavigate } from 'react-router-dom';


const TransactionItem = ({ transaction, onDeleteTransaction }) => {
  const navigate = useNavigate();

  return (
    <div className="transaction-item">
      <div>{transaction.member.name}</div>
      <div>{transaction.purpose.category}</div>
      <div>${transaction.sum.toFixed(2)}</div>
      <div>{new Date(transaction.date).toLocaleDateString()}</div>
      {onDeleteTransaction &&
        <>
          <div><button className='edit-btn' onClick={() => navigate(`edit/${transaction.id}`)}>Edit</button></div>
          <div><button className='delete-btn' onClick={() => onDeleteTransaction(transaction.id)}>Delete</button></div>
        </>
      }

    </div>
  );
};

export default TransactionItem;

