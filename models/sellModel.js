const mongoose = require('mongoose');


const SellSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    clint: {
      type: String,
      trim: true,
      required: [true, 'name required'],
    },
    
    o_wieght: {
      type: Number,
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
    },
    size: {
      type: Number,
      required: true,
    },
    product_code:{
      type: Number,
      required: true,
    },
    price_Kilo: {
      type: Number,
      required: true,
    },
    price_allQuantity: {
      type: Number,
      required: true,
    },
    pay:{
      type: Number,
      required: true,
    },
    pay_on:{
      type: Number,
      required: true,
    },

  },
  { timestamps: true }
);
SellSchema.pre(/^find/, function (next){
  this.populate({path: 'user' , select: 'name -_id'});
   
  this.populate({path: 'prodcut' , select: 'name avg_price wight -_id'});
  next();
})  
SellSchema.statics.calcAveragePrice = async function (
  productId
) {
  const result = await this.aggregate([
    // Stage 1 : get all Sells in specific product
    {
      $match: { product: productId },
    },
    // Stage 2: Grouping Sells based on productID and calc avgPrices, wight
    {
      $group: {
        _id: 'product',
        wieght: { $subtract: 'o_wieght' },
      },
    },
  ]);

  // console.log(result);
  
};

SellSchema.post('save', async function () {
  await this.constructor.calcAveragePrice(this.product);
});
  

const Sell = mongoose.model('Sell', SellSchema);

module.exports = Sell ;
