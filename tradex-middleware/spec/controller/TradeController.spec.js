const express = require('express');
const request = require('supertest');

jest.mock('../../src/service/TradeService');
const tradeService = require('../../src/service/TradeService');
const tradeController = require('../../src/controller/TradeController');

describe('TradeController', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/trades', tradeController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /trades/execute', () => {
    it('should execute trade and return response', async () => {
      const mockResponse = { success: true };
      tradeService.executeTrade.mockResolvedValue(mockResponse);

      const res = await request(app)
        .post('/trades/execute')
        .set('Authorization', 'Bearer token')
        .send({ symbol: 'AAPL', quantity: 10 });

      expect(tradeService.executeTrade).toHaveBeenCalledWith(
        { symbol: 'AAPL', quantity: 10 },
        'Bearer token'
      );
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockResponse);
    });

    it('should handle errors and return 400', async () => {
      tradeService.executeTrade.mockRejectedValue(new Error('fail'));

      const res = await request(app)
        .post('/trades/execute')
        .send({ symbol: 'AAPL', quantity: 10 });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'fail' });
    });
  });

  describe('GET /trades/:clientId', () => {
    it('should get trade history and return response', async () => {
      const mockHistory = [{ id: 1, symbol: 'AAPL' }];
      tradeService.getTradeHistory.mockResolvedValue(mockHistory);

      const res = await request(app).get('/trades/123');

      expect(tradeService.getTradeHistory).toHaveBeenCalledWith('123');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockHistory);
    });

    it('should handle errors and return 500', async () => {
      tradeService.getTradeHistory.mockRejectedValue(new Error('fail'));

      const res = await request(app).get('/trades/456');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'fail' });
    });
  });
});
