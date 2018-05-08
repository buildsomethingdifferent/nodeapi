const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser =require('body-parser');
const orderRoutes = require('./api/routes/orders');
const productRoutes = require('./api/routes/products');

const mongoose = require('mongoose');
mongoose.connect('mongodb://ovaix:nodemongo@nodemongo-shard-00-00-sookk.mongodb.net:27017,nodemongo-shard-00-01-sookk.mongodb.net:27017,nodemongo-shard-00-02-sookk.mongodb.net:27017/test?ssl=true&replicaSet=NodeMongo-shard-0&authSource=admin');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//headers response
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin', '*'),
    res.header('Access-Controll-Allow-Headers',
     'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Controll-Allow-Methods','PUT,POST,PATCH,DELETE');
        return res.status(200).json({

        });
    }
    next();
});
app.use('/orders', orderRoutes);
app.use('/products', productRoutes);
app.use((req,res, next)=>{
    const error = new Error('not found');
    error.status = 404;
    next(error);
});
app.use((error, req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message : error.message
        } 
    });
});
module.exports = app;