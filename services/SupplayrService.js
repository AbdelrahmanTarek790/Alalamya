
const factory = require('./handlersFactory');
const Supplayr = require('../models/SupplayrModel')





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
