import { CreateSubscriptionDto } from "../../src/subscriptions/dto/create-subscription.dto";
import { createSubscriptionModels } from "../fixtures/subscriptions.fixtures";

const subscriptionModels = createSubscriptionModels();

export const createSubscriptionDtoMock: CreateSubscriptionDto = {
    interval: subscriptionModels[0].getInterval(),
    unit: subscriptionModels[0].getUnit(),
    startDate: subscriptionModels[0].getStartDate(),
    endDate: subscriptionModels[0].getEndDate(),
}