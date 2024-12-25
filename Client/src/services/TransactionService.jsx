import axios from 'axios';

export const fetchUserById = async (userId, authToken) => {
  try {
    const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return userResponse.data;
  } catch (err) {
    throw new Error('Failed to fetch user.');
  }
};

export const fetchPurposeById = async (purposeId, authToken) => {
  try {
    const purposeResponse = await axios.get(`${process.env.REACT_APP_API_URL}/purposes/${purposeId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return purposeResponse.data;
  } catch (err) {
    throw new Error('Failed to fetch purpose.');
  }
};


export const fetchTransactionsWithRelations = async (transactions, authToken) => {
  try {
    const transactionsWithUser = await Promise.all(
      transactions.map(async (transaction) => {
        const user = await fetchUserById(transaction.memberId, authToken);
        transaction.member = user;

        const purpose = await fetchPurposeById(transaction.purposeId, authToken);
        transaction.purpose = purpose;

        console.log(transaction);
        return transaction;
      })
    );

    return transactionsWithUser;
  } catch (err) {
    throw new Error('Failed to enrich transactions with user and purpose.');
  }
};