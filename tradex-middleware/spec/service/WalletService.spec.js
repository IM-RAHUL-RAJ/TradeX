const axios = require('axios');
const walletService = require('../../src/service/WalletService');

jest.mock('axios');

describe('WalletService', () => {
  afterEach(() => jest.clearAllMocks());

  describe('getWalletBalance', () => {
    it('should fetch wallet balance', async () => {
      const mockData = { balance: 100 };
      axios.get.mockResolvedValue({ data: mockData });

      const result = await walletService.getWalletBalance(1);

      expect(axios.get).toHaveBeenCalledWith('http://localhost:8081/wallet/1');
      expect(result).toEqual(mockData);
    });

    it('should throw if axios.get fails', async () => {
      axios.get.mockRejectedValue(new Error('fail'));

      await expect(walletService.getWalletBalance(2)).rejects.toThrow('fail');
    });
  });

  describe('deposit', () => {
    it('should deposit funds and return data', async () => {
      const mockData = { balance: 200 };
      axios.post.mockResolvedValue({ data: mockData });

      const result = await walletService.deposit({ clientId: '1', amount: 100 });

      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:8081/wallet/1/deposit',
        { clientId: '1', amount: 100 }
      );
      expect(result).toEqual(mockData);
    });

    it('should throw if axios.post fails', async () => {
      axios.post.mockRejectedValue(new Error('fail'));

      await expect(walletService.deposit({ clientId: '1', amount: 100 })).rejects.toThrow('fail');
    });
  });

  describe('withdraw', () => {
    it('should withdraw funds and return data', async () => {
      const mockData = { balance: 50 };
      axios.post.mockResolvedValue({ data: mockData });

      const result = await walletService.withdraw({ clientId: '1', amount: 50 });

      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:8081/wallet/1/withdraw',
        { clientId: '1', amount: 50 }
      );
      expect(result).toEqual(mockData);
    });

    it('should throw if axios.post fails', async () => {
      axios.post.mockRejectedValue(new Error('fail'));

      await expect(walletService.withdraw({ clientId: '1', amount: 50 })).rejects.toThrow('fail');
    });
  });
});
