// models/User.js
const mongoose = require('mongoose');

const user = {
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  role: { type: String, enum: ['Admin', 'MarketOwner', 'Seller'], required: true },
  branchCode: { type: String, required: true },
  password: {type: String, required: true}
};

// models/Phone.js
const phone = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  cash: { type: String, required: true },
  deposit: { type: String, required: true },

});

// models/Allocation.js
const allocation = {
  number: { type: String, required: true, unique: true },
  market: { type: String, required: true, lowercase:true },
  creator: { type: String, required: true, lowercase:true  },
  owner: { type: String, required: true, lowercase:true  },
  seller: { type: String, required: true, lowercase:true  },
  status: { type: String, default: 'issued' },
  items: [{
    phone: { type: String, required: true },
    serials: { type: Array, required: true },
    toSell: { type: Array, default: []},
    sold: { type: Array, default: []},
  }],
};

// Market Schema
const market = {
  name: { type: String, required: true },
  owner: { type: String, required: true, lowercase:true },
  seller: { type: String, required: true, lowercase:true},
  branchCode: { type: String, required: true },
};

// models/Sale.js
const sale = {
  phone: { type: String, required: true, unique: true},
  serial: { type: String, required: true, unique: true },
  customer: { type: String, required: true },
  msisdn: { type: String, required: true, unique: true },
  mpesa: { type: String, required: true, unique: true },
  receipt: { type: String, unique: true, default:'' },
  seller: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
};

module.exports = {user, market, phone, allocation, sale};

