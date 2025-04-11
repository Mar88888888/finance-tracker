import { Test, TestingModule } from '@nestjs/testing';
import { subscriptionsController } from './subscriptions.controller';

describe('subscriptionsController', () => {
  let controller: subscriptionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [subscriptionsController],
    }).compile();

    controller = module.get<subscriptionsController>(subscriptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
