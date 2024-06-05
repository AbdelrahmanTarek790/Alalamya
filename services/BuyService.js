
const factory = require('./handlersFactory');
const Buy = require('../models/BuyModel');





// @desc    Get list of Buy
// @route   GET /api/v1/Buys
// @access  Public
exports.getBuys = factory.getAll(Buy,'Buy');

// @desc    Get specific Buy by id
// @route   GET /api/v1/Buys/:id
// @access  Public
exports.getBuy = factory.getOne(Buy,'Supplayr');

// @desc    Create Buy
// @route   POST  /api/v1/Buys
// @access  Private
exports.createBuy = factory.createOne(Buy);
// @desc    Update specific Buy
// @route   PUT /api/v1/Buys/:id
// @access  Private
exports.updateBuy = factory.updateOne(Buy);

// @desc    Delete specific Buy
// @route   DELETE /api/v1/Buys/:id
// @access  Private
exports.deleteBuy = factory.deleteOne(Buy);


exports.printExcel = factory.exportToExcel(Buy,'Supplayr');



