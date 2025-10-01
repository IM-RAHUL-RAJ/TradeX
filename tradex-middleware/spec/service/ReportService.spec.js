const axios = require('axios');
const reportService = require('../../src/service/ReportService');

jest.mock('axios');

describe('ReportService', () => {
  afterEach(() => jest.clearAllMocks());

  describe('getPortfolioReport', () => {
    it('should fetch portfolio report data', async () => {
      const mockData = { summary: 'portfolio' };
      axios.get.mockResolvedValue({ data: mockData });

      const result = await reportService.getPortfolioReport(1);

      expect(axios.get).toHaveBeenCalledWith('http://localhost:8081/reports/portfolio/1');
      expect(result).toEqual(mockData);
    });

    it('should throw if axios.get fails', async () => {
      axios.get.mockRejectedValue(new Error('fail'));

      await expect(reportService.getPortfolioReport(2)).rejects.toThrow('fail');
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8081/reports/portfolio/2');
    });
  });

  describe('getTradeHistoryReport', () => {
    it('should fetch trade history report data', async () => {
      const mockData = { summary: 'trade-history' };
      axios.get.mockResolvedValue({ data: mockData });

      const result = await reportService.getTradeHistoryReport(3);

      expect(axios.get).toHaveBeenCalledWith('http://localhost:8081/reports/trade-history/3');
      expect(result).toEqual(mockData);
    });

    it('should throw if axios.get fails', async () => {
      axios.get.mockRejectedValue(new Error('fail'));

      await expect(reportService.getTradeHistoryReport(4)).rejects.toThrow('fail');
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8081/reports/trade-history/4');
    });
  });
});
