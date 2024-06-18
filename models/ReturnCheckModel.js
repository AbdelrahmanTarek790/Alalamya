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
const mount = this.amount;

ReturnedCheckSchema.post('save', async function () {
  await Clint.findByIdAndUpdate(this.clint, {
    $inc: { money_pay: -mount },
    $inc: { money_on: +mount },

  });
});

const ReturnedCheck = mongoose.model('ReturnedCheck', ReturnedCheckSchema);

module.exports = ReturnedCheck;
