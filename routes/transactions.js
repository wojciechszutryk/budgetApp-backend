const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth')

const TransactionsController = require('../controllers/transactions');

router.get('/', checkAuth, TransactionsController.transactions_get_all);

router.post('/', checkAuth, TransactionsController.transactions_create);

router.get(`/:id`, checkAuth, TransactionsController.transactions_get_single);

router.delete(`/:id`, checkAuth, TransactionsController.transactions_delete);


module.exports = router;