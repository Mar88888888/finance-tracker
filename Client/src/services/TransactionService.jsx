import API from './AxiosInstance';

export const fetchUserById = async (userId, authToken) => {
  try {
    console.log(userId);
    const userResponse = await API.get(`/users/${userId}`, {
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
    const purposeResponse = await API.get(`/purposes/${purposeId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return purposeResponse.data;
  } catch (err) {
    throw new Error('Failed to fetch purpose.');
  }
};

export const fetchTransactionsWithRelations = async (
  transactions,
  authToken
) => {
  try {
    const transactionsWithUser = await Promise.all(
      transactions.map(async (transaction) => {
        console.log(transaction);
        const user = await fetchUserById(transaction.userId, authToken);
        transaction.member = user;

        const purpose = await fetchPurposeById(
          transaction.purposeId,
          authToken
        );
        transaction.purpose = purpose;
        return transaction;
      })
    );

    return transactionsWithUser;
  } catch (err) {
    throw new Error('Failed to enrich transactions with user and purpose.');
  }
};
