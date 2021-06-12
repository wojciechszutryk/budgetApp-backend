const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const ParentCategoriesController = require('../controllers/parentCategories');

router.get('/', checkAuth, ParentCategoriesController.parentCategories_get_all);

router.post('/', checkAuth, ParentCategoriesController.parentCategories_create);

router.get(`/:id`, checkAuth, ParentCategoriesController.parentCategories_get_single);

router.delete(`/:id`, checkAuth, ParentCategoriesController.parentCategories_delete);


module.exports = router;