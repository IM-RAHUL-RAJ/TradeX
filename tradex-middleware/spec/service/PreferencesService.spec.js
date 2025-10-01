const axios = require('axios');
const preferencesService = require('../../src/service/PreferencesService');

jest.mock('axios');

describe('PreferencesService', () => {
  afterEach(() => jest.clearAllMocks());

  describe('savePreferences', () => {
    it('should post preferences and return data', async () => {
      const mockData = { success: true };
      axios.post.mockResolvedValue({ data: mockData });

      const result = await preferencesService.savePreferences(1, { theme: 'dark' });

      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:8081/preferences/save/1',
        { theme: 'dark' }
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('updatePreferences', () => {
    it('should put preferences and return data', async () => {
      const mockData = { updated: true };
      axios.put.mockResolvedValue({ data: mockData });

      const result = await preferencesService.updatePreferences(2, { theme: 'light' });

      expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:8081/preferences/update/2',
        { theme: 'light' }
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('getPreferences', () => {
    it('should get preferences and return data', async () => {
      const mockData = { theme: 'blue' };
      axios.get.mockResolvedValue({ data: mockData });

      const result = await preferencesService.getPreferences(3);

      expect(axios.get).toHaveBeenCalledWith('http://localhost:8081/preferences/3');
      expect(result).toEqual(mockData);
    });
  });
});
