const mongoose = require('mongoose');

const budgetSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    totalAmount: {type: Number, required: true},
});

module.exports = mongoose.model('budget', budgetSchema);