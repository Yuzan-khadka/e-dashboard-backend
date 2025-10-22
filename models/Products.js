  const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    quantity: Number, 
    userId: String,
    company: String,
    createdDate: Date

});
 
const Products = mongoose.model('products', productSchema);

module.exports = Products;
