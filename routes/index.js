const userRoute = require('./userRoute');
const authRoute = require('./authRoute');
const ProductRoute = require('./productRoute');
const BuyRoute = require('./BuyRoute');
const SellRoute = require('./SellRoute');
const ClintRoute = require('./ClintRoute');
const SupplayrRoute = require('./SupplayrRoute');


const mountRoutes = (app) => {
  
  app.use('/api/v1/users', userRoute);
  app.use('/api/v1/auth', authRoute);
  app.use('/api/v1/products', ProductRoute);
  app.use('/api/v1/Buys', BuyRoute);
  app.use('/api/v1/sells', SellRoute);
  app.use('/api/v1/supplayrs', SupplayrRoute);
  app.use('/api/v1/clints', ClintRoute);
}
module.exports = mountRoutes;
