const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    parentCategory: {type: mongoose.Schema.Types.ObjectId, ref: 'ParentCategory', required: true},
    name: {type: String, required: true},
});

let Category;

if (mongoose.models.category) {
    Category = mongoose.model('category');
} else {
    Category = mongoose.model('category', categorySchema);
}

module.exports = Category;