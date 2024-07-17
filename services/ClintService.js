const mongoose = require('mongoose'); 
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ExcelJS = require('exceljs');
const factory = require('./handlersFactory');
const Clint = require('../models/ClintModel');
const Sell =require('../models/sellModel');
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

// services/clintService.js

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

  if (!bell && !sela && !tax  && !chBack) {
    return next(new ApiError(`No transactions found for client with ID: ${clientId}`, 404));
  }

  res.status(200).json({  sela , bell , chBack ,tax });
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

  if (!bell && !sela && !tax  && !chBack) {
    return next(new ApiError(`لا توجد معاملات للعميل مع هذا المعرف: ${clientId}`, 404));
  }

  const workbook = new ExcelJS.Workbook();
  const salesheet = workbook.addWorksheet('مبيعات');
  const bellsheet = workbook.addWorksheet('فوتير');
  const taxSheet = workbook.addWorksheet('الضريبة');
  const checkBackSheet = workbook.addWorksheet('الشيكات المرتجعة');
//Add  columns for sell sheet
salesheet.columns = [
  { header: 'العميل', key: 'clint', width: 20 },
  { header: 'النوع', key: 'product', width: 15 },
  { header: 'وزن البكرة', key: 'o_wieght', width: 15 },
  { header: 'مقاس', key: 'size_o', width: 15 },
  { header: 'سعر', key: 'price_allQuantity', width: 15 },
  { header: 'المدفوع', key: 'pay_now', width: 15 },
  { header: 'تاريخ الإنشاء', key: 'createdAt', width: 20 },
];

 sela.forEach(sll=>{
  salesheet.addRow({
    clint:sll.clint.clint_name,
    product:sll.product.type,
    o_wieght:sll.o_wieght,
    size_o :sll.size_o,
    price_allQuantity:sll.price_allQuantity,
    pay_now:sll.pay_now,
    createdAt:sll.createdAt.toLocaleString(),
  });
 });
  // Add columns for bell sheet
  bellsheet.columns = [
    { header: 'العميل', key: 'clint', width: 20 },
    { header: 'مبلغ الفاتورة', key: 'payBell', width: 15 },
    { header: 'طريقة الدفع', key: 'paymentMethod', width: 15 },
    { header: 'رقم الشيك', key: 'checkNumber', width: 15 },
    { header: 'تاريخ الشيك', key: 'checkDate', width: 15 },
    { header: 'تاريخ الإنشاء', key: 'createdAt', width: 20 },
  ];

  // Add rows for sales sheet
  bell.forEach(sale => {
    bellsheet.addRow({
      clint: sale.clint.clint_name,
      payBell: sale.payBell,
      paymentMethod: sale.paymentMethod,
      checkNumber: sale.checkNumber,
      checkDate: sale.checkDate,
      createdAt: sale.createdAt.toLocaleString(),
    });
  });

  

  // Add columns for tax sheet
  taxSheet.columns = [
    { header: 'العميل', key: 'clint', width: 20 },
    { header: 'مبلغ', key: 'amount', width: 15 },
    { header: 'نسبة خصم', key: 'discountRate', width: 15 },
    { header: 'الضريبة', key: 'taxRate', width: 15 },
    { header: 'تاريخ الإنشاء', key: 'createdAt', width: 20 },
  ];

  // Add rows for tax sheet
  tax.forEach(t => {
    taxSheet.addRow({
      clint: t.clint.clint_name,
      amount: t.amount,
      discountRate: t.discountRate,
      taxRate:t.taxRate,
      createdAt: t.createdAt.toLocaleString(),
    });
  });

  // Add columns for check back sheet
  checkBackSheet.columns = [
    { header: 'العميل', key: 'clint', width: 20 },
    { header: 'مبلغ الشيك', key: 'checkAmount', width: 15 },
    { header: 'تاريخ', key: 'createdAt', width: 20 },
  ];

  // Add rows for check back sheet
  chBack.forEach(ch => {
    checkBackSheet.addRow({
      clint: ch.clint.clint_name,
      checkAmount: ch.checkAmount,
      checkDate: ch.checkDate,
      createdAt: ch.createdAt.toLocaleString(),
    });
  });

  // Set response headers
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=client_${clientId}_details.xlsx`);

  // Write to response
  await workbook.xlsx.write(res);

  res.end();
});
