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
  const { id } = req.params;

  // Find the document by ID and update it with the request body
  const updatedDocument = await Buy_bell.findByIdAndUpdate(id, req.body, {
    new: true, // Return the updated document
    runValidators: true, // Run validators to ensure the updated document is valid
    context: 'query' // Ensure the `doc._update` object is available in hooks
  });

  // If no document found, return a 404 error
  if (!updatedDocument) {
    return next(new ApiError(`No document found for this ID: ${id}`, 404));
  }

  // Optionally, trigger post middleware actions here if needed

  // Respond with the updated document in JSON format
  res.status(200).json({ data: updatedDocument });
});

// @desc    Delete specific Buy_bell
// @route   DELETE /api/v1/Buys/:id
// @access  Private
exports.deleteBuy_bell = factory.deleteOne(Buy_bell);





