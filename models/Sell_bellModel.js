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

Sell_bellSchema.statics.updateMoney = async function (clintId, oldPayBell, newPayBell) {
  const clint = await Clint.findById(clintId);
  if (!clint) {
    throw new Error(`Client with ID ${clintId} not found`);
  }
  const payBellDifference = newPayBell - oldPayBell;

  if (payBellDifference !== 0) {
    await Clint.findByIdAndUpdate(
      clintId,
      { 
        $inc: { 
          money_pay: payBellDifference,
          money_on: -payBellDifference 
        }
      },
      { new: true }
    );
  }
};

Sell_bellSchema.post('save', async function () {
  await this.constructor.updateMoney(this.clint, 0, this.payBell);
});

Sell_bellSchema.post('findOneAndUpdate', async function (doc) {
  if (doc && doc._update) {
    const oldDocument = await this.model.findById(doc._id).exec();
    if (oldDocument) {
      const oldPayBell = oldDocument.payBell;
      await doc.constructor.updateMoney(doc.clint, oldPayBell, doc.payBell);
    }
  }
});

const Sell_bell = mongoose.model('Sell_bell', Sell_bellSchema);

module.exports = Sell_bell;
