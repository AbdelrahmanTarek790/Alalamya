const mongoose = require('mongoose');


const BuySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    supplayr: {
      type: String,
      trim: true,
      required: [true, 'name required'],
    },
    size: {
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
    product_code:{
      type: Number,
      required: true,
    },
    price_Kilo: {
      type: Number,
      required: true,
    },
    price_all: {
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

BuySchema.pre(/^find/, function (next){
  this.populate({path: 'user' , select: 'name -_id'});
   
  this.populate({path: 'prodcut' , select: 'name avg_price wight -_id'});
  next();
})  
BuySchema.statics.calcAveragePrice = async function (
  productId
) {
  const result = await this.aggregate([
    // Stage 1 : get all Buys in specific product
    {
      $match: { product: productId },
    },
    // Stage 2: Grouping Buys based on productID and calc avgPrices, wight
    {
      $group: {
        _id: 'product',
        avgPrice: { $avg: '$avg_price' },
        wieght: { $sum: 'E_wieght' },
      },
    },
  ]);

  // console.log(result);
  
};

BuySchema.post('save', async function () {
  await this.constructor.calcAveragePrice(this.product);
});

const Buy = mongoose.model('Buy', BuySchema);

module.exports = Buy ;
