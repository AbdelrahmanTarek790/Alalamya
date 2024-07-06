const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const factory = require('./handlersFactory');
const Sell_bell = require('../models/Sell_bellModel');

// Get list of Sell
exports.getSell_bells = factory.getAll(Sell_bell, 'Sell_bell');

// Get specific Sell_bell by id
exports.getSell_bell = factory.getOne(Sell_bell, 'clint');

// Create Sell_bell
exports.createSell_bell = factory.createOne(Sell_bell);

// Update specific Sell_bell
exports.updateSell_bell = asyncHandler(async (req, res, next) => {
  const oldDocument = await Sell_bell.findById(req.params.id);

  if (!oldDocument) {
    return next(new ApiError(`No document found for this ID: ${req.params.id}`, 404));
  }

  const payBellChanged = req.body.payBell !== undefined && req.body.payBell !== oldDocument.payBell;
  let oldPayBell = 0;

  if (payBellChanged) {
    oldPayBell = oldDocument.payBell;
  }

  req.body.oldPayBell = oldPayBell;

  const document = await Sell_bell.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true,
      context: 'query', // تعيين context إلى 'query' لضمان توفر doc._update
      select: 'oldPayBell' // استبعاد oldPayBell من الوثيقة المُرجعة
    }
  );

  if (!document) {
    return next(new ApiError(`No document found for this ID: ${req.params.id}`, 404));
  }

  res.status(200).json({ data: document });
});

// Delete specific Sell_bell
exports.deleteSell_bell = factory.deleteOne(Sell_bell);
