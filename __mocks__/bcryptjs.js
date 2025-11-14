// Mock de bcryptjs para testing
module.exports = {
  hashSync: jest.fn((password, rounds) => `hashed_${password}`),
  compareSync: jest.fn((password, hash) => true),
  genSaltSync: jest.fn(() => 'mock_salt'),
  hash: jest.fn((password, rounds) => Promise.resolve(`hashed_${password}`)),
  compare: jest.fn((password, hash) => Promise.resolve(true)),
  genSalt: jest.fn(() => Promise.resolve('mock_salt')),
};
