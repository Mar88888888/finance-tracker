import { SubscriptionsModule } from "../../src/subscriptions/subscriptions.module";

describe('Subscriptions Module', () => {

  let sut: SubscriptionsModule;

  beforeEach(() => {
    sut = new SubscriptionsModule();
  })

  it('should be defined', () => {
    expect(sut).toBeDefined();
  })
})