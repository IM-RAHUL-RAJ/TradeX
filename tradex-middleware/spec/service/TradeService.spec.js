const axios = require('axios');
const tradeService = require('../../src/service/TradeService');

jest.mock('axios');

describe('TradeService', () => {
  afterEach(() => jest.clearAllMocks());

  describe('executeTrade', () => {
    it('should post trade and return data', async () => {
      const mockData = { success: true };
      axios.post.mockResolvedValue({ data: mockData });

      const result = await tradeService.executeTrade(
        { symbol: 'AAPL', quantity: 10 },
        'Bearer token'
      );

      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:8081/trades/execute',
        { symbol: 'AAPL', quantity: 10 },
        { headers: { Authorization: 'Bearer token' } }
      );
      expect(result).toEqual(mockData);
    });

    it('should post trade without auth header', async () => {
      const mockData = { success: true };
      axios.post.mockResolvedValue({ data: mockData });

      const result = await tradeService.executeTrade(
        { symbol: 'AAPL', quantity: 10 }
      );

      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:8081/trades/execute',
        { symbol: 'AAPL', quantity: 10 },
        {}
      );
      expect(result).toEqual(mockData);
    });

    it('should throw if axios.post fails', async () => {
      axios.post.mockRejectedValue(new Error('fail'));

      await expect(
        tradeService.executeTrade({ symbol: 'AAPL' }, 'Bearer token')
      ).rejects.toThrow('fail');
    });
  });

  describe('getTradeHistory', () => {
    it('should get trade history and return data', async () => {
      const mockData = [{ id: 1, symbol: 'AAPL' }];
      axios.get.mockResolvedValue({ data: mockData });

      const result = await tradeService.getTradeHistory(123);

      expect(axios.get).toHaveBeenCalledWith('http://localhost:8081/trades/123');
      expect(result).toEqual(mockData);
    });

    it('should throw if axios.get fails', async () => {
      axios.get.mockRejectedValue(new Error('fail'));

      await expect(tradeService.getTradeHistory(456)).rejects.toThrow('fail');
    });
  });
});
