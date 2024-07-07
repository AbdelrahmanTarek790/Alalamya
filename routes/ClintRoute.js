const express = require('express');


const {
  getClints,
  getClint,
  createClint,
  updateClint,
  deleteClint,
} = require('../services/ClintService');

const authService = require('../services/authService');

const router = express.Router();

router
  .route('/')
  .get(authService.protect,
       authService.allowedTo('admin', 'manager'),getClints)
  .post(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    createClint
  );

router
  .route('/:id')
  .get(authService.protect,
       authService.allowedTo('admin', 'manager'),getClint)
  .put(
    authService.protect,
    authService.allowedTo('admin'),
    updateClint
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deleteClint
  );

module.exports = router;
