const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const factory = require('./handlersFactory');
const Clint = require('../models/ClintModel');
const Sell =require('../models/sellModel');
const Sell_bell = require('../models/Sell_bellModel');
const clint_tax = require('../models/Tax_clintModel');
const check_back = require('../models/ReturnCheckModel');




// @desc    Get list of Clint
// @route   GET /api/v1/Clints
// @access  Public
exports.getClints = factory.getAll(Clint);

// @desc    Get specific Clint by id
// @route   GET /api/v1/Clint/:id
// @access  Public
exports.getClint = factory.getOne(Clint);

// @desc    Create Clint
// @route   POST  /api/v1/Clint
// @access  Private
exports.createClint = factory.createOne(Clint);
// @desc    Update specific Clint
// @route   PUT /api/v1/Clint/:id
// @access  Private
exports.updateClint = factory.updateOne(Clint);

// @desc    Delete specific Clint
// @route   DELETE /api/v1/Clint/:id
// @access  Private
exports.deleteClint = factory.deleteOne(Clint);

// services/clintService.js

exports.getClientDetails = asyncHandler(async (req, res, next) => {
  const { clientId } = req.params;

  // Get all sales for the client
  const bell = await Sell_bell.find({ clint: clientId })
    .populate({ path: 'clint', select: 'clint_name' });

  // Get all purchases for the client
  const sela = await Sell.find({ clint: clientId })
    .populate({ path: 'clint', select: 'clint_name' });

  const tax = await clint_tax.find({ clint: clientId })
    .populate({ path: 'clint', select: 'clint_name' });
  
  const chBack = await check_back.find({ clint: clientId })
    .populate({ path: 'clint', select: 'clint_name' });

  if (!bell && !sela && !tax  && !chBack) {
    return next(new ApiError(`No transactions found for client with ID: ${clientId}`, 404));
  }

  res.status(200).json({  sela , bell , chBack ,tax });
});
