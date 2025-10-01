const express = require('express');
const cors = require('cors');

const clientController = require('./src/controller/ClientController');
const tradeController = require('./src/controller/TradeController');
const walletController = require('./src/controller/WalletController');
const portfolioController = require('./src/controller/PortfolioController');
const preferencesController = require('./src/controller/PreferencesController');
const reportController = require('./src/controller/ReportController');
const roboAdvisorController = require('./src/controller/RoboAdvisorController');

const app = express();
const PORT = 8080;
 
app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.url);
  next();
});
 
 
app.use(cors());
app.use(express.json());
 

// Mount controllers
app.use('/tradeX/client', clientController);
app.use('/tradeX/portfolio', portfolioController);
app.use('/tradeX/trades', tradeController);
app.use('/tradeX/wallet', walletController);
app.use('/tradeX/preferences', preferencesController);
app.use('/tradeX/reports', reportController);
app.use('/tradeX/robo-advisor', roboAdvisorController);

app.get('/', (req, res) => {
  res.send('TradeX Middleware API is running');
});
 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
 