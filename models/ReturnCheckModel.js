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

ReturnedCheckSchema.post('save', async function () {
  const mount = this.amount;

  if (!isNaN(mount)) {
    await Clint.findByIdAndUpdate(this.clint, {
      $inc: { money_pay: -mount, money_on: mount }
    });
  } else {
    console.error('Invalid amount value:', mount);
  }
});

const ReturnedCheck = mongoose.model('ReturnedCheck', ReturnedCheckSchema);

module.exports = ReturnedCheck;
