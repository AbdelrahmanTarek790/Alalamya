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
    $inc: { wieght: -weightSold },
  });
};

SellSchema.statics.removeFromWarehouse = async function (product_code, weightSold) {
  const product = await Warehouse.findOne({ product_code });
  if (!product) throw new Error('Product not found in warehouse');
  if (product.weight < weightSold) throw new Error('Not enough quantity in warehouse');
  product.weight -= weightSold;
  if (product.weight === 0) {
    await Warehouse.deleteOne({ product_code });
  } else {
    await product.save();
  }
};

SellSchema.statics.AddmoneyAndtakeMoneyS = async function (clintId) {
  const result2 = await this.aggregate([
    // Stage 1 : get all Sells in specific clint
    {
      $match: { clint: clintId },
    },
    // Stage 2: Grouping Sells based on clintId and calc Prices, weight
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
  await this.constructor.removeFromWarehouse(this.product_code, this.o_wieght);
  await this.constructor.AddmoneyAndtakeMoneyS(this.clint);
  await this.constructor.takeMoney_ds(this.clint, this.price_allQuantity);
  await this.constructor.takeMoney_bs(this.clint, this.pay_now);
});

const Sell = mongoose.model('Sell', SellSchema);

module.exports = Sell;
