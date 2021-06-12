const mongoose = require('mongoose');

const budgetCategorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    budget: {type: Number, required: true},
    budgetId: {type: mongoose.Schema.Types.ObjectId, ref: 'Budget', required: true},
    categoryId: {type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true},
});

module.exports = mongoose.model('budgetCategory', budgetCategorySchema);