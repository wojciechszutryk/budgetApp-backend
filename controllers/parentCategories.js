const ParentCategory = require("../models/parentCategory");
const mongoose = require('mongoose');

exports.parentCategories_get_all = (req, res, next) => {
    ParentCategory.find()
        .select('name _id')
        .exec()
        .then(docs => {
            const parentCategories = docs.map(doc => {
                return{
                    id: doc._id,
                    name: doc.name,
                    request:{
                        type: 'GET',
                        url: process.env.SERVER_URL+'parentCategories/'+doc._id
                    }
                }
            })
            res.status(200).json(parentCategories);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
}

exports.parentCategories_create = (req, res, next) => {
    const parentCategory = new ParentCategory({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
    });
    parentCategory.save().then(result => {
        console.log(result)
        res.status(201).json({
            message: 'Created parentCategory successfully',
            createdParentCategory: {
                name: result.name,
                id: result._id,
                request: {
                    type: 'GET',
                    url: process.env.SERVER_URL+'parentCategories/'+ result._id,
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

exports.parentCategories_get_single = (req, res, next) => {
    ParentCategory.findById(req.params.id)
        .select('name _id')
        .exec()
        .then(parentCategory => {
            if (!parentCategory){
                return res.status(404).json({
                    message: 'ParentCategory not found'
                })
            }
            res.status(200).json({
                name: parentCategory.name,
                id: parentCategory._id,
                request:{
                    type: 'GET',
                    url: process.env.SERVER_URL+'parentCategories/'
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

exports.parentCategories_delete = (req, res, next) => {
    ParentCategory.remove({_id: req.params.id})
        .exec()
        .then(() => {
            res.status(200).json({
                message: 'ParentCategory deleted',
                request:{
                    type: 'POST',
                    url: process.env.SERVER_URL+'parentCategories',
                    body: {
                        name : 'String',
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