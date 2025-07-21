export const jwtServiceMock = {
  sign: jest.fn().mockReturnValue('someToken'),
  verify: jest.fn().mockReturnValue({ sub: 1 }),
};
