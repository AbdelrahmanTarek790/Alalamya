
const asyncHandler = require('express-async-handler');
const ApiFeatures = require('../utils/apiFeatures');
const XLSX = require('xlsx');
const factory = require('./handlersFactory');
const Buy = require('../models/BuyModel');






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
exports.updateBuy = factory.updateOne(Buy);

// @desc    Delete specific Buy
// @route   DELETE /api/v1/Buys/:id
// @access  Private
exports.deleteBuy = factory.deleteOne(Buy);


exports.printExcel = (Buy, modelName = 'Supplayr') => asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    // Build query
    const documentsCounts = await Buy.countDocuments();
    const apiFeatures = new ApiFeatures(Buy.find(filter).populate('user').populate('product').populate('supplayr'), req.query)
      .paginate(documentsCounts)
      .filter()
      .search(modelName)
      .limitFields()
      .sort();
  
    // Execute query
    const { mongooseQuery } = apiFeatures;
    const documents = await mongooseQuery;
      // Set response headers
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');
    // Convert to Excel
    const workbook = XLSX.utils.book_new();
    const worksheetData = documents.map(doc => {
     const docObj = doc.toObject();
      return {
        'اسم المستخدم': doc.user ? doc.user.name : '',
        'اسم المنتج': doc.product ? doc.product.name : '',
        'اسم المورد': doc.supplayr ? doc.supplayr.supplayr_name : '',
        'تم دفع':doc.pay,
        'سعر الاجمالي ':doc.price_all,
        'كود':doc.product_code,
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



