import { Test, TestingModule } from '@nestjs/testing';
import { PurposesController } from './purposes.controller';

describe('PurposesController', () => {
  let controller: PurposesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurposesController],
    }).compile();

    controller = module.get<PurposesController>(PurposesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
