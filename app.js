const express = require('express');
const app = express();

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');


//use methos sets up middlewear
//an incoming request has to go through app.use and whatever pass to it
//ROutes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);


module.exports = app;