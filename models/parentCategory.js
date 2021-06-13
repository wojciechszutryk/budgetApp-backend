const mongoose = require('mongoose');

const parentCategorySchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
});

let ParentCategory;

if (mongoose.models.parentCategory) {
    ParentCategory = mongoose.model('parentCategory');
} else {
    ParentCategory = mongoose.model('parentCategory', parentCategorySchema);
}

module.exports = ParentCategory;