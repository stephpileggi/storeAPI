const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

//connect to the mongodb path and change the password to whatever it was in mongodb
mongoose.connect('mongodb+srv://node_shop:' + process.env.MONGO_ATLAS_PW + '@cluster0-zlfte.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    });


app.use(morgan('dev'));
//takes json and url encoded data and makes it easier to read
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({});
    }
    next();
});

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