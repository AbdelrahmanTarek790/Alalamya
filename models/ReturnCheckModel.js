const mongoose = require('mongoose');
const Clint = require('./ClintModel');

const ReturnedCheckSchema = new mongoose.Schema(
  {
    clint: {
      type: mongoose.Schema.ObjectId,
      ref: 'Clint',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } 
);
ReturnedCheckSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name -_id' })
      .populate({ path: 'clint', select: 'clint_name money_pay money_on _id' });

  next();
});
const mount = this.amount;

ReturnedCheckSchema.post('save', async function () {
  await Clint.findByIdAndUpdate(this.clint, {
    $inc: { money_pay: -mount },
    $inc: { money_on: +mount },

  });
});

const ReturnedCheck = mongoose.model('ReturnedCheck', ReturnedCheckSchema);

module.exports = ReturnedCheck;
