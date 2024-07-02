exports.printExcel = (Buy, modelName = 'Supplayr') => asyncHandler(async (req, res) => {
  try {
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
    
      // Send Excel file
      const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      res.send(excelBuffer);
  } catch (err) {
      console.log('Error generating Excel file:', err);
      res.status(500).json({ success: false, message: 'Failed to generate Excel file' });
  }
});
