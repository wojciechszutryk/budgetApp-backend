const BudgetCategory = require("../models/BudgetCategory");
const mongoose = require('mongoose');

exports.budgetCategories_get_all = (req, res, next) => {
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
}

exports.budgetCategories_create = (req, res, next) => {
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
}

exports.budgetCategories_get_single = (req, res, next) => {
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
}

exports.budgetCategories_delete = (req, res, next) => {
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
}