const userRoute = require('./userRoute');
const authRoute = require('./authRoute');
const ProductRoute = require('./productRoute');
const BuyRoute = require('./BuyRoute');
const SellRoute = require('./SellRoute');
const ClintRoute = require('./ClintRoute');
const SupplayrRoute = require('./SupplayrRoute');
const Buy_bell = require('./Buy_bellRoute');
const Sell_bell = require('./Sell_bellRoute');

const mountRoutes = (app) => {
  
  app.use('/api/v1/users', userRoute);
  app.use('/api/v1/auth', authRoute);
  app.use('/api/v1/products', ProductRoute);
  app.use('/api/v1/Buys', BuyRoute);
  app.use('/api/v1/sells', SellRoute);
  app.use('/api/v1/supplayrs', SupplayrRoute);
  app.use('/api/v1/clints', ClintRoute);
  app.use('/api/v1/buy_bell', Buy_bell);
  app.use('/api/v1/Sell_bell', Sell_bell);
}
module.exports = mountRoutes;
