const mongoose = require('mongoose'); 
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const factory = require('./handlersFactory');
const ExcelJS = require('exceljs');
const Supplayr = require('../models/SupplayrModel');
const Buy = require('../models/BuyModel');
const Buy_bell = require('../models/Buy_bellModel');
const Supplayr_tax = require('../models/Tax_supplayrModel');

// @desc    Get list of Supplayr
// @route   GET /api/v1/supplayrs
// @access  Public
exports.getSupplayrs = factory.getAll(Supplayr);

// @desc    Get specific Supplayr by id
// @route   GET /api/v1/supplayr/:id
// @access  Public
exports.getSupplayr = factory.getOne(Supplayr);

// @desc    Create Supplayr
// @route   POST  /api/v1/supplayr
// @access  Private
exports.createSupplayr = factory.createOne(Supplayr);

// @desc    Update specific Supplayr
// @route   PUT /api/v1/supplayr/:id
// @access  Private
exports.updateSupplayr = factory.updateOne(Supplayr);

// @desc    Delete specific Supplayr
// @route   DELETE /api/v1/supplayr/:id
// @access  Private
exports.deleteSupplayr = factory.deleteOne(Supplayr);

exports.getSupplayrDetails = asyncHandler(async (req, res, next) => {
  const { supplayrId } = req.params;

  // Get all sales for the supplayr
  const bell = await Buy_bell.find({ supplayr: supplayrId })
    .populate({ path: 'supplayr', select: 'supplayr_name' });

  // Get all purchases for the supplayr
  const buys = await Buy.find({ supplayr: supplayrId })
    .populate({ path: 'supplayr', select: 'supplayr_name' });

  const tax = await Supplayr_tax.find({ supplayr: supplayrId })
    .populate({ path: 'supplayr', select: 'supplayr_name' });

  if (!bell && !buys && !tax) {
    return next(new ApiError(`No transactions found for supplier with ID: ${supplayrId}`, 404));
  }

  res.status(200).json({ buys, bell, tax });
});

exports.exportSupplayrDetailsToExcel = asyncHandler(async (req, res, next) => {
  const { supplayrId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(supplayrId)) {
    return next(new ApiError('Invalid supplier ID', 400));
  }

  // Get all sales for the supplayr
  const bell = await Buy_bell.find({ supplayr: supplayrId })
    .populate({ path: 'supplayr', select: 'supplayr_name' });

  // Get all purchases for the supplayr
  const buys = await Buy.find({ supplayr: supplayrId })
    .populate({ path: 'supplayr', select: 'supplayr_name' });

  const tax = await Supplayr_tax.find({ supplayr: supplayrId })
    .populate({ path: 'supplayr', select: 'supplayr_name' });

  if (!bell.length && !buys.length && !tax.length) {
    return next(new ApiError(`No transactions found for supplier with ID: ${supplayrId}`, 404));
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Supplier Details');

  // Add columns for the combined sheet
  worksheet.columns = [
    { header: 'المورد', key: 'supplayr', width: 20 },
    { header: 'نوع البيانات', key: 'data_type', width: 15 },
    { header: 'النوع', key: 'product', width: 15 },
    { header: 'وزن البكرة', key: 'E_wieght', width: 15 },
    { header: 'مقاس', key: 'size', width: 15 },
    { header: 'سعر', key: 'price_all', width: 15 },
    { header: 'المدفوع', key: 'pay', width: 15 },
    { header: 'مبلغ الفاتورة', key: 'pay_bell', width: 15 },
    { header: 'طريقة الدفع', key: 'payment_method', width: 15 },
    { header: 'رقم الشيك', key: 'check_number', width: 15 },
    { header: 'تاريخ الشيك', key: 'check_date', width: 15 },
    { header: 'مبلغ الضريبة', key: 'amount', width: 15 },
    { header: 'نسبة خصم', key: 'discountRate', width: 15 },
    { header: 'الضريبة', key: 'taxRate', width: 15 },
    { header: 'تاريخ الإنشاء', key: 'createdAt', width: 20 },
  ];

  // Add rows for buys
  buys.forEach(by => {
    worksheet.addRow({
      supplayr: by.supplayr.supplayr_name,
      data_type: 'مشتريات',
      product: by.product.type,
      E_wieght: by.E_wieght,
      size: by.size,
      price_all: by.price_all,
      pay: by.pay,
      createdAt: by.createdAt.toLocaleString(),
    });
  });

  // Add an empty row to separate sections
  worksheet.addRow({});

  // Add rows for bell
  bell.forEach(bay => {
    worksheet.addRow({
      supplayr: bay.supplayr.supplayr_name,
      data_type: 'فواتير',
      pay_bell: bay.pay_bell,
      payment_method: bay.payment_method,
      check_number: bay.check_number,
      check_date: bay.check_date,
      createdAt: bay.createdAt.toLocaleString(),
    });
  });

  // Add an empty row to separate sections
  worksheet.addRow({});

  // Add rows for tax
  tax.forEach(t => {
    worksheet.addRow({
      supplayr: t.supplayr.supplayr_name,
      data_type: 'الضريبة',
      amount: t.amount,
      discountRate: t.discountRate,
      taxRate: t.taxRate,
      createdAt: t.createdAt.toLocaleString(),
    });
  });

  // Set response headers
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=supplier_${supplayrId}_details.xlsx`);

  // Write to response
  await workbook.xlsx.write(res);

  res.end();
});
