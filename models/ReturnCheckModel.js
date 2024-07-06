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
  const amount = this.amount;

  // التحقق من أن المبلغ هو رقم صالح
  if (!isNaN(amount)) {
    // تحديث حقول العميل
    const clintId = this.clint;
    await Clint.findByIdAndUpdate(clintId, {
      $inc: { money_pay: -amount, money_on: amount }
    });
  } else {
    console.error('Invalid amount value:', amount);
  }
});

const ReturnedCheck = mongoose.model('ReturnedCheck', ReturnedCheckSchema);

module.exports = ReturnedCheck;
