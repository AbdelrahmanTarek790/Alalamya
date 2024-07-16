const express = require('express');


const {
  getReturns,
  getReturn,
  createReturn,
  updateReturn,
  deleteReturn,
} = require('../services/ReturnService');

const authService = require('../services/authService');

const router = express.Router();

router
  .route('/')
  .get(getReturns)
  .post(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    createReturn
  );

router
  .route('/:id')
  .get(getReturn)
  .put(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    updateReturn
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deleteReturn
  );

module.exports = router;
