const express = require('express');
const request = require('supertest');

jest.mock('../../src/service/RoboAdvisorService');
const roboAdvisorService = require('../../src/service/RoboAdvisorService');
const roboAdvisorController = require('../../src/controller/RoboAdvisorController');

describe('RoboAdvisorController', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/robo-advisor', roboAdvisorController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /robo-advisor/recommendations/:clientId', () => {
    it('should return recommendations', async () => {
      const mockData = { recommendations: ['AAPL', 'GOOG'] };
      roboAdvisorService.getRecommendations.mockResolvedValue(mockData);

      const res = await request(app).get('/robo-advisor/recommendations/1');

      expect(roboAdvisorService.getRecommendations).toHaveBeenCalledWith('1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockData);
    });

    it('should handle errors', async () => {
      roboAdvisorService.getRecommendations.mockRejectedValue(new Error('fail'));

      const res = await request(app).get('/robo-advisor/recommendations/2');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'fail' });
    });
  });

  describe('GET /robo-advisor/portfolio-analysis/:clientId', () => {
    it('should return portfolio analysis', async () => {
      const mockData = { analysis: 'good' };
      roboAdvisorService.getPortfolioAnalysis.mockResolvedValue(mockData);

      const res = await request(app).get('/robo-advisor/portfolio-analysis/1');

      expect(roboAdvisorService.getPortfolioAnalysis).toHaveBeenCalledWith('1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockData);
    });

    it('should handle errors', async () => {
      roboAdvisorService.getPortfolioAnalysis.mockRejectedValue(new Error('fail'));

      const res = await request(app).get('/robo-advisor/portfolio-analysis/2');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'fail' });
    });
  });

  describe('GET /robo-advisor/market-insights/:clientId', () => {
    it('should return market insights', async () => {
      const mockData = { insights: 'bullish' };
      roboAdvisorService.getMarketInsights.mockResolvedValue(mockData);

      const res = await request(app).get('/robo-advisor/market-insights/1');

      expect(roboAdvisorService.getMarketInsights).toHaveBeenCalledWith('1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockData);
    });

    it('should handle errors', async () => {
      roboAdvisorService.getMarketInsights.mockRejectedValue(new Error('fail'));

      const res = await request(app).get('/robo-advisor/market-insights/2');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'fail' });
    });
  });
});
