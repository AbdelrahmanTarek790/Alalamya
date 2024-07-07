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
  .get(
       authService.protect,
       authService.allowedTo('admin', 'manager'),getReturns)
  .post(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    createReturn
  );

router
  .route('/:id')
  .get(authService.protect,
    authService.allowedTo('admin', 'manager'),getReturn)
  .put(
    authService.protect,
    authService.allowedTo('admin'),
    updateReturn
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deleteReturn
  );

module.exports = router;
