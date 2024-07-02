const express = require('express');
const {
  getBuyValidator,
  createBuyValidator,
  updateBuyValidator,
  deleteBuyValidator,
} = require('../utils/validators/BuyValidator');

const {
  getBuys,
  getBuy,
  createBuy,
  updateBuy,
  deleteBuy,
  printExcel,
  
} = require('../services/BuyService');
const authService = require('../services/authService');

const router = express.Router();

router
  .route('/')
  .get(getBuys)
  .post(
    createBuyValidator,
    createBuy
  );
router
  .route('/:id')
  .get(getBuyValidator, getBuy)
  .put(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    updateBuyValidator,
    updateBuy
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deleteBuyValidator,
    deleteBuy
  );
  router
  .route('/export-excel')
  .get(
    printExcel
  );


module.exports = router;
