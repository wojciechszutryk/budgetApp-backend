const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth')

const BudgetsController = require('../controllers/budgets');

// router.get('/', checkAuth, BudgetsController.budgets_get_all);
//
// router.post('/', checkAuth, BudgetsController.budgets_create);
//
// router.get(`/:id`, checkAuth, BudgetsController.budgets_get_single);
//
// router.delete(`/:id`, checkAuth, BudgetsController.budgets_delete);

router.get('/',  BudgetsController.budgets_get_all);

router.post('/',  BudgetsController.budgets_create);

router.get(`/:id`,  BudgetsController.budgets_get_single);

router.get(`/:id/budgetCategories`,  BudgetsController.budgets_get_single_with_budgetCategories);

router.get(`/:id/transactions`,  BudgetsController.budgets_get_single_with_transactions);

router.delete(`/:id`,  BudgetsController.budgets_delete);


module.exports = router;