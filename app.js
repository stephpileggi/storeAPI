const express = require('express');
const app = express();

const productRoutes = require('./api/routes/products');


//use methos sets up middlewear
//an incoming request has to go through app.use and whatever pass to it
app.use('/products', productRoutes);

module.exports = app;