const express = require('express');
const request = require('supertest');

jest.mock('../../src/service/ReportService');
const reportService = require('../../src/service/ReportService');
const reportController = require('../../src/controller/ReportController');

describe('ReportController', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/reports', reportController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /reports/portfolio/:clientId', () => {
    it('should return portfolio report', async () => {
      const mockReport = { summary: 'portfolio' };
      reportService.getPortfolioReport.mockResolvedValue(mockReport);

      const res = await request(app).get('/reports/portfolio/1');

      expect(reportService.getPortfolioReport).toHaveBeenCalledWith('1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockReport);
    });

    it('should handle errors', async () => {
      reportService.getPortfolioReport.mockRejectedValue(new Error('fail'));

      const res = await request(app).get('/reports/portfolio/2');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'fail' });
    });
  });

  describe('GET /reports/trade-history/:clientId', () => {
    it('should return trade history report', async () => {
      const mockReport = { summary: 'trade-history' };
      reportService.getTradeHistoryReport.mockResolvedValue(mockReport);

      const res = await request(app).get('/reports/trade-history/1');

      expect(reportService.getTradeHistoryReport).toHaveBeenCalledWith('1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockReport);
    });

    it('should handle errors', async () => {
      reportService.getTradeHistoryReport.mockRejectedValue(new Error('fail'));

      const res = await request(app).get('/reports/trade-history/2');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'fail' });
    });
  });
});
