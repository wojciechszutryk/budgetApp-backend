const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

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

router.get('/', checkAuth, (req, res, next) => {
    BudgetCategory.find()
        .select('categoryId budget budgetId _id')
        .exec()
        .then(docs => {
            const budgetCategories = docs.map(doc => {
                return{
                    id: doc._id,
                    budgetId: doc.budgetId,
                    budget: doc.budget,
                    categoryId: doc.categoryId,
                    request:{
                        type: 'GET',
                        url: process.env.SERVER_URL+'budgetCategories/'+doc._id
                    }
                }
            })
            res.status(200).json(budgetCategories);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
});

router.post('/', (req, res, next) => {
    const budgetCategory = new BudgetCategory({
        _id: new mongoose.Types.ObjectId(),
        budget: req.body.budget,
        budgetId: req.body.budgetId,
        categoryId: req.body.categoryId,
    });
    budgetCategory.save().then(result => {
        console.log(result)
        res.status(201).json({
            message: 'Created budgetCategory successfully',
            createdBudgetCategory: {
                budget: result.budget,
                categoryId: result.categoryId,
                budgetId: result.budgetId,
                id: result._id,
                request: {
                    type: 'GET',
                    url: process.env.SERVER_URL+'budgetCategories/'+ result._id,
                }
            },
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.get(`/:id`, checkAuth, (req, res, next) => {
    BudgetCategory.findById(req.params.id)
        .select('categoryId budget budgetId _id')
        .exec()
        .then(budgetCategory => {
            if (!budgetCategory){
                return res.status(404).json({
                    message: 'budgetCategory not found'
                })
            }
            res.status(200).json({
                budget: budgetCategory.budget,
                categoryId: budgetCategory.categoryId,
                budgetId: budgetCategory.budgetId,
                id: budgetCategory._id,
                request:{
                    type: 'GET',
                    url: process.env.SERVER_URL+'budgetCategories/'
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
});

router.delete(`/:id`, checkAuth, (req, res, next) => {
    BudgetCategory.remove({_id: req.params.id})
        .exec()
        .then(() => {
            res.status(200).json({
                message: 'BudgetCategory deleted',
                request:{
                    type: 'POST',
                    url: process.env.SERVER_URL+'budgetCategories',
                    body: {
                        budget : 'Number',
                        categoryId : 'Id',
                        budgetId : 'Id',
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
});


module.exports = router;