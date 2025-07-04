import { ExecutionContext } from "@nestjs/common";
import { createUserModels } from "../fixtures/users.fixture";
import { createGroupModels } from "../fixtures/groups.fixtures";
import { createPurposeModels } from "../fixtures/purposes.fixtures";
import { createSubscriptionModels } from "../fixtures/subscriptions.fixtures";
import { createTransactionModels } from "../fixtures/transactions.fixtures";

const userModels = createUserModels();
const groupModels = createGroupModels();
const purposeModels = createPurposeModels();
const subscriptionModels = createSubscriptionModels();
const transactionModels = createTransactionModels();

export const executionContextMock: Partial<
  Record<
    jest.FunctionPropertyNames<ExecutionContext>,
    jest.MockedFunction<any>
  >
> = {
  switchToHttp: jest.fn().mockReturnValue({
    getRequest: jest.fn().mockReturnValue({
      userId: userModels[0].getId(),
      params: {
        groupId: groupModels[0].getId(),
        purposeId: purposeModels[0].getId(),
        subscriptionId: subscriptionModels[0].getId(),
        transactionId: transactionModels[0].getId(),
      }
    }),
    getResponse: jest.fn(),
  }),
};