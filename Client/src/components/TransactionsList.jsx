import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/TransactionsList.css';
import TransactionItem from './TransactionItem';
import { fetchTransactionsWithRelations } from '../services/TransactionService';

const TransactionsList = ({ transactionsData, authToken }) => {
  const [transactions, setEnrichedTransactions] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const enrichTransactions = async () => {
      console.log(transactionsData);
      if (transactionsData.length > 0) {
        const enriched = await fetchTransactionsWithRelations(transactionsData, authToken);
        console.log(enriched);
        console.log(transactionsData);
        setEnrichedTransactions(enriched);
      }
    };

    enrichTransactions();
  }, [transactionsData, authToken]);


  const getNestedValue = (object, keyPath) => {
    return keyPath.split('.').reduce((value, key) => (value ? value[key] : undefined), object);
  };

  const sortedTransactions = React.useMemo(() => {
    if (!sortConfig.key) return transactions;

    const sorted = [...transactions].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.key);
      const bValue = getNestedValue(b, sortConfig.key);

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sortConfig.key === 'date' && sortConfig.direction === 'default'
      ? transactions
      : sorted;
  }, [transactions, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        if (prev.direction === 'desc') return { key: null, direction: null };
      }
      return { key, direction: 'asc' };
    });
  };

  const renderSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="transactions-list">
      {transactions.length === 0 ? (
        <p>No transactions available.</p>
      ) : (
        <>
          <div className="transaction-header">
            <div onClick={() => handleSort('member.name')}>
              Member {renderSortIndicator('member.name')}
            </div>
            <div onClick={() => handleSort('purpose.category')}>
              Purpose {renderSortIndicator('purpose.category')}
            </div>
            <div onClick={() => handleSort('sum')}>
              Amount {renderSortIndicator('sum')}
            </div>
            <div onClick={() => handleSort('date')}>
              Date {renderSortIndicator('date')}
            </div>
          </div>

          {paginatedTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}

          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={currentPage === index + 1 ? 'active' : ''}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

TransactionsList.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      member: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      purpose: PropTypes.shape({
        category: PropTypes.string.isRequired,
      }).isRequired,
      sum: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default TransactionsList;
