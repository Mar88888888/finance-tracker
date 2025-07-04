import { CreateSubscriptionDto } from "../../src/subscriptions/dto/create-subscription.dto";
import { testSubscriptions } from "../fixtures/subscriptions.fixtures";

export const createSubscriptionDtoMock: CreateSubscriptionDto = {
    interval: testSubscriptions[0].getInterval(),
    unit: testSubscriptions[0].getUnit(),
    startDate: testSubscriptions[0].getStartDate(),
    endDate: testSubscriptions[0].getEndDate(),
}