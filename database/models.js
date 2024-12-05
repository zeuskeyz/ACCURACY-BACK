const { model, Schema } = require('mongoose')
const { user, allocation, phone, sale, market} = require('./schemas')

const timeStamp = { timestamps: true }

const User = model('User', new Schema(user, timeStamp))
const Market = model("Market", new Schema(market, timeStamp))
const Phone = model("Phone", new Schema(phone, timeStamp))
const Allocation = model("Allocation", new Schema(allocation, timeStamp))
const Sale = model("Sale", new Schema(sale, timeStamp))

module.exports = { User, Market, Phone, Allocation, Sale }