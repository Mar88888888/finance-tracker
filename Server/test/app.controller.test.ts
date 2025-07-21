import { AppController } from '../src/app.controller';

describe('App Controller', () => {
  let sut: AppController;

  beforeEach(() => {
    sut = new AppController();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });
});
