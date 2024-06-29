const mongoose = require('mongoose');
const User = require('./userModel');
const Product = require('./ProductModel');
const Clint = require('./ClintModel');
const Warehouse = require('./WarehouseModel');

const SellSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    clint: {
      type: mongoose.Schema.ObjectId,
      ref: 'Clint',
    },
    o_wieght: {
      type: Number,
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
    },
    size_o: {
      type: Number,
      required: true,
    },
    product_code: {
      type: Number,
      required: true,
    },
    priceForKilo: {
      type: Number,
      required: true,
    },
    price_allQuantity: {
      type: Number,
      required: true,
    },
    pay_now: {
      type: Number,
      required: true,
      default :0,
    },
  },
  { timestamps: true }
);

SellSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name -_id' })
    .populate({ path: 'product', select: 'type avg_price weight -_id' })
    .populate({ path: 'clint', select: 'clint_name money_pay money_on -_id' });

  next();
});

SellSchema.statics.updateProductWeightS = async function (productId, weightSold) {
  await Product.findByIdAndUpdate(productId, {
    $inc: { weight: -weightSold },
  });
};

SellSchema.statics.removeFromWarehouse = async function (product_code) {
  const product = await Warehouse.findOne({ product_code });
  if (!product) throw new Error('Product not found in warehouse');

  // إزالة المنتج بالكامل من المخزون
  await Warehouse.deleteOne({ product_code });
};

SellSchema.statics.AddmoneyAndtakeMoneyS = async function (clintId) {
  const result2 = await this.aggregate([
    // مرحلة 1: الحصول على جميع عمليات البيع لعميل معين
    {
      $match: { clint: clintId },
    },
    // مرحلة 2: تجميع عمليات البيع بناءً على clintId وحساب الأسعار، الوزن
    {
      $group: {
        _id: '$clint',
        monyePay: { $sum: '$pay_now' },
        totalMonye: { $sum: '$price_allQuantity' }
      },
    },
  ]);

  if (result2.length > 0) {
    await Clint.findByIdAndUpdate(clintId, {
      money_pay: result2[0].monyePay,
      total_monye: result2[0].totalMonye,
    });
    console.log(result2[0].monyePay);
  }
};

SellSchema.statics.takeMoney_ds = async function (clintId, monyeall) {
  await Clint.findByIdAndUpdate(clintId, {
    $inc: { money_on: +monyeall },
  });
};

SellSchema.statics.takeMoney_bs = async function (clintId, monyePay) {
  await Clint.findByIdAndUpdate(clintId, {
    $inc: { money_on: -monyePay },
  });
};

SellSchema.post('save', async function () {
  await this.constructor.updateProductWeightS(this.product, this.o_wieght);
  await this.constructor.removeFromWarehouse(this.product_code);
  await this.constructor.AddmoneyAndtakeMoneyS(this.clint);
  await this.constructor.takeMoney_ds(this.clint, this.price_allQuantity);
  await this.constructor.takeMoney_bs(this.clint, this.pay_now);
});

const Sell = mongoose.model('Sell', SellSchema);

module.exports = Sell;
