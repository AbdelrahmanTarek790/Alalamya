const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true,
    },
    product_code: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

warehouseSchema.pre(/^find/, function (next) {
this.populate({ path: 'user', select: 'name -_id' })
    .populate({ path: 'product', select: 'type avg_price weight -_id' })
    next();
  });

const Warehouse = mongoose.model('Warehouse', warehouseSchema);

module.exports = Warehouse;
