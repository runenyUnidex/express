const mongoose = require('mongoose')
const products = mongoose.Schema({
    product_id: { type: String },
    product_name: { type: String },
    price: { type: Number },
    amount: { type: Number },
    detail: { type: Object }
})

module.exports = mongoose.model('products', products)