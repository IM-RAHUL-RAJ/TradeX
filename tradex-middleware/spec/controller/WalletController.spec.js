const express = require('express');
const request = require('supertest');

jest.mock('../../src/service/WalletService');
const walletService = require('../../src/service/WalletService');
const walletController = require('../../src/controller/WalletController');

describe('WalletController', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/wallet', walletController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /wallet/:clientId/deposit', () => {
    it('should deposit funds and return response', async () => {
      const mockResponse = { balance: 200 };
      walletService.deposit.mockResolvedValue(mockResponse);

      const res = await request(app)
        .post('/wallet/1/deposit')
        .send({ clientId: '1', amount: 100 });

      expect(walletService.deposit).toHaveBeenCalledWith({ clientId: '1', amount: 100 });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockResponse);
    });

    it('should return 400 if clientId mismatch', async () => {
      const res = await request(app)
        .post('/wallet/1/deposit')
        .send({ clientId: '2', amount: 100 });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'ClientId mismatch' });
    });

    it('should handle errors and return 400', async () => {
      walletService.deposit.mockRejectedValue(new Error('fail'));
      const res = await request(app)
        .post('/wallet/1/deposit')
        .send({ clientId: '1', amount: 100 });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'fail' });
    });
  });

  describe('GET /wallet/:clientId', () => {
    it('should get wallet balance and return response', async () => {
      const mockResponse = { balance: 500 };
      walletService.getWalletBalance.mockResolvedValue(mockResponse);

      const res = await request(app).get('/wallet/1');

      expect(walletService.getWalletBalance).toHaveBeenCalledWith('1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockResponse);
    });

    it('should handle errors and return 500', async () => {
      walletService.getWalletBalance.mockRejectedValue(new Error('fail'));

      const res = await request(app).get('/wallet/2');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'fail' });
    });
  });

  describe('POST /wallet/:clientId/withdraw', () => {
    it('should withdraw funds and return response', async () => {
      const mockResponse = { balance: 50 };
      walletService.withdraw.mockResolvedValue(mockResponse);

      const res = await request(app)
        .post('/wallet/1/withdraw')
        .send({ clientId: '1', amount: 50 });

      expect(walletService.withdraw).toHaveBeenCalledWith({ clientId: '1', amount: 50 });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockResponse);
    });

    it('should return 400 if clientId mismatch', async () => {
      const res = await request(app)
        .post('/wallet/1/withdraw')
        .send({ clientId: '2', amount: 50 });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'ClientId mismatch' });
    });

    it('should handle errors and return 400', async () => {
      walletService.withdraw.mockRejectedValue(new Error('fail'));

      const res = await request(app)
        .post('/wallet/1/withdraw')
        .send({ clientId: '1', amount: 50 });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'fail' });
    });
  });
});
