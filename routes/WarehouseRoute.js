
const express = require('express');
const {
  getWarehouses,
  getWarehouse,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  printExcel,
  
} = require('../services/WarehouseService');
const authService = require('../services/authService');

const router = express.Router();

router
  .route('/')
  .get(getWarehouses)
  .post(
    createWarehouse
  );
router
  .route('/:id')
  .get(getWarehouse)
  .put(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    updateWarehouse
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deleteWarehouse
  );
  router
  .route('/export/excel')
  .get(
    
    printExcel
  );


module.exports = router;
