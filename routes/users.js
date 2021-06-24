const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth')
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const User = require('../models/user');

const mongoURI = 'mongodb+srv://admin:'+process.env.MONGODB_PW+'@cluster0.ooyuy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const conn = mongoose.createConnection(mongoURI, { useNewUrlParser: true });

let gfs;

conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});

const fileFilter = (req,file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }else{
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024*1024*5
    },
    fileFilter: fileFilter,
});

const UsersController = require('../controllers/users');

router.post('/signup', upload.single('file'), UsersController.users_signup);

router.get('/:id/getPhoto', (req, res, next) => {
    User.findById(req.params.id)
        .select('userImage')
        .exec()
        .then(user => {
            if (!user){
                return res.status(404).json({
                    message: 'user not found'
                })
            }
            gfs.files.findOne({ filename: user.userImage }, (err, file) => {
                if (!file || file.length === 0) {
                    return res.status(404).json({
                        err: 'No file exists'
                    });
                }
                return res.json(file.filename);
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
});

router.post('/login', UsersController.users_login);

router.delete('/:id', checkAuth, UsersController.users_delete);

router.get('/:id/getBudgets',  UsersController.users_budgets);

router.get('/:id/getTransactions', UsersController.users_transactions);

router.get('/:id/getCategories', UsersController.users_categories);

router.get('/:id/getParentCategories',  UsersController.users_parentCategories);

router.put('/:id/changePhoto', checkAuth, upload.single('file'), (req, res) => {
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
                    gfs.remove({ filename: user[0].userImage, root: 'uploads' }, (err, gridStore) => {
                        if (err) {
                            return res.status(404).json({ err: err });
                        }
                    });
                    const photo = req.file.filename;
                    User.updateOne({_id: id}, {userImage: photo})
                        .exec()
                        .then(result => {
                            res.status(200).json({
                                filename: user[0].userImage,
                                message: 'Photo updated',
                            })
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({error:err});
                        });
                } catch(err) {
                    console.error(err)
                }
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:err});
        });
});

//
// router.post('/upload', upload.single('file'), (req, res) => {
//     res.json(
//         {
//             filename: req.file.filename,
//             id: req.file.id,
//         }
//     );
// });
//
// router.get('/files', (req, res) => {
//     gfs.files.find().toArray((err, files) => {
//         if (!files || files.length === 0) {
//             return res.status(404).json({
//                 err: 'No files exist'
//             });
//         }
//         return res.json(files);
//     });
// });
//
// router.get('/files/:filename', (req, res) => {
//     gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//         if (!file || file.length === 0) {
//             return res.status(404).json({
//                 err: 'No file exists'
//             });
//         }
//         return res.json(file);
//     });
// });
//
router.get('/image/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            // Read output to browser
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        } else {
            res.status(404).json({
                err: 'Not an image'
            });
        }
    });
});
//
// router.delete('/files/:id', (req, res) => {
//     gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
//         if (err) {
//             return res.status(404).json({ err: err });
//         }
//     });
//     res.json(
//         { message: 'file deleted' }
//     );
// });

module.exports = router;