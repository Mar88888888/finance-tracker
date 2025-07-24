import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../../styles/transactions/TransactionsList.css';
import TransactionItem from './TransactionItem';
import '@fortawesome/fontawesome-free/css/all.min.css';
import API from '../../services/AxiosInstance';

const TransactionsList = ({
  transactionsData,
  authToken,
  onDeleteTransaction,
  groupId,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const transactions = transactionsData;
  const itemsPerPage = 10;

  const [filters, setFilters] = useState({
    member: '',
    purpose: '',
    minAmount: '',
    maxAmount: '',
    startDate: '',
    endDate: '',
  });

  const filteredTransactions = transactions.filter((tx) => {
    const memberMatch = tx.userName
      .toLowerCase()
      .includes(filters.member.toLowerCase());
    const purposeMatch = tx.purposeCategory
      .toLowerCase()
      .includes(filters.purpose.toLowerCase());
    const minAmountMatch =
      filters.minAmount === '' || tx.sum >= parseFloat(filters.minAmount);
    const maxAmountMatch =
      filters.maxAmount === '' || tx.sum <= parseFloat(filters.maxAmount);
    const txDate = new Date(tx.date);

    const startDateMatch =
      filters.startDate === '' || txDate >= new Date(filters.startDate);
    const endDateMatch =
      filters.endDate === '' || txDate <= new Date(filters.endDate);

    return (
      memberMatch &&
      purposeMatch &&
      minAmountMatch &&
      maxAmountMatch &&
      startDateMatch &&
      endDateMatch
    );
  });

  const getNestedValue = (object, keyPath) => {
    return keyPath
      .split('.')
      .reduce((value, key) => (value ? value[key] : undefined), object);
  };

  const sortedTransactions = React.useMemo(() => {
    if (!sortConfig.key) return filteredTransactions;
    const sorted = [...filteredTransactions].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.key);
      const bValue = getNestedValue(b, sortConfig.key);

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sortConfig.key === 'date' && sortConfig.direction === 'default'
      ? filteredTransactions
      : sorted;
  }, [sortConfig, filteredTransactions]);

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

  const handleExportCSV = async () => {
    const params = new URLSearchParams();

    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.minAmount) params.append('minAmount', filters.minAmount);
    if (filters.maxAmount) params.append('maxAmount', filters.maxAmount);
    if (sortConfig.key) {
      params.append('orderBy', sortConfig.key);
      params.append('sortOrder', sortConfig.direction?.toUpperCase() || 'ASC');
    }

    const purposeIds = [
      ...new Set(
        filteredTransactions.map((tx) => tx.purpose?.id).filter(Boolean)
      ),
    ];
    if (purposeIds.length > 0) {
      params.append('purposes', purposeIds.join(','));
    }

    try {
      const response = await API.get(
        groupId
          ? `/groups/${groupId}/transactions/export`
          : `/transactions/export`,
        {
          params,
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions_export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('CSV export failed.');
    }
  };

  return (
    <>
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="filter-toggle-btn"
      >
        <i
          className={`fa ${
            showFilters ? 'fa-chevron-up' : 'fa-chevron-down'
          } fa-lg white-icon ${showFilters ? 'rotated' : ''}`}
        ></i>
      </button>

      <div className={`filters-wrapper ${showFilters ? 'show' : ''}`}>
        <div className="filters">
          <div className="filter-group">
            <label htmlFor="member">Member</label>
            <input
              id="member"
              type="text"
              placeholder="Filter by Member"
              value={filters.member}
              onChange={(e) =>
                setFilters({ ...filters, member: e.target.value })
              }
            />
          </div>

          <div className="filter-group">
            <label htmlFor="purpose">Purpose</label>
            <input
              id="purpose"
              type="text"
              placeholder="Filter by Purpose"
              value={filters.purpose}
              onChange={(e) =>
                setFilters({ ...filters, purpose: e.target.value })
              }
            />
          </div>

          <div className="filter-group">
            <label htmlFor="minAmount">Min Amount</label>
            <input
              id="minAmount"
              type="number"
              placeholder="Min Amount"
              value={filters.minAmount}
              onChange={(e) =>
                setFilters({ ...filters, minAmount: e.target.value })
              }
            />
          </div>

          <div className="filter-group">
            <label htmlFor="maxAmount">Max Amount</label>
            <input
              id="maxAmount"
              type="number"
              placeholder="Max Amount"
              value={filters.maxAmount}
              onChange={(e) =>
                setFilters({ ...filters, maxAmount: e.target.value })
              }
            />
          </div>

          <div className="filter-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              id="startDate"
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
            />
          </div>

          <div className="filter-group">
            <label htmlFor="endDate">End Date</label>
            <input
              id="endDate"
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
            />
          </div>
        </div>
        <button
          onClick={() => {
            setFilters({
              member: '',
              purpose: '',
              minAmount: '',
              maxAmount: '',
              startDate: '',
              endDate: '',
            });
          }}
          className="reset-filters-btn"
        >
          Reset Filters
        </button>
      </div>

      <button onClick={handleExportCSV} className="export-btn">
        <i className="fa fa-download" /> Export to CSV
      </button>

      <div className="transactions-list">
        {transactions.length === 0 ? (
          <p>No transactions available.</p>
        ) : (
          <>
            <div className="transaction-header">
              <div onClick={() => handleSort('userName')}>
                Member {renderSortIndicator('userName')}
              </div>
              <div onClick={() => handleSort('purposeCategory')}>
                Purpose {renderSortIndicator('purposeCategory')}
              </div>
              <div onClick={() => handleSort('sum')}>
                Amount {renderSortIndicator('sum')}
              </div>
              <div onClick={() => handleSort('date')}>
                Date {renderSortIndicator('date')}
              </div>
              {onDeleteTransaction && (
                <>
                  <div></div>
                  <div>Actions</div>

                  <div></div>
                </>
              )}
            </div>

            {paginatedTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onDeleteTransaction={onDeleteTransaction}
              />
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
    </>
  );
};

TransactionsList.propTypes = {
  transactionsData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      userName: PropTypes.string.isRequired,
      purposeCategory: PropTypes.string.isRequired,
      sum: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default TransactionsList;
