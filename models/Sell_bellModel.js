const mongoose = require('mongoose');
const User = require('./userModel');
const Clint = require('./ClintModel');

const Sell_bellSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    clint: {
      type: mongoose.Schema.ObjectId,
      ref: 'Clint',
      required: true,
    },
    payBell: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'check'],
      required: true,
    },
    checkNumber: {
      type: String,
      required: function () {
        return this.paymentMethod === 'check';
      },
    },
    checkDate: {
      type: String,
      required: function () {
        return this.paymentMethod === 'check';
      },
    },
  },
  { timestamps: true }
);

Sell_bellSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name _id' })
      .populate({ path: 'clint', select: 'clint_name money_on money_pay total_monye _id' });
  next();
});

Sell_bellSchema.statics.takeMoney_d = async function (clintId, priceall) {
  await Clint.findByIdAndUpdate(
    clintId,
    { $inc: { money_pay: priceall } },
    { new: true }
  );
};

Sell_bellSchema.statics.takeMoney_b = async function (clintId, pricePay) {
  await Clint.findByIdAndUpdate(
    clintId,
    { $inc: { money_on: -pricePay } },
    { new: true }
  );
};

Sell_bellSchema.post('save', async function () {
  await this.constructor.takeMoney_d(this.clint, this.payBell);
  await this.constructor.takeMoney_b(this.clint, this.payBell);
});

Sell_bellSchema.post('findOneAndUpdate', async function (doc) {
  if (doc) {
    await doc.constructor.takeMoney_d(doc.clint, doc.payBell);
    await doc.constructor.takeMoney_b(doc.clint, doc.payBell);
  }
});

const Sell_bell = mongoose.model('Sell_bell', Sell_bellSchema);

module.exports = Sell_bell;
