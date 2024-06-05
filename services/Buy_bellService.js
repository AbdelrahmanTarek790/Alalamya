
const factory = require('./handlersFactory');
const Buy_bell = require('../models/Buy_bellModel');





// @desc    Get list of Buy
// @route   GET /api/v1/Buys
// @access  Public
exports.getBuy_bells = factory.getAll(Buy_bell,'Buy_bell');

// @desc    Get specific Buy_bell by id
// @route   GET /api/v1/Buys/:id
// @access  Public
exports.getBuy_bell = factory.getOne(Buy_bell,'Supplayr');

// @desc    Create Buy_bell
// @route   POST  /api/v1/Buys
// @access  Private
exports.createBuy_bell = factory.createOne(Buy_bell);
// @desc    Update specific Buy_bell
// @route   PUT /api/v1/Buys/:id
// @access  Private
exports.updateBuy_bell = factory.updateOne(Buy_bell);

// @desc    Delete specific Buy_bell
// @route   DELETE /api/v1/Buys/:id
// @access  Private
exports.deleteBuy_bell = factory.deleteOne(Buy_bell);





