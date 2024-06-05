const mongoose = require('mongoose');


const supplayrSchema = new mongoose.Schema(
  {
    
    supplayr_name: {
      type: String,
      trim: true,
      required: [true, 'name required'],
    },

    price_on: {
      type: Number,
      required: true,
      default:0,
    },

    price_pay: {
      type: Number,
      required: true,
      default:0,
    },
    
    total_price: {
      type: Number,
      required: true,
      default:0,
    },
    

  },
  { timestamps: true }
);


const Supplayr = mongoose.model('Supplayr', supplayrSchema);

module.exports = Supplayr ;
