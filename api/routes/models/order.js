const mongoose = require('mongoose');

//one order is connected to a product
//mongoDB is a non relational database, but we are going to build a relation here(lots of relations, use sql)
const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 }
});

module.exports = mongoose.model('Order', orderSchema);