const Transaction = require("../models/Transaction");
const mongoose = require('mongoose');

exports.transactions_get_all = (req, res, next) => {
    Transaction.find()
        .select('categoryId amount date description budgetId _id')
        .exec()
        .then(docs => {
            const transactions = docs.map(doc => {
                return{
                    id: doc._id,
                    budgetId: doc.budgetId,
                    amount: doc.amount,
                    categoryId: doc.categoryId,
                    description: doc.description,
                    date: doc.date,
                    request:{
                        type: 'GET',
                        url: process.env.SERVER_URL+'transactions/'+doc._id
                    }
                }
            })
            res.status(200).json(transactions);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
}

exports.transactions_create = (req, res, next) => {
    const transaction = new Transaction({
        _id: new mongoose.Types.ObjectId(),
        amount: req.body.amount,
        budgetId: req.body.budgetId,
        categoryId: req.body.categoryId,
        description: req.body.description,
        date: req.body.date,
    });
    transaction.save().then(result => {
        console.log(result)
        res.status(201).json({
            message: 'Created transaction successfully',
            createdTransaction: {
                amount: result.amount,
                categoryId: result.categoryId,
                budgetId: result.budgetId,
                description: result.description,
                date: result.date,
                id: result._id,
                request: {
                    type: 'GET',
                    url: process.env.SERVER_URL+'transactions/'+ result._id,
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

exports.transactions_get_single = (req, res, next) => {
    Transaction.findById(req.params.id)
        .select('categoryId amount date description budgetId _id')
        .exec()
        .then(transaction => {
            if (!transaction){
                return res.status(404).json({
                    message: 'budgetCategory not found'
                })
            }
            res.status(200).json({
                amount: transaction.amount,
                categoryId: transaction.categoryId,
                budgetId: transaction.budgetId,
                description: transaction.description,
                date: transaction.date,
                id: transaction._id,
                request:{
                    type: 'GET',
                    url: process.env.SERVER_URL+'transactions/'
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

exports.transactions_delete = (req, res, next) => {
    Transaction.remove({_id: req.params.id})
        .exec()
        .then(() => {
            res.status(200).json({
                message: 'Transaction deleted',
                request:{
                    type: 'POST',
                    url: process.env.SERVER_URL+'transactions',
                    body: {
                        amount : 'Number',
                        categoryId : 'Id',
                        budgetId : 'Id',
                        description : 'String',
                        date : 'String',
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