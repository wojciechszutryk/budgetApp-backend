const Budget = require("../models/budget");
const mongoose = require('mongoose');
const BudgetCategory = require("../models/budgetCategory");
const Transaction = require("../models/transaction");

exports.budgets_get_all = (req, res, next) => {
    Budget.find()
        .select('name totalAmount _id userId')
        .exec()
        .then(docs => {
            const budgets = docs.map(doc => {
                return{
                    id: doc._id,
                    name: doc.name,
                    totalAmount: doc.totalAmount,
                    userId: doc.userId,
                    request:{
                        type: 'GET',
                        url: process.env.SERVER_URL+'budgets/'+doc._id
                    }
                }
            });
            res.status(200).json(budgets);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
}

exports.budgets_create = (req, res, next) => {
    const budget = new Budget({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        totalAmount: req.body.totalAmount,
        userId: req.body.userId,
    });
    budget.save().then(result => {
        console.log(result)
        res.status(201).json({
            message: 'Created Budget successfully',
            createdBudget: {
                name: result.name,
                totalAmount: result.totalAmount,
                id: result._id,
                userId: result.userId,
                request: {
                    type: 'GET',
                    url: process.env.SERVER_URL+'budgets/'+ result._id,
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

exports.budgets_get_single = (req, res, next) => {
    Budget.findById(req.params.id)
        .select('name totalAmount _id userId')
        .exec()
        .then(budget => {
            if (!budget){
                return res.status(404).json({
                    message: 'budget not found'
                })
            }
            res.status(200).json({
                name: budget.name,
                totalAmount: budget.totalAmount,
                id: budget._id,
                userId: budget.userId,
                request:{
                    type: 'GET',
                    url: process.env.SERVER_URL+'budgets/'
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

exports.budgets_get_single_with_budgetCategories = (req, res, next) => {
    Budget.findById(req.params.id)
        .select('name totalAmount _id userId')
        .populate('budgetCategories')
        .exec()
        .then(budget => {
            if (!budget){
                return res.status(404).json({
                    message: 'budget not found'
                })
            }
            BudgetCategory.find({budgetId: budget._id})
                .select('categoryId budget budgetId _id')
                .exec()
                .then(budgetCategories => {
                    res.status(200).json({
                        name: budget.name,
                        totalAmount: budget.totalAmount,
                        id: budget._id,
                        userId: budget.userId,
                        budgetCategories: budgetCategories.map(budgetCategory => {
                            return{
                                categoryId: budgetCategory.categoryId,
                                budget: budgetCategory.budget,
                                budgetId: budgetCategory.budgetId,
                                id: budgetCategory._id
                            }
                        }),
                        request:{
                            type: 'GET',
                            url: process.env.SERVER_URL+'budgets/'
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err,
                    });
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
}

exports.budgets_get_single_with_transactions = (req, res, next) => {
    Budget.findById(req.params.id)
        .select('name totalAmount _id userId')
        .populate('transactions')
        .exec()
        .then(budget => {
            if (!budget){
                return res.status(404).json({
                    message: 'budget not found'
                })
            }
            Transaction.find({budgetId: budget._id})
                .select('categoryId amount date description budgetId _id')
                .exec()
                .then(transactions => {
                    res.status(200).json({
                        name: budget.name,
                        totalAmount: budget.totalAmount,
                        id: budget._id,
                        userId: budget.userId,
                        transactions: transactions.map(transaction => {
                            return{
                                amount: transaction.amount,
                                categoryId: transaction.categoryId,
                                budgetId: transaction.budgetId,
                                description: transaction.description,
                                date: transaction.date,
                                id: transaction._id
                            }
                        }),
                        request:{
                            type: 'GET',
                            url: process.env.SERVER_URL+'budgets/'
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err,
                    });
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
}

exports.budgets_delete = (req, res, next) => {
    Budget.remove({_id: req.params.id})
        .exec()
        .then(() => {
            res.status(200).json({
                message: 'budget deleted',
                request:{
                    type: 'POST',
                    url: process.env.SERVER_URL+'budgets',
                    body: {
                        name : 'String',
                        totalAmount: 'Number',
                        userId: 'ID'
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