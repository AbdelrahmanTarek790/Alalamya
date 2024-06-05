
const factory = require('./handlersFactory');
const Sell_bell = require('../models/Sell_bellModel');





// @desc    Get list of Sell
// @route   GET /api/v1/Sells
// @access  Public
exports.getSell_bells = factory.getAll(Sell_bell,'Sell_bell');

// @desc    Get specific Sell_bell by id
// @route   GET /api/v1/Sells/:id
// @access  Public
exports.getSell_bell = factory.getOne(Sell_bell,'Supplayr');

// @desc    Create Sell_bell
// @route   POST  /api/v1/Sells
// @access  Private
exports.createSell_bell = factory.createOne(Sell_bell);
// @desc    Update specific Sell_bell
// @route   PUT /api/v1/Sells/:id
// @access  Private
exports.updateSell_bell = factory.updateOne(Sell_bell);

// @desc    Delete specific Sell_bell
// @route   DELETE /api/v1/Sells/:id
// @access  Private
exports.deleteSell_bell = factory.deleteOne(Sell_bell);





