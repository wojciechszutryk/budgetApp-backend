const mongoose = require('mongoose');
const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const transactionsSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    amount: {type: Number, required: true},
    date: {type: String, required: true},
    description: {type: String, required: true},
    budgetId: {type: mongoose.Schema.Types.ObjectId, ref: 'Budget', required: true},
    categoryId: {type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true},
});

let Transaction;

if (mongoose.models.transactions) {
    Transaction = mongoose.model('transactions');
} else {
    Transaction = mongoose.model('transactions', transactionsSchema);
}

module.exports = Transaction;