import { UsersModule } from '../../src/users/users.module';

describe('User Module', () => {
  let sut: UsersModule;

  beforeEach(() => {
    sut = new UsersModule();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });
});
