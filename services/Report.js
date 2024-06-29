const Sell = require('../models/sellModel');
const Sell_bell = require('../models/Sell_bellModel');
const Clint = require('../models/ClintModel');
const Supplier = require('../models/SupplayrModel');

exports.generateReport = async (startDate, endDate) => {
  const matchStage = {
    $match: {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }
  };

  // حساب إجمالي المبيعات
  const totalSales = await Sell.aggregate([
    matchStage,
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$price_allQuantity' },
        totalWeight: { $sum: '$o_wieght' }
      }
    }
  ]);

  // حساب الأموال المستحقة من العملاء
  const moneyFromClients = await Clint.aggregate([
    {
      $lookup: {
        from: 'sells',
        localField: '_id',
        foreignField: 'clint',
        as: 'sells'
      }
    },
    {
      $addFields: {
        totalPayNow: { $sum: '$sells.pay_now' },
        totalAllQuantity: { $sum: '$sells.price_allQuantity' }
      }
    }
  ]);

  // حساب الأموال المستحقة للموردين
  const moneyToSuppliers = await Supplier.aggregate([
    {
      $lookup: {
        from: 'sells',
        localField: '_id',
        foreignField: 'supplier',
        as: 'sells'
      }
    },
    {
      $unwind: '$sells'
    },
    matchStage,
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$sells.price_allQuantity' }
      }
    }
  ]);

  // حساب إجمالي الربح
  const totalProfit = totalSales.length > 0 ? totalSales[0].totalAmount : 0; // افتراض أن الربح هو إجمالي المبيعات

  return {
    totalSales: totalSales.length > 0 ? totalSales[0].totalAmount : 0,
    totalWeight: totalSales.length > 0 ? totalSales[0].totalWeight : 0,
    moneyFromClients,
    moneyToSuppliers: moneyToSuppliers.length > 0 ? moneyToSuppliers[0].totalAmount : 0,
    totalProfit
  };
};
