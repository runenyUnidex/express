const mongoose = require('mongoose')
const users = mongoose.Schema({
    user_id: { type: Number },
    username: { type: String },
    password: { type: String },
    fname: { type: String },
    lname: { type: String },
    age: { type: Number },
    sex: { type: String },
    role: { type: String},
    email: { type: String }
})

module.exports = mongoose.model('users', users)