const axios = require('axios');
const roboAdvisorService = require('../../src/service/RoboAdvisorService');

jest.mock('axios');

describe('RoboAdvisorService', () => {
  afterEach(() => jest.clearAllMocks());

  describe('getRecommendations', () => {
    it('should fetch recommendations', async () => {
      const mockData = { recommendations: ['AAPL'] };
      axios.get.mockResolvedValue({ data: mockData });

      const result = await roboAdvisorService.getRecommendations(1);

      expect(axios.get).toHaveBeenCalledWith('http://localhost:8081/robo-advisor/recommendations/1');
      expect(result).toEqual(mockData);
    });

    it('should throw if axios.get fails', async () => {
      axios.get.mockRejectedValue(new Error('fail'));

      await expect(roboAdvisorService.getRecommendations(2)).rejects.toThrow('fail');
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8081/robo-advisor/recommendations/2');
    });
  });

  describe('getPortfolioAnalysis', () => {
    it('should fetch portfolio analysis', async () => {
      const mockData = { analysis: 'good' };
      axios.get.mockResolvedValue({ data: mockData });

      const result = await roboAdvisorService.getPortfolioAnalysis(3);

      expect(axios.get).toHaveBeenCalledWith('http://localhost:8081/robo-advisor/portfolio-analysis/3');
      expect(result).toEqual(mockData);
    });

    it('should throw if axios.get fails', async () => {
      axios.get.mockRejectedValue(new Error('fail'));

      await expect(roboAdvisorService.getPortfolioAnalysis(4)).rejects.toThrow('fail');
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8081/robo-advisor/portfolio-analysis/4');
    });
  });

  describe('getMarketInsights', () => {
    it('should fetch market insights', async () => {
      const mockData = { insights: 'bullish' };
      axios.get.mockResolvedValue({ data: mockData });

      const result = await roboAdvisorService.getMarketInsights(5);

      expect(axios.get).toHaveBeenCalledWith('http://localhost:8081/robo-advisor/market-insights/5');
      expect(result).toEqual(mockData);
    });

    it('should throw if axios.get fails', async () => {
      axios.get.mockRejectedValue(new Error('fail'));

      await expect(roboAdvisorService.getMarketInsights(6)).rejects.toThrow('fail');
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8081/robo-advisor/market-insights/6');
    });
  });
});
