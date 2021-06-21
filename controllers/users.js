const User = require('../models/user');
const Budget = require('../models/budget');
const Category = require('../models/category');
const ParentCategory = require('../models/parentCategory');
const Transaction = require('../models/transaction');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

exports.users_signup = (req, res) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length >= 1){
                return res.status(409).json({
                    message: 'Mail exists'
                })
            }else{
                bcrypt.hash(req.body.password,10, (err, hash) =>{
                    if (err){
                        return res.status(500).json({
                            error: err
                        })
                    }else{
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            userName: req.body.userName,
                            password: hash,
                            userImage: req.file.path,
                        });
                        user
                            .save()
                            .then(result =>{
                                console.log(result)
                                res.status(201).json({
                                    email: result.email,
                                    id: result._id,
                                    userName: result.userName,
                                    message: 'User created'
                                })
                            })
                            .catch(err =>{
                                console.log(err);
                                res.status(500).json({
                                    error: err,
                                })
                            });
                    }
                })
            }
        })
};

exports.users_login = (req, res) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length < 1){
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
                if(err){
                    return res.status(401).json({
                        message: 'Auth failed'
                    })
                }
                if(result){
                    const token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id,
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h",
                        }
                    );
                    return res.status(200).json({
                        id: user[0]._id,
                        userName: user[0].userName,
                        userImage: user[0].userImage,
                        message: 'Auth successful',
                        token: token,
                    })
                }
                return res.status(401).json({
                    message: 'Auth failed'
                })
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err});
        });
};

exports.users_photo_change = (req, res) => {
    const id = req.params.id;
    User.find({_id: id})
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'No user found'
                })
            }
            else{
                try {
                    fs.unlinkSync(user[0].userImage)
                } catch(err) {
                    console.error(err)
                }
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err});
        });
    const photo = req.file.path;
    User.updateOne({_id: id}, {userImage: photo})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Photo updated',
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err});
        });
};

exports.users_get_userPhoto = (req, res, next) => {
    User.findById(req.params.id)
        .select('userImage')
        .exec()
        .then(user => {
            if (!user){
                return res.status(404).json({
                    message: 'user not found'
                })
            }
            res.status(200).json({
                userImage: user.userImage,
                id: user._id,
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
}

exports.users_delete =(req, res) =>{
    User.remove({_id: req.params.id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted',
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err});
        });
};

exports.users_budgets = (req, res) => {
    Budget.find({userId: req.params.id})
        .exec()
        .then(budget => {
            if (budget.length < 1){
                return res.status(401).json([])
            }
            else{
                const foundBudgets = budget.map(bud => ({
                    id: bud._id,
                    name: bud.name,
                    totalAmount: bud.totalAmount,
                    userId: bud.userId,
                }));
                return res.status(200).json(foundBudgets)
            }
            })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err});
        });
};

exports.users_categories = (req, res) => {
    Category.find({userId: req.params.id})
        .exec()
        .then(category => {
            if (category.length < 1){

                return res.status(401).json([])
            }
            else{
                const foundCategories = category.map(cat => ({
                    id: cat._id,
                    parentCategory: cat.parentCategory,
                    name: cat.name,
                    userId: cat.userId,
                }));
                return res.status(200).json(foundCategories)
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err});
        });
};

exports.users_transactions = (req, res) => {
    Transaction.find({userId: req.params.id})
        .exec()
        .then(transaction => {
            if (transaction.length < 1){
                return res.status(401).json([])
            }
            else{
                const foundTransactions = transaction.map(trans => ({
                    id: trans._id,
                    userId: trans.userId,
                    amount: trans.amount,
                    date: trans.date,
                    description: trans.description,
                    budgetId: trans.budgetId,
                    categoryId: trans.categoryId,
                }));
                return res.status(200).json(foundTransactions)
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err});
        });
};

exports.users_parentCategories = (req, res) => {
    ParentCategory.find({userId: req.params.id})
        .exec()
        .then(parentCategory => {
            if (parentCategory.length < 1){
                return res.status(401).json([])
            }
            else{
                const foundParentCategories = parentCategory.map(cat => ({
                    id: cat._id,
                    name: cat.name,
                    userId: cat.userId,
                }));
                return res.status(200).json(foundParentCategories)
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err});
        });
};
