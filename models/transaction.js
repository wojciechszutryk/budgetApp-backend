const mongoose = require('mongoose');

const transactionsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    amount: {type: Number, required: true},
    date: {type: String, required: true},
    description: {type: String, required: true},
    budgetId: {type: mongoose.Schema.Types.ObjectId, ref: 'Budget', required: true},
    categoryId: {type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true},
});

module.exports = mongoose.model('transactions', transactionsSchema);