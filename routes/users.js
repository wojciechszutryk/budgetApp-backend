const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth')
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file,cb){
        cb(null, './uploads/');
    },
    filename: function(req, file,cb){
        cb(null, Date.now() + file.originalname);
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

router.post('/signup', upload.single('userImage'), UsersController.users_signup);

router.post('/login', UsersController.users_login);

router.delete('/:id', checkAuth, UsersController.users_delete);

router.put('/:id/changePhoto', checkAuth, upload.single('userImage'), UsersController.users_photo_change);

router.get('/:id/getPhoto',  UsersController.users_get_userPhoto);

router.get('/:id/getBudgets',  UsersController.users_budgets);

router.get('/:id/getTransactions', UsersController.users_transactions);

router.get('/:id/getCategories', UsersController.users_categories);

router.get('/:id/getParentCategories',  UsersController.users_parentCategories);

module.exports = router;