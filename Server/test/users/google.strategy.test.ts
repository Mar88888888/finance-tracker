import { GoogleStrategy } from '../../src/users/google.strategy';
import { authServiceMock } from '../mocks/services/auth.service.mock';

describe('GoogleStrategy', () => {
  let strategy: GoogleStrategy;

  beforeEach(() => {
    process.env.GOOGLE_CLIENT_ID = 'test-client-id';
    process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';
    process.env.GOOGLE_REDIRECT_URI =
      'http://localhost:3000/auth/google/redirect';

    strategy = new GoogleStrategy(authServiceMock as any);
  });

  describe('validate', () => {
    it('should call authService.validateGoogleUser with correct arguments and return the user', async () => {
      const mockProfile = {
        name: { givenName: 'John' },
        emails: [{ value: 'john@example.com' }],
      };

      const mockUser = { id: 1, email: 'john@example.com' };
      authServiceMock.validateGoogleUser.mockResolvedValueOnce(mockUser);

      const done = jest.fn();

      await strategy.validate(
        'accessToken',
        'refreshToken',
        mockProfile as any,
        done,
      );

      expect(authServiceMock.validateGoogleUser).toHaveBeenCalledWith({
        email: 'john@example.com',
        name: 'John',
      });
      expect(done).toHaveBeenCalledWith(null, mockUser);
    });
  });
});
