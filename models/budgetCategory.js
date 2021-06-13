const mongoose = require('mongoose');

const budgetCategorySchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    budget: {type: Number, required: true},
    budgetId: {type: mongoose.Schema.Types.ObjectId, ref: 'Budget', required: true},
    categoryId: {type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true},
});

let BudgetCategory;

if (mongoose.models.budgetCategory) {
    BudgetCategory = mongoose.model('budgetCategory');
} else {
    BudgetCategory = mongoose.model('budgetCategory', budgetCategorySchema);
}

module.exports = BudgetCategory;