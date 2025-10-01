// spec/controller/ClientController.spec.js
const request = require('supertest');
const express = require('express');
const clientController = require('../../src/controller/ClientController');

jest.mock('../../src/service/ClientService', () => ({
  checkEmail: jest.fn(),
  register: jest.fn(),
  login: jest.fn(),
  getClientById: jest.fn(),
}));

const clientService = require('../../src/service/ClientService');

const app = express();
app.use(express.json());
app.use('/tradeX/client', clientController);

describe('ClientController', () => {
  afterEach(() => jest.clearAllMocks());

  test('GET /tradeX/client/check-email returns 400 if email missing', async () => {
    const res = await request(app).get('/tradeX/client/check-email');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Email query parameter is required');
  });

  test('GET /tradeX/client/check-email returns result from service', async () => {
    clientService.checkEmail.mockResolvedValue({ exists: true });
    const res = await request(app).get('/tradeX/client/check-email?email=test@example.com');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ exists: true });
  });

  test('POST /tradeX/client/register returns result from service', async () => {
    clientService.register.mockResolvedValue({ id: 1 });
    const res = await request(app)
      .post('/tradeX/client/register')
      .send({ email: 'test@example.com', password: 'pass' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1 });
  });

  test('POST /tradeX/client/login returns result from service', async () => {
    clientService.login.mockResolvedValue({ token: 'abc' });
    const res = await request(app)
      .post('/tradeX/client/login')
      .send({ email: 'test@example.com', password: 'pass' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ token: 'abc' });
  });

  test('GET /tradeX/client/:clientId returns client if found', async () => {
    clientService.getClientById.mockResolvedValue({ id: 1, email: 'test', password: 'secret' });
    const res = await request(app).get('/tradeX/client/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, email: 'test' });
  });

  test('GET /tradeX/client/:clientId returns 404 if not found', async () => {
    clientService.getClientById.mockResolvedValue(null);
    const res = await request(app).get('/tradeX/client/999');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Client not found');
  });
});