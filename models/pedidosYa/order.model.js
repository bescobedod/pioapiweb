// models/PedidosYa.js
const mongoose = require('mongoose');

const PedidosYaSchema = new mongoose.Schema({
  orderData: {
    customer: {
      firstName: String,
      lastName: String,
    },
    price: {
      grandTotal: String,
    },
    products: [{
      name: String,
      quantity: String,
      unitPrice: String
    }],
    corporateTaxId: String,
    createdAt: Date
  },
  storeId: String,
  empresa: String,
  tienda: String,
  orderId: String,
  estado: String,
  fecha: Date
}, { collection: 'orders' });

module.exports = mongoose.model('test', PedidosYaSchema);