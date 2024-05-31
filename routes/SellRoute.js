const express = require('express');
const {
  getSellValidator,
  createSellValidator,
  updateSellValidator,
  deleteSellValidator,
} = require('../utils/validators/SellValidator');

const {
  getSells,
  getSell,
  createSell,
  updateSell,
  deleteSell,
  
} = require('../services/SellService');
const authService = require('../services/authService');

const router = express.Router();

router
  .route('/')
  .get(getSells)
  .post(
    createSellValidator,
    createSell
  );
router
  .route('/:id')
  .get(getSellValidator, getSell)
  .put(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    updateSellValidator,
    updateSell
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deleteSellValidator,
    deleteSell
  );

module.exports = router;
