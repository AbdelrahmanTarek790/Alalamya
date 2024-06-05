
const factory = require('./handlersFactory');
const Sell = require('../models/sellModel');




// @desc    Get list of Sell
// @route   GET /api/v1/Sells
// @access  Public
exports.getSells = factory.getAll(Sell,'Product');

// @desc    Get specific Sell by id
// @route   GET /api/v1/Sells/:id
// @access  Public
exports.getSell = factory.getOne(Sell,'clint');

// @desc    Create Sell
// @route   POST  /api/v1/Sells
// @access  Private
exports.createSell = factory.createOne(Sell);
// @desc    Update specific Sell
// @route   PUT /api/v1/Sells/:id
// @access  Private
exports.updateSell = factory.updateOne(Sell);

// @desc    Delete specific Sell
// @route   DELETE /api/v1/Sells/:id
// @access  Private
exports.deleteSell = factory.deleteOne(Sell);

exports.printExcel_Sell = factory.exportToExcel(Sell,'clint');
