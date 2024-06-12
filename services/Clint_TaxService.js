
const factory = require('./handlersFactory');
const Tax_clint = require('../models/Tax_clintModel');





// @desc    Get list of Tax_clint
// @route   GET /api/v1/Tax_clints
// @access  Public
exports.getTax_clints = factory.getAll(Tax_clint);

// @desc    Get specific Tax_clint by id
// @route   GET /api/v1/Tax_clint/:id
// @access  Public
exports.getTax_clint = factory.getOne(Tax_clint,'Clint');

// @desc    Create Tax_clint
// @route   POST  /api/v1/Tax_clint
// @access  Private
exports.createTax_clint = factory.createOne(Tax_clint);
// @desc    Update specific Tax_clint
// @route   PUT /api/v1/Tax_clint/:id
// @access  Private
exports.updateTax_clint = factory.updateOne(Tax_clint);

// @desc    Delete specific Tax_clint
// @route   DELETE /api/v1/Tax_clint/:id
// @access  Private
exports.deleteTax_clint = factory.deleteOne(Tax_clint);
