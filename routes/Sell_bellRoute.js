const express = require('express');
const {
  getSell_bellValidator,
  createSell_bellValidator,
  updateSell_bellValidator,
  deleteSell_bellValidator,
} = require('../utils/validators/Sell_bellValidator');

const {
  getSell_bells,
  getSell_bell,
  createSell_bell,
  updateSell_bell,
  deleteSell_bell,
  
  
} = require('../services/Sell_bellService');
const authService = require('../services/authService');

const router = express.Router();

router
  .route('/')
  .get(getSell_bells)
  .post(
    authService.protect,
    authService.allowedTo('admin','manager','user2'),
    createSell_bellValidator,
    createSell_bell
  );
router
  .route('/:id')
  .get(
    authService.protect,
    authService.allowedTo('admin','manager'),
    getSell_bellValidator, getSell_bell)
  .put(
    authService.protect,
    authService.allowedTo('admin'),
    updateSell_bellValidator,
    updateSell_bell
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deleteSell_bellValidator,
    deleteSell_bell
  );
  


module.exports = router;
