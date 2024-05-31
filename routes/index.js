const userRoute = require('./userRoute');
const authRoute = require('./authRoute');
const ProductRoute = require('./productRoute');
const BuyRoute = require('./BuyRoute');
const SellRoute = require('./SellRoute');


const mountRoutes = (app) => {
  
  app.use('/api/v1/users', userRoute);
  app.use('/api/v1/auth', authRoute);
  app.use('/api/v1/products', ProductRoute);
  app.use('/api/v1/Buys', BuyRoute);
  app.use('/api/v1/sells', SellRoute);
}
module.exports = mountRoutes;
