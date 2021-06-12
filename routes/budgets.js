const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth')

const BudgetsController = require('../controllers/budgets');

router.get('/', checkAuth, BudgetsController.budgets_get_all);

router.post('/', checkAuth, BudgetsController.budgets_create);

router.get(`/:id`, checkAuth, BudgetsController.budgets_get_single);

router.delete(`/:id`, checkAuth, BudgetsController.budgets_delete);


module.exports = router;