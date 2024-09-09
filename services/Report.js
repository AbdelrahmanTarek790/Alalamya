const Sell = require('../models/sellModel');
const Sell_bell = require('../models/Sell_bellModel');
const Buy = require('../models/BuyModel');
const Clint = require('../models/ClintModel');
const Supplier = require('../models/SupplayrModel');
const Product = require('../models/ProductModel');

exports.generateReport = async () => {
  try {
    // إجمالي المبيعات
    const totalSales = await Sell.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$price_allQuantity' },
          totalWeight: { $sum: '$o_wieght' }
        }
      }
    ]);

    // المبلغ المدفوع من العملاء
    const totalPaidByClientsFromSell = await Sell.aggregate([
      {
        $group: {
          _id: null,
          totalPaid: { $sum: '$pay_now' }
        }
      }
    ]);

    const totalPaidByClientsFromSellBell = await Sell_bell.aggregate([
      {
        $group: {
          _id: null,
          totalPaid: { $sum: '$pay_now' }
        }
      }
    ]);

    const totalPaidByClients = 
      (totalPaidByClientsFromSell.length > 0 ? totalPaidByClientsFromSell[0].totalPaid : 0) +
      (totalPaidByClientsFromSellBell.length > 0 ? totalPaidByClientsFromSellBell[0].totalPaid : 0);

    // إجمالي المستحقات من العملاء
    const totalDueFromClients = await Clint.aggregate([
      {
        $group: {
          _id: null,
          totalDue: { $sum: '$money_on' }
        }
      }
    ]);

    // المبلغ المدفوع للموردين
    const totalPaidToSuppliersFromBuy = await Buy.aggregate([
      {
        $group: {
          _id: null,
          totalPaid: { $sum: '$pay' }
        }
      }
    ]);

    const totalPaidToSuppliers = totalPaidToSuppliersFromBuy.length > 0 ? totalPaidToSuppliersFromBuy[0].totalPaid : 0;

    // إجمالي المستحقات للموردين
    const totalDueToSuppliers = await Supplier.aggregate([
      {
        $group: {
          _id: null,
          totalDue: { $sum: '$price_on' }
        }
      }
    ]);

    // إجمالي المشتريات
    const totalPurchasesFromBuy = await Buy.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$price_all' }
        }
      }
    ]);

    const totalPurchases = totalPurchasesFromBuy.length > 0 ? totalPurchasesFromBuy[0].totalAmount : 0;

    // إجمالي الربح
    const totalProfit = totalSales.length > 0 ? totalSales[0].totalAmount - totalPurchases : 0;

    // إجمالي وزن المال
    const totalWightMoney = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalWightMoney: { $sum: '$wight_money' }
        }
      }
    ]);

    // المبيعات الشهرية
    const monthlySales = await Sell.aggregate([
      {
        $match: {
          entry_date: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // بداية الشهر الحالي
            $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)  // بداية الشهر القادم
          }
        }
      },
      {
        $group: {
          _id: { $month: '$entry_date' },
          totalAmount: { $sum: '$price_allQuantity' },
          totalWeight: { $sum: '$o_wieght' }
        }
      }
    ]);

    // المشتريات الشهرية
    const monthlyPurchases = await Buy.aggregate([
      {
        $match: {
          Entry_date: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // بداية الشهر الحالي
            $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)  // بداية الشهر القادم
          }
        }
      },
      {
        $group: {
          _id: { $month: '$Entry_date' },
          totalAmount: { $sum: '$price_all' },
          totalWeight: { $sum: '$E_wieght' }
        }
      }
    ]);

    // إرجاع التقرير النهائي
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
      monthlySales,
      monthlyPurchases
    };

  } catch (error) {
    console.error("Error generating report:", error.message);
    throw new Error("Error generating report");
  }
};