const Budget = require("../models/budget");
const mongoose = require('mongoose');

exports.budgets_get_all = (req, res, next) => {
    Budget.find()
        .select('name totalAmount _id')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                budgets: docs.map(doc => {
                    return{
                        _id: doc._id,
                        name: doc.name,
                        totalAmount: doc.totalAmount,
                        request:{
                            type: 'GET',
                            url: process.env.SERVER_URL+'budgets/'+doc._id
                        }
                    }
                }),
            });
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
    });
    budget.save().then(result => {
        console.log(result)
        res.status(201).json({
            message: 'Created Budget successfully',
            createdBudget: {
                name: result.name,
                totalAmount: result.totalAmount,
                _id: result._id,
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
        .select('name totalAmount _id')
        .exec()
        .then(budget => {
            if (!budget){
                return res.status(404).json({
                    message: 'budget not found'
                })
            }
            res.status(200).json({
                budget: budget,
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
                        totalAmount: 'Number'
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