const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

//here we can adjust how files like images are stored
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

//setup filter for files
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        //to reject a file
        cb(null, false);
    }
};

//initializing multer and saying store everything
const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const Product = require('./models/product');

router.get('/', (req, res, next) => {
    Product.find()
    //.select allows us to cotrol which data we want to fetch
    .select('name price _id productImage')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: req.protocol + '://' + req.get('host') +req.originalUrl + '/' + doc._id
                    }
                }
            })
        };
        // if(docs.length >= 0) {
            res.status(200).json(response);
        // } else {
        //     res.status(404).json({
        //         message: 'No entries found'
        //     });
        // }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

//we are using upload from multer and using the single method on it to get ine file only
router.post('/', upload.single('productImage'), (req, res, next) => {
    console.log(req.file)
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Created product successfully",
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: req.protocol + '://' + req.get('host') +req.originalUrl + '/' + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        console.log("From database", doc);
        if(doc) {
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    description: "Get all products",
                    url: 'http://localhost:7000/products'

                }
            });
        } else {
            res.status(404).json({
                message: 'No valid entry found for provided ID'
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err})
    });
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, { $set: updateOps })
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Product Updated',
            request: {
                type: 'GET',
                url: req.protocol + '://' + req.get('host') +req.originalUrl
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Product deleted",
            request: {
                type: 'POST',
                url: req.protocol + '://' + req.get('host') + '/products',
                body: { name: 'String', price: 'Number'}
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;