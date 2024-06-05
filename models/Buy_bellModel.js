const mongoose = require('mongoose');
const User = require('./userModel');
const Buy = require('./BuyModel');
const Supplayr =require('./SupplayrModel');

const Buy_bellSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
      supplayr: {
        type: mongoose.Schema.ObjectId,
        ref: 'Supplayr',
      },
      pay_bell:{
        type: Number,
        required: true,
        default:0,
      },
      
    },
    { timestamps: true }
  );
  
  Buy_bellSchema.pre(/^find/, function (next) {
    this.populate({ path: 'user', select: 'name -_id' })
      .populate({ path: 'supplayr', select: 'supplayr_name price_pay price_on total_price -_id' });
  
    next();
  });


  Buy_bellSchema.statics.takeMoney_d = async function(supplayrId,priceall) {
    await Supplayr.findByIdAndUpdate(supplayrId, {
       $inc:{price_pay: +priceall},
    });
  };
  
  Buy_bellSchema.statics.takeMoney_b = async function(supplayrId,pricePay) {
    await Supplayr.findByIdAndUpdate(supplayrId, {
       $inc:{price_on: -pricePay},
    });
  };

  Buy_bellSchema.post('save', async function () {
     await this.constructor.takeMoney_d(this.supplayr,this.pay_bell);
     await this.constructor.takeMoney_b(this.supplayr,this.pay_bell);
    
   });

  const Buy_bell = mongoose.model('Buy_bell', Buy_bellSchema);

module.exports = Buy_bell ;
