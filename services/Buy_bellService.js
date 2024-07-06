const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const factory = require('./handlersFactory');
const Buy_bell = require('../models/Buy_bellModel');





// @desc    Get list of Buy
// @route   GET /api/v1/Buys
// @access  Public
exports.getBuy_bells = factory.getAll(Buy_bell,'Buy_bell');

// @desc    Get specific Buy_bell by id
// @route   GET /api/v1/Buys/:id
// @access  Public
exports.getBuy_bell = factory.getOne(Buy_bell,'supplayr');

// @desc    Create Buy_bell
// @route   POST  /api/v1/Buys
// @access  Private
exports.createBuy_bell = factory.createOne(Buy_bell);
// @desc    Update specific Buy_bell
// @route   PUT /api/v1/Buys/:id
// @access  Private
exports.updateBuy_bell =  asyncHandler(async (req, res, next) => {
    const document = await Buy_bell.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });
  
    if (!document) {
      return next(new ApiError(`No document for this id ${req.params.id}`, 404));
    }
  
    // Trigger "post" middleware
    
  
    res.status(200).json({ data: document });
  });

// @desc    Delete specific Buy_bell
// @route   DELETE /api/v1/Buys/:id
// @access  Private
exports.deleteBuy_bell = factory.deleteOne(Buy_bell);





