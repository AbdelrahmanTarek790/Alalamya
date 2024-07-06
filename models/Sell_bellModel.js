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

Sell_bellSchema.statics.adjustClintBalance = async function (clintId, amountChange) {
  if (!isNaN(amountChange) && amountChange !== 0) {
    await Clint.findByIdAndUpdate(
      clintId,
      {
        $inc: {
          money_pay: amountChange,
          money_on: -amountChange
        }
      },
      { new: true }
    );
  }
};

Sell_bellSchema.pre('save', async function (next) {
  if (this.isNew) {
    this._originalPayBell = 0;  // Document is new, original amount is 0
  } else {
    const docToUpdate = await this.constructor.findById(this._id);
    if (docToUpdate) {
      this._originalPayBell = docToUpdate.payBell;
    }
  }
  next();
});

Sell_bellSchema.post('save', async function () {
  const payBellChange = this.payBell - this._originalPayBell;
  if (!isNaN(payBellChange)) {
    await this.constructor.adjustClintBalance(this.clint, payBellChange);
  }
});

Sell_bellSchema.pre('findOneAndUpdate', async function (next) {
  const docToUpdate = await this.model.findOne(this.getQuery());
  if (docToUpdate) {
    this._originalPayBell = docToUpdate.payBell;
  }
  next();
});

Sell_bellSchema.post('findOneAndUpdate', async function (doc) {
  if (doc) {
    const payBellChange = doc.payBell - this._originalPayBell;
    if (!isNaN(payBellChange)) {
      await doc.constructor.adjustClintBalance(doc.clint, payBellChange);
    }
  }
});

const Sell_bell = mongoose.model('Sell_bell', Sell_bellSchema);

module.exports = Sell_bell;
