const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    product_id: { type: String },
    product_name: { type: String },
    amount: { type: Number }
});

const orders = mongoose.Schema({
    order_id: { type: Number },
    buyer_id: { type: String },
    total_price: { type: Number },
    order_date: { type: Date },
    item_list: [itemSchema]
})

module.exports = mongoose.model('orders', orders)