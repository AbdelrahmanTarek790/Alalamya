
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.createSell_bellValidator = [
  check('clint')
  .isMongoId()
  .withMessage('Invalid user id format'),
  
    check('payBell')
    .notEmpty()
    .withMessage('price is required'),

   check('user')
   .isMongoId()
   .withMessage('Invalid user id format'),
  
  validatorMiddleware,
];

exports.getSell_bellValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleware,
];

exports.updateSell_bellValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleware,
];

exports.deleteSell_bellValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleware,
];
