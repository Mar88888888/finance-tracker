import { Test, TestingModule } from '@nestjs/testing';
import { subscriptionsService } from './subscriptions.service';

describe('subscriptionsService', () => {
  let service: subscriptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [subscriptionsService],
    }).compile();

    service = module.get<subscriptionsService>(subscriptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
