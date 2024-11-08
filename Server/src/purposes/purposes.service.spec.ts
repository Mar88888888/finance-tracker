import { Test, TestingModule } from '@nestjs/testing';
import { PurposesService } from './purposes.service';

describe('PurposesService', () => {
  let service: PurposesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurposesService],
    }).compile();

    service = module.get<PurposesService>(PurposesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
