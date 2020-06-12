const express = require('express');
const app = express();


//use methos sets up middlewear
//an incoming request has to go through app.use and whatever pass to it
app.use((req, res, next)=> {
    res.status(200).json({
        message: 'It works'
    });
});

module.exports = app;