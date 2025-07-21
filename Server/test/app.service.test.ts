import { AppService } from '../src/app.service';

describe('App Service', () => {
  let sut: AppService;

  beforeEach(() => {
    sut = new AppService();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });
});
