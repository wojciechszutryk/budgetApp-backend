const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth')
const mongoose = require('mongoose');
const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const transactionsSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    amount: {type: Number, required: true},
    date: {type: String, required: true},
    description: {type: String, required: true},
    budgetId: {type: mongoose.Schema.Types.ObjectId, ref: 'Budget', required: true},
    categoryId: {type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

let Transaction;

if (mongoose.models.transactions) {
    Transaction = mongoose.model('transactions');
} else {
    Transaction = mongoose.model('transactions', transactionsSchema);
}

router.get('/', checkAuth, (req, res, next) => {
    Transaction.find()
        .select('categoryId amount date description budgetId _id userId')
        .exec()
        .then(docs => {
            const transactions = docs.map(doc => {
                return{
                    id: doc._id,
                    budgetId: doc.budgetId,
                    userId: doc.userId,
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
});

router.post('/', (req, res, next) => {
        const transaction = new Transaction({
            _id: new mongoose.Types.ObjectId(),
            amount: req.body.amount,
            budgetId: req.body.budgetId,
            userId: req.body.userId,
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
                    userId: result.userId,
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
);

router.get(`/:id`, checkAuth, (req, res, next) => {
        Transaction.findById(req.params.id)
            .select('categoryId amount date description budgetId _id userId')
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
                    userId: transaction.userId,
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
);

router.delete(`/:id`, checkAuth, (req, res, next) => {
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
                        userId : 'Id',
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
});

module.exports = router;