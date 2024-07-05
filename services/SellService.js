
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');
const XLSX = require('xlsx');
const factory = require('./handlersFactory');
const Sell = require('../models/sellModel');




// @desc    Get list of Sell
// @route   GET /api/v1/Sells
// @access  Public
exports.getSells = factory.getAll(Sell,'Product');

// @desc    Get specific Sell by id
// @route   GET /api/v1/Sells/:id
// @access  Public
exports.getSell = factory.getOne(Sell,'clint');

// @desc    Create Sell
// @route   POST  /api/v1/Sells
// @access  Private
exports.createSell = factory.createOne(Sell);
// @desc    Update specific Sell
// @route   PUT /api/v1/Sells/:id
// @access  Private
exports.updateSell =  asyncHandler(async (req, res, next) => {
  const document = await Sell.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }

  
  await document.constructor.AddmoneyAndtakeMoneyS(document.clint);
  await document.constructor.takeMoney_ds(document.clint, document.price_allQuantity);
  await document.constructor.takeMoney_bs(document.clint, document.pay_now);

  // لا تقم بتفعيل عملية الحفظ مرة أخرى لتجنب تفعيل post('save')

  res.status(200).json({ data: document });
});
// @desc    Delete specific Sell
// @route   DELETE /api/v1/Sells/:id
// @access  Private
exports.deleteSell = factory.deleteOne(Sell);

exports.printExcel_Sell =  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    // Build query
    const documentsCounts = await Sell.countDocuments();
    const apiFeatures = new ApiFeatures(Sell.find(filter).populate('user').populate('product').populate('clint'), req.query)
      .paginate(documentsCounts)
      .filter()
      .search('Clint')
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
        'اسم العميل': doc.clint ? doc.clint.clint_name : '',
        'تم دفع':doc.pay_now,
        'سعر الاجمالي ':doc.price_allQuantity,
        'كود':doc.product_code,
        'مقاس': doc.size_o,
        'وزن الخروج': doc.o_wieght,
        'المبلغ اجمالي المدفوع': doc.clint ? doc.clint.money_pay : '',
        'المبلغ الكلي': doc.clint ? doc.clint.total_monye : '',
        'المبلغ المستحق': doc.clint ? doc.clint.money_on : '',
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




