const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const usersRoutes = require('./routes/users')
const parentCategoriesRoutes = require('./routes/parentCategories')
const categoriesRoutes = require('./routes/categories')
const budgetsRoutes = require('./routes/budgets')
const budgetCategoriesRoutes = require('./routes/budgetCategories')
const transactionsRoutes = require('./routes/transactions')

mongoose.connect('mongodb+srv://admin:'+process.env.MONGODB_PW+'@cluster0.ooyuy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res,next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-methods', 'GET,PUT,POST,PATCH,DELETE');
        return  res.status(200).json({});
    }
    next();
})

app.use('/users', usersRoutes);
app.use('/parentCategories', parentCategoriesRoutes);
app.use('/categories', categoriesRoutes);
app.use('/budgetCategories', budgetCategoriesRoutes);
app.use('/transactions', transactionsRoutes);
app.use('/budgets', budgetsRoutes);

app.use((req, res,next) => {
    const error =new Error('not found');
    error.status = 404;
    next(error);
});

app.use((error, req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;