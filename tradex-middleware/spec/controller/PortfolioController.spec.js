// spec/controller/PortfolioController.spec.js
const express = require('express');
const request = require('supertest');

jest.mock('../../src/service/PortfolioService');
const portfolioService = require('../../src/service/PortfolioService');
const portfolioController = require('../../src/controller/PortfolioController');

describe('PortfolioController', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/portfolio', portfolioController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /portfolio/:clientId returns portfolio data', async () => {
    const mockPortfolio = { id: 1, assets: [] };
    portfolioService.getPortfolio.mockResolvedValue(mockPortfolio);

    const res = await request(app).get('/portfolio/1');

    expect(portfolioService.getPortfolio).toHaveBeenCalledWith('1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockPortfolio);
  });

  it('GET /portfolio/:clientId handles errors', async () => {
    portfolioService.getPortfolio.mockRejectedValue(new Error('fail'));

    const res = await request(app).get('/portfolio/2');

    expect(portfolioService.getPortfolio).toHaveBeenCalledWith('2');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'fail' });
  });
});
