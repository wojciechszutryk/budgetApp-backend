const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth')

const CategoriesController = require('../controllers/categories');

router.get('/', checkAuth, CategoriesController.categories_get_all);

router.post('/', checkAuth, CategoriesController.categories_create);

router.get(`/:id`, checkAuth, CategoriesController.categories_get_single);

router.delete(`/:id`, checkAuth, CategoriesController.categories_delete);


module.exports = router;