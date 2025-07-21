import { AppModule } from '../src/app.module';

describe('App Module', () => {
  let sut: AppModule;

  beforeEach(() => {
    sut = new AppModule();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });
});
