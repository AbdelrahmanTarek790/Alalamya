
const factory = require('./handlersFactory');
const Clint = require('../models/ClintModel');





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
