const mongoose = require('mongoose');


const supplayrSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    supplayr_name: {
      type: String,
      trim: true,
      required: [true, 'name required'],
    },

    product_code :{
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
      price: {
      type: Number,
      required: true,
    },
    

  },
  { timestamps: true }
);
supplayrSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name',})

    .populate({
      path: 'Product',
      select: 'name size',
    });

    next();
    
  });
  

const Supplayr = mongoose.model('Supplayr', supplayrSchema);

module.exports = Supplayr ;
