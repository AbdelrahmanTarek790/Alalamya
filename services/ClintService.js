const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ExcelJS = require('exceljs');
const factory = require('./handlersFactory');
const Clint = require('../models/ClintModel');
const Sell = require('../models/sellModel');
const Sell_bell = require('../models/Sell_bellModel');
const clint_tax = require('../models/Tax_clintModel');
const check_back = require('../models/ReturnCheckModel');

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

exports.getClientDetails = asyncHandler(async (req, res, next) => {
  const { clientId } = req.params;

  // Get all sales for the client
  const bell = await Sell_bell.find({ clint: clientId })
    .populate({ path: 'clint', select: 'clint_name' });

  // Get all purchases for the client
  const sela = await Sell.find({ clint: clientId })
    .populate({ path: 'clint', select: 'clint_name' });

  const tax = await clint_tax.find({ clint: clientId })
    .populate({ path: 'clint', select: 'clint_name' });

  const chBack = await check_back.find({ clint: clientId })
    .populate({ path: 'clint', select: 'clint_name' });

  if (!bell && !sela && !tax && !chBack) {
    return next(new ApiError(`No transactions found for client with ID: ${clientId}`, 404));
  }

  res.status(200).json({ sela, bell, chBack, tax });
});

exports.exportClientDetailsToExcel = asyncHandler(async (req, res, next) => {
  const { clientId } = req.params;

  // Get all sales for the client
  const bell = await Sell_bell.find({ clint: clientId })
    .populate({ path: 'clint', select: 'clint_name' });

  // Get all purchases for the client
  const sela = await Sell.find({ clint: clientId })
    .populate({ path: 'clint', select: 'clint_name' });

  const tax = await clint_tax.find({ clint: clientId })
    .populate({ path: 'clint', select: 'clint_name' });

  const chBack = await check_back.find({ clint: clientId })
    .populate({ path: 'clint', select: 'clint_name' });

  if (!bell.length && !sela.length && !tax.length && !chBack.length) {
    return next(new ApiError(`لا توجد معاملات للعميل مع هذا المعرف: ${clientId}`, 404));
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Client Details');

  // Array to hold all records
  const allRecords = [];

  // Add all sell records
  sela.forEach(sll => {
    allRecords.push({
      type: 'مبيعات',
      clint: sll.clint.clint_name,
      product: sll.product.type,
      weight: sll.o_wieght,
      size: sll.size_o,
      amount: sll.price_allQuantity,
      paid: sll.pay_now,
      date: sll.createdAt,
      checkNumber: '',
      checkDate: '',
      discountRate: '',
      taxRate: '',
    });
  });

  // Add all bell records
  bell.forEach(sale => {
    allRecords.push({
      type: 'فواتير',
      clint: sale.clint.clint_name,
      product: '',
      weight: '',
      size: '',
      amount: sale.payBell,
      paid: sale.paymentMethod,
      date: sale.createdAt,
      checkNumber: sale.checkNumber,
      checkDate: sale.checkDate,
      discountRate: '',
      taxRate: '',
    });
  });

  // Add all tax records
  tax.forEach(t => {
    allRecords.push({
      type: 'الضريبة',
      clint: t.clint.clint_name,
      product: '',
      weight: '',
      size: '',
      amount: t.amount,
      paid: '',
      date: t.createdAt,
      checkNumber: '',
      checkDate: '',
      discountRate: t.discountRate,
      taxRate: t.taxRate,
    });
  });

  // Add all check back records
  chBack.forEach(ch => {
    allRecords.push({
      type: 'الشيكات المرتجعة',
      clint: ch.clint.clint_name,
      product: '',
      weight: '',
      size: '',
      amount: ch.checkAmount,
      paid: '',
      date: ch.createdAt,
      checkNumber: '',
      checkDate: ch.checkDate,
      discountRate: '',
      taxRate: '',
    });
  });

  // Sort records by date
  allRecords.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Add header row
  worksheet.addRow([
    'النوع', 'العميل', 'النوع', 'وزن البكرة', 'مقاس', 'المبلغ', 'المدفوع', 'تاريخ الإنشاء', 'رقم الشيك', 'تاريخ الشيك', 'نسبة خصم', 'الضريبة'
  ]);

  // Add records to worksheet
  allRecords.forEach(record => {
    worksheet.addRow([
      record.type,
      record.clint,
      record.product,
      record.weight,
      record.size,
      record.amount,
      record.paid,
      record.date.toLocaleString(),
      record.checkNumber,
      record.checkDate,
      record.discountRate,
      record.taxRate,
    ]);
  });

  // Set column widths
  worksheet.columns = [
    { key: 'type', width: 15 },
    { key: 'clint', width: 25 },
    { key: 'product', width: 20 },
    { key: 'weight', width: 20 },
    { key: 'size', width: 15 },
    { key: 'amount', width: 20 },
    { key: 'paid', width: 20 },
    { key: 'date', width: 25 },
    { key: 'checkNumber', width: 20 },
    { key: 'checkDate', width: 20 },
    { key: 'discountRate', width: 20 },
    { key: 'taxRate', width: 20 },
  ];

  // Set response headers
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=client_${clientId}_details.xlsx`);

  // Write to response
  await workbook.xlsx.write(res);

  res.end();
});
