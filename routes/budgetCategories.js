const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth')

const BudgetCategoriesController = require('../controllers/budgetCategories');

router.get('/', checkAuth, BudgetCategoriesController.budgetCategories_get_all);

router.post('/', BudgetCategoriesController.budgetCategories_create);

router.get(`/:id`, checkAuth, BudgetCategoriesController.budgetCategories_get_single);

router.delete(`/:id`, checkAuth, BudgetCategoriesController.budgetCategories_delete);


module.exports = router;