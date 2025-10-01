const express = require('express');
const request = require('supertest');

jest.mock('../../src/service/PreferencesService');
const preferencesService = require('../../src/service/PreferencesService');
const preferencesController = require('../../src/controller/PreferencesController');

describe('PreferencesController', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/preferences', preferencesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /preferences/save/:clientId', () => {
    it('should save preferences and return response', async () => {
      const mockResponse = { success: true };
      preferencesService.savePreferences.mockResolvedValue(mockResponse);

      const res = await request(app)
        .post('/preferences/save/1')
        .send({ theme: 'dark' });

      expect(preferencesService.savePreferences).toHaveBeenCalledWith('1', { theme: 'dark' });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockResponse);
    });

    it('should handle errors', async () => {
      preferencesService.savePreferences.mockRejectedValue(new Error('fail'));

      const res = await request(app)
        .post('/preferences/save/2')
        .send({ theme: 'light' });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'fail' });
    });
  });

  describe('PUT /preferences/update/:clientId', () => {
    it('should update preferences and return response', async () => {
      const mockResponse = { updated: true };
      preferencesService.updatePreferences.mockResolvedValue(mockResponse);

      const res = await request(app)
        .put('/preferences/update/1')
        .send({ theme: 'blue' });

      expect(preferencesService.updatePreferences).toHaveBeenCalledWith('1', { theme: 'blue' });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockResponse);
    });

    it('should handle errors', async () => {
      preferencesService.updatePreferences.mockRejectedValue(new Error('fail'));

      const res = await request(app)
        .put('/preferences/update/2')
        .send({ theme: 'red' });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'fail' });
    });
  });

  describe('GET /preferences/:clientId', () => {
    it('should get preferences and return response', async () => {
      const mockPrefs = { theme: 'dark' };
      preferencesService.getPreferences.mockResolvedValue(mockPrefs);

      const res = await request(app).get('/preferences/1');

      expect(preferencesService.getPreferences).toHaveBeenCalledWith('1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockPrefs);
    });

    it('should handle errors', async () => {
      preferencesService.getPreferences.mockRejectedValue(new Error('fail'));

      const res = await request(app).get('/preferences/2');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'fail' });
    });
  });
});
