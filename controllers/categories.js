const Category = require("../models/category");
const ParentCategory = require("../models/parentCategory");
const mongoose = require('mongoose');

exports.categories_get_all = (req, res, next) => {
    Category.find()
        .select('parentCategory name _id')
        .populate('parentCategories')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                categories: docs.map(doc => {
                    return{
                        _id: doc._id,
                        parentCategory: doc.parentCategory,
                        name: doc.name,
                        request:{
                            type: 'GET',
                            url: process.env.SERVER_URL+'categories/'+doc._id
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

exports.categories_create = (req, res, next) => {
    ParentCategory.findById(req.body.parentCategoryId)
        .then(parentCategory => {
            if (!parentCategory){
                return res.status(404).json({
                    message: 'parentCategory not found'
                })
            }
            const category = new Category({
                _id: mongoose.Types.ObjectId(),
                name: req.body.name,
                parentCategory: req.body.parentCategoryId,
            });
            return category.save()
        }).then(result => {
        console.log(result)
        res.status(201).json({
            message: 'Category stored',
            createdCategory: {
                _id: result._id,
                parentCategoryId: result.parentCategory,
                name: result.name,
                request:{
                    type: 'GET',
                    url: process.env.SERVER_URL+'categories/'+result._id
                }
            },
        });
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        })
}

exports.categories_get_single = (req, res, next) => {
    Category.findById(req.params.id)
        .select('parentCategory name _id')
        .populate('parentCategories')
        .exec()
        .then(category => {
            if (!category){
                return res.status(404).json({
                    message: 'category not found'
                })
            }
            res.status(200).json({
                category: category,
                request:{
                    type: 'GET',
                    url: process.env.SERVER_URL+'categories/'
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

exports.categories_delete = (req, res, next) => {
    Category.remove({_id: req.params.id})
        .exec()
        .then(() => {
            res.status(200).json({
                message: 'Category deleted',
                request:{
                    type: 'POST',
                    url: process.env.SERVER_URL+'categories',
                    body: {
                        parentCategoryId : 'ID',
                        name: 'String'
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