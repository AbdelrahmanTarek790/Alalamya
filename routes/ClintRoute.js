const express = require('express');


const {
  getClints,
  getClint,
  createClint,
  updateClint,
  deleteClint,
  getClientDetails,
} = require('../services/ClintService');

const authService = require('../services/authService');

const router = express.Router();

router
  .route('/')
  .get(getClints)
  .post(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    createClint
  );

router
  .route('/:id')
  .get(getClint)
  .put(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    updateClint
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deleteClint
  );
router
  .route('/:clientId/details') 
  .get(
    authService.protect,
    authService.allowedTo('admin'),getClientDetails); 

module.exports = router;
