const Sell = require('../models/sellModel');
const Sell_bell = require('../models/Sell_bellModel');
const Buy = require('../models/BuyModel');
const Clint = require('../models/ClintModel');
const Supplier = require('../models/SupplayrModel');
const Product = require('../models/ProductModel');

exports.generateReport = async () => {
  // الحصول على الشهر والسنة الحاليين
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // الأشهر في JavaScript تبدأ من 0
  const currentYear = currentDate.getFullYear();

  // حساب إجمالي المبيعات
  const totalSales = await Sell.aggregate([
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$price_allQuantity' },
        totalWeight: { $sum: '$o_wieght' }
      }
    }
  ]);

  // حساب المالية للمبيعات في الشهر الحالي باستخدام entryDate
  const salesByMonth = await Sell.aggregate([
    {
      $project: {
        month: { $month: '$entryDate' },
        year: { $year: '$entryDate' },
        price_allQuantity: 1,
        o_wieght: 1
      }
    },
    {
      $match: {
        month: currentMonth,
        year: currentYear
      }
    },
    {
      $group: {
        _id: { month: currentMonth, year: currentYear },
        totalAmount: { $sum: '$price_allQuantity' },
        totalWeight: { $sum: '$o_wieght' }
      }
    }
  ]);

  // حساب المالية للمشتريات في الشهر الحالي باستخدام entryDate
  const purchasesByMonth = await Buy.aggregate([
    {
      $project: {
        month: { $month: '$entryDate' },
        year: { $year: '$entryDate' },
        price_all: 1
      }
    },
    {
      $match: {
        month: currentMonth,
        year: currentYear
      }
    },
    {
      $group: {
        _id: { month: currentMonth, year: currentYear },
        totalAmount: { $sum: '$price_all' }
      }
    }
  ]);

  // باقي الاستعلامات تبقى كما هي...

  return {
    totalSales: totalSales.length > 0 ? totalSales[0].totalAmount : 0,
    totalWeightSold: totalSales.length > 0 ? totalSales[0].totalWeight : 0,
    totalPaidByClients,
    totalDueFromClients: totalDueFromClients.length > 0 ? totalDueFromClients[0].totalDue : 0,
    totalPaidToSuppliers,
    totalDueToSuppliers: totalDueToSuppliers.length > 0 ? totalDueToSuppliers[0].totalDue : 0,
    totalPurchases,
    totalProfit,
    totalWightMoney: totalWightMoney.length > 0 ? totalWightMoney[0].totalWightMoney : 0,
    salesByMonth,  // المالية للمبيعات في الشهر الحالي
    purchasesByMonth  // المالية للمشتريات في الشهر الحالي
  };
};