
const factory = require('./handlersFactory');
const Tax_supplayr = require('../models/Tax_supplayrModel');





// @desc    Get list of Tax_supplayr
// @route   GET /api/v1/Tax_supplayrs
// @access  Public
exports.getTax_supplayrs = factory.getAll(Tax_supplayr,'Tax_supplayr');

// @desc    Get specific Tax_supplayr by id
// @route   GET /api/v1/Tax_supplayr/:id
// @access  Public
exports.getTax_supplayr = factory.getOne(Tax_supplayr,'Supplayr');

// @desc    Create Tax_supplayr
// @route   POST  /api/v1/Tax_supplayr
// @access  Private
exports.createTax_supplayr = factory.createOne(Tax_supplayr);
// @desc    Update specific Tax_supplayr
// @route   PUT /api/v1/Tax_supplayr/:id
// @access  Private
exports.updateTax_supplayr = factory.updateOne(Tax_supplayr);

// @desc    Delete specific Tax_supplayr
// @route   DELETE /api/v1/Tax_supplayr/:id
// @access  Private
exports.deleteTax_supplayr = factory.deleteOne(Tax_supplayr);
