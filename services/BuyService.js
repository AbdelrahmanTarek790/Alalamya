
const asyncHandler = require('express-async-handler');
const ApiFeatures = require('../utils/apiFeatures');
const XLSX = require('xlsx');
const factory = require('./handlersFactory');
const Buy = require('../models/BuyModel');
const Supplayr =require('../models/SupplayrModel');






// @desc    Get list of Buy
// @route   GET /api/v1/Buys
// @access  Public
exports.getBuys = factory.getAll(Buy,'Buy');

// @desc    Get specific Buy by id
// @route   GET /api/v1/Buys/:id
// @access  Public
exports.getBuy = factory.getOne(Buy,'supplayr');

// @desc    Create Buy
// @route   POST  /api/v1/Buys
// @access  Private
exports.createBuy = factory.createOne(Buy);
// @desc    Update specific Buy
// @route   PUT /api/v1/Buys/:id
// @access  Private
exports.updateBuy =  asyncHandler(async (req, res, next) => {
  const document = await Buy.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }

  // Trigger "post" middleware
  await document.constructor.updateWarehouse(document.user, document.product, document.product_code, document.E_wieght, document.size);
  await document.constructor.calcAveragePrice(document.product);
  await document.constructor.updateProductWeight(document.product, document.E_wieght);

  res.status(200).json({ data: document });
});
// @desc    Delete specific Buy
// @route   DELETE /api/v1/Buys/:id
// @access  Private
exports.deleteBuy = factory.deleteOne(Buy);




exports.exportToExcel = asyncHandler(async (req, res) => {

  let filter = {};
  if (req.filterObj) {
    filter = req.filterObj;
  }

  // Build query
  const documentsCounts = await Buy.countDocuments();
  const apiFeatures = new ApiFeatures(Buy.find(filter).populate('user').populate('product').populate('supplayr'), req.query)
    .paginate(documentsCounts)
    .filter()
    .search('Supplayr')
    .limitFields()
    .sort();

  // Execute query
  const { mongooseQuery } = apiFeatures;
  const documents = await mongooseQuery;

  // Convert to Excel
  const workbook = XLSX.utils.book_new();
  const worksheetData = documents.map(doc => {
    const docObj = doc.toObject();
    return {
      'اسم المستخدم': doc.user ? doc.user.name : '',
      'اسم المنتج': doc.product ? doc.product.name : '',
      'اسم المورد': doc.supplayr ? doc.supplayr.supplayr_name : '',
      'تم دفع': doc.pay,
      'سعر الاجمالي ': doc.price_all,
      'كود': doc.product_code,
      'مقاس': doc.size,
      'وزن المنتج': doc.product ? doc.product.weight : '',
      'السعر المتوسط': doc.product ? doc.product.avg_price : '',
      'المبلغ المدفوع': doc.supplayr ? doc.supplayr.price_pay : '',
      'المبلغ الكلي': doc.supplayr ? doc.supplayr.total_price : '',
      'المبلغ المستحق': doc.supplayr ? doc.supplayr.price_on : '',
      'تاريخ الإنشاء': doc.createdAt,
      'تاريخ التحديث': doc.updatedAt,
    };
  });
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

  // Set response headers
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');

  // Send Excel file
  const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  res.send(excelBuffer);
});
