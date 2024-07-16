const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const factory = require('./handlersFactory');
const Supplayr = require('../models/SupplayrModel');
const Buy =require('../models/BuyModel');
const Buy_bell =require('../models/Buy_bellModel');
const Supplayr_tax =require('../models/Tax_supplayrModel')





// @desc    Get list of Supplayr
// @route   GET /api/v1/Supplayrs
// @access  Public
exports.getSupplayrs = factory.getAll(Supplayr);

// @desc    Get specific Supplayr by id
// @route   GET /api/v1/Supplayr/:id
// @access  Public
exports.getSupplayr = factory.getOne(Supplayr);

// @desc    Create Supplayr
// @route   POST  /api/v1/Supplayr
// @access  Private
exports.createSupplayr = factory.createOne(Supplayr);
// @desc    Update specific Supplayr
// @route   PUT /api/v1/Supplayr/:id
// @access  Private
exports.updateSupplayr = factory.updateOne(Supplayr);

// @desc    Delete specific Supplayr
// @route   DELETE /api/v1/Supplayr/:id
// @access  Private
exports.deleteSupplayr = factory.deleteOne(Supplayr);

exports.getSupplayrDetails = asyncHandler(async (req, res, next) => {
    const { supplayrId } = req.params;
  
    // Get all sales for the supplayr
    const bell = await Buy_bell.find({ supplayr: supplayrId })
      .populate({ path: 'supplayr', select: 'supplayr_name' });
  
    // Get all purchases for the supplayr
    const buys = await Buy.find({ supplayr: supplayrId })
      .populate({ path: 'supplayr', select: 'supplayr_name' });
  
    const tax = await Supplayr_tax.find({ supplayr: supplayrId })
      .populate({ path: 'supplayr', select: 'supplayr_name' });
  
    if (!bell && !buys && !tax ) {
      return next(new ApiError(`No transactions found for client with ID: ${supplayrId}`, 404));
    }
  
    res.status(200).json({ buys , bell ,tax });
  });
  
