// spec/service/ClientService.spec.js
const axios = require('axios');
const clientService = require('../../src/service/ClientService');

jest.mock('axios');

describe('ClientService', () => {
  afterEach(() => jest.clearAllMocks());

  describe('login', () => {
    it('should post to /login and return data', async () => {
      const mockData = { token: 'abc' };
      axios.post.mockResolvedValue({ data: mockData });
      const result = await clientService.login({ email: 'a', password: 'b' });
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:8081/client/login',
        { email: 'a', password: 'b' }
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('register', () => {
    it('should post to /register and return data', async () => {
      const mockData = { id: 1 };
      axios.post.mockResolvedValue({ data: mockData });
      const result = await clientService.register({ email: 'a', password: 'b' });
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:8081/client/register',
        { email: 'a', password: 'b' }
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('getClientById', () => {
    it('should get client by id and return data', async () => {
      const mockData = { id: 1, email: 'a' };
      axios.get.mockResolvedValue({ data: mockData });
      const result = await clientService.getClientById(1);
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8081/client/1');
      expect(result).toEqual(mockData);
    });
  });

  describe('checkEmail', () => {
    it('should get /check-email with params and return data', async () => {
      const mockData = { exists: true };
      axios.get.mockResolvedValue({ data: mockData });
      const result = await clientService.checkEmail('test@example.com');
      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:8081/client/check-email',
        { params: { email: 'test@example.com' } }
      );
      expect(result).toEqual(mockData);
    });
  });
});
