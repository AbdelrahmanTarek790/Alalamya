const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');
const factory = require('./handlersFactory');
const Sell_bell = require('../models/Sell_bellModel');





// @desc    Get list of Sell
// @route   GET /api/v1/Sells
// @access  Public
exports.getSell_bells = factory.getAll(Sell_bell,'Sell_bell');

// @desc    Get specific Sell_bell by id
// @route   GET /api/v1/Sells/:id
// @access  Public
exports.getSell_bell = factory.getOne(Sell_bell,'clint');

// @desc    Create Sell_bell
// @route   POST  /api/v1/Sells
// @access  Private
exports.createSell_bell = factory.createOne(Sell_bell);
// @desc    Update specific Sell_bell
// @route   PUT /api/v1/Sells/:id
// @access  Private
exports.updateSell_bell = asyncHandler(async (req, res, next) => {
    const document = await Sell_bell.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });
  
    if (!document) {
      return next(new ApiError(`No document for this id ${req.params.id}`, 404));
    }
  
    // Trigger "post" middleware
    /*await document.constructor.takeMoney_d(document.clint, document.payBell);
    await document.constructor.takeMoney_b(document.clint, document.payBell);*/
  
    res.status(200).json({ data: document });
  });


// @desc    Delete specific Sell_bell
// @route   DELETE /api/v1/Sells/:id
// @access  Private
exports.deleteSell_bell = factory.deleteOne(Sell_bell);





