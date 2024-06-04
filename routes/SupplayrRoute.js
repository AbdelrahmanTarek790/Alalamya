const express = require('express');

const {
  getSupplayrs,
  getSupplayr,
  createSupplayr,
  updateSupplayr,
  deleteSupplayr,
} = require('../services/SupplayrService');

const authService = require('../services/authService');

const router = express.Router();

router
  .route('/')
  .get(getSupplayrs)
  .post(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    createSupplayr
  );

router
  .route('/:id')
  .get(getSupplayr)
  .put(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    updateSupplayr
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deleteSupplayr
  );

module.exports = router;
