// spec/service/PortfolioService.spec.js
const axios = require('axios');
const portfolioService = require('../../src/service/PortfolioService');

jest.mock('axios');

describe('PortfolioService', () => {
  afterEach(() => jest.clearAllMocks());

  describe('getPortfolio', () => {
    it('should fetch portfolio data for a given clientId', async () => {
      const mockData = { id: 1, assets: [] };
      axios.get.mockResolvedValue({ data: mockData });

      const result = await portfolioService.getPortfolio(1);

      expect(axios.get).toHaveBeenCalledWith('http://localhost:8081/portfolio/1');
      expect(result).toEqual(mockData);
    });

    it('should throw if axios.get fails', async () => {
      axios.get.mockRejectedValue(new Error('fail'));

      await expect(portfolioService.getPortfolio(2)).rejects.toThrow('fail');
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8081/portfolio/2');
    });
  });
});
