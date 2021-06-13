const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    totalAmount: {type: Number, required: true},
});

let Budget;

if (mongoose.models.budget) {
    Budget = mongoose.model('budget');
} else {
    Budget = mongoose.model('budget', budgetSchema);
}

module.exports = Budget;