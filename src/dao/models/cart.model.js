const mongoose = require('mongoose');

const collectionName = 'carts';

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products' 
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ]
});

cartSchema.pre('findOne', function () {
    this.populate('products.product');
});

const cartModel = mongoose.model(collectionName, cartSchema);

module.exports = cartModel;