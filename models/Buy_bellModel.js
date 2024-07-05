const mongoose = require('mongoose');
const User = require('./userModel');
const Supplayr = require('./SupplayrModel');

const Buy_bellSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    supplayr_name: {
      type: String,
      required: true,
    },
    pay_bell: {
      type: Number,
      required: true,
      default: 0,
    },
    payment_method: {
      type: String,
      enum: ['cash', 'check'],
      required: true,
    },
    check_number: {
      type: String,
      required: function () {
        return this.payment_method === 'check';
      },
    },
    check_date: {
      type: String,
      required: function () {
        return this.payment_method === 'check';
      },
    },
  },
  { timestamps: true }
);

Buy_bellSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name _id' })
    .populate({ path: 'supplayr', select: 'supplayr_name price_pay price_on total_price _id' });

  next();
});

Buy_bellSchema.statics.takeMoney_d = async function(supplayrId, amount) {
  await Supplayr.findByIdAndUpdate(supplayrId, {
    $inc: { price_pay: +amount },
  });
};

Buy_bellSchema.statics.takeMoney_b = async function(supplayrId, amount) {
  await Supplayr.findByIdAndUpdate(supplayrId, {
    $inc: { price_on: -amount , moneyOn_me: -amount },

  });
};

Buy_bellSchema.pre('save', async function(next) {
  const supplayr = await Supplayr.findOne({ supplayr_name: this.supplayr_name });

  if (!supplayr) {
    const err = new Error(`Supplier with name ${this.supplayr_name} not found`);
    return next(err);
  }

  this.supplayr = supplayr._id;
  next();
});

Buy_bellSchema.post('save', async function () {
 
  await this.constructor.takeMoney_d(this.supplayr, this.pay_bell);
  await this.constructor.takeMoney_b(this.supplayr, this.pay_bell);
});


Buy_bellSchema.post('findOneAndUpdate', async function (doc) {
  if (doc) {
    await doc.constructor.takeMoney_d(doc.supplayr, doc.pay_bell);
    await doc.constructor.takeMoney_b(doc.supplayr, doc.pay_bell);
  }
});
const Buy_bell = mongoose.model('Buy_bell', Buy_bellSchema);

module.exports = Buy_bell;
