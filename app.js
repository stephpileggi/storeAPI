const express = require('express');
const app = express();
const morgan = require('morgan');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');


app.use(morgan('dev'));

//use methos sets up middlewear
//an incoming request has to go through app.use and whatever pass to it
//ROutes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

//I want to handle any request that was able to make it to this line because we didnt find the proper route
app.use((req, res, next) => {
    const error = new  Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;