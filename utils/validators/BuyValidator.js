
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.createBuyValidator = [
  check('supplayr')
    .isLength({ min: 3 })
    .withMessage('must be at least 3 chars')
    .notEmpty()
    .withMessage('name required'),
    
  check('E_wieght')
    .notEmpty()
    .withMessage('wieght is required'),
    check('price_Kilo')
    .notEmpty()
    .withMessage('price is required'),
    
    check('price_all')
    .notEmpty()
    .withMessage('price is required'),
    
    check('pay')
    .notEmpty()
    .withMessage('price is required'),
   
    check('pay_on')
    .notEmpty()
    .withMessage('price is required'),
    
  check('user')
   .isMongoId()
   .withMessage('Invalid user id format'),

  check('Product')
    .isMongoId()
    .withMessage('Invalid product id format'),
  
  validatorMiddleware,
];

exports.getBuyValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleware,
];

exports.updateBuyValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleware,
];

exports.deleteBuyValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleware,
];
