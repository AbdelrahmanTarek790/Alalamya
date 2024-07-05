const mongoose = require('mongoose');
const User = require('./userModel');
const Product = require('./ProductModel');
const Supplayr = require('./SupplayrModel');
const Warehouse = require('./WarehouseModel');

const BuySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    supplayr: {
      type: mongoose.Schema.ObjectId,
      ref: 'Supplayr',
    },
    size: {
      type: Number,
      required: true,
    },
    E_wieght: {
      type: Number,
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
    },
    product_code: {
      type: Number,
      required: true,
    },
    price_Kilo: {
      type: Number,
      required: true,
    },
    price_all: {
      type: Number,
      required: true,
    },
    pay: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

BuySchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name -_id' })
    .populate({ path: 'product', select: 'type avg_price wieght _id' })
    .populate({ path: 'supplayr', select: 'supplayr_name price_pay price_on _id' });

  next();
});

BuySchema.statics.updateWarehouse = async function (user, product, product_code, E_wieght, size) {
  const existingWarehouse = await Warehouse.findOne({ product_code });
  if (existingWarehouse) {
    await Warehouse.findByIdAndUpdate(existingWarehouse._id, {
      user,
      product,
      weight: E_wieght,
      size
    }, { new: true, runValidators: true });
  } else {
    await Warehouse.create({ user, product, product_code, weight: E_wieght, size });
  }
};

BuySchema.statics.calcAveragePrice = async function (productId) {
  const result = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: '$product',
        avg_price: { $avg: '$price_Kilo' },
      },
    },
  ]);

  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      avg_price: result[0].avg_price,
    });
  }
};

BuySchema.statics.updateProductWeight = async function (productId, weightBuy) {
  await Product.findByIdAndUpdate(productId, {
    $inc: { wieght: +weightBuy },
  });
};

BuySchema.statics.AddmoneyAndtakeMoney_b = async function (supplayrId) {
  const result2 = await this.aggregate([
    {
      $match: { supplayr: supplayrId },
    },
    {
      $group: {
        _id: '$supplayr',
        pricePay: { $sum: '$pay' },
        totalPrice: { $sum: '$price_all' },
      },
    },
  ]);

  if (result2.length > 0) {
    await Supplayr.findByIdAndUpdate(supplayrId, {
      price_pay: result2[0].pricePay,
      total_price: result2[0].totalPrice,
    });
  }
};

BuySchema.statics.takeMoney_d = async function (supplayrId, priceall) {
  await Supplayr.findByIdAndUpdate(supplayrId, {
    $inc: { price_on: +priceall },
  });
};

BuySchema.statics.takeMoney_b = async function (supplayrId, pricePay) {
  await Supplayr.findByIdAndUpdate(supplayrId, {
    $inc: { price_on: -pricePay },
  });
};

BuySchema.statics.allcalc_d = async function (supplayrId, price_all) {
  await Supplayr.findByIdAndUpdate(supplayrId, {
    $inc: { moneyOn_me: +price_all },
  });
};

BuySchema.statics.allcalc_b = async function (supplayrId, price_Pay) {
  await Supplayr.findByIdAndUpdate(supplayrId, {
    $inc: { moneyOn_me: -price_Pay },
  });
};

BuySchema.post('save', async function () {
  await this.constructor.updateWarehouse(this.user, this.product, this.product_code, this.E_wieght, this.size);
  await this.constructor.calcAveragePrice(this.product);
  await this.constructor.updateProductWeight(this.product, this.E_wieght);
  await this.constructor.takeMoney_d(this.supplayr, this.price_all);
  await this.constructor.takeMoney_b(this.supplayr, this.pay);
  await this.constructor.allcalc_d(this.supplayr, this.price_all);
  await this.constructor.allcalc_b(this.supplayr, this.pay);
  await this.constructor.AddmoneyAndtakeMoney_b(this.supplayr);
});

BuySchema.post('findOneAndUpdate', async function (doc) {
  if (doc) {
    await doc.constructor.updateWarehouse(doc.user, doc.product, doc.product_code, doc.E_wieght, doc.size);
    await doc.constructor.calcAveragePrice(doc.product);
    await doc.constructor.updateProductWeight(doc.product, doc.E_wieght);
  }
});

const Buy = mongoose.model('Buy', BuySchema);

module.exports = Buy;
