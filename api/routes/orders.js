const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Order = require('../models/order');
const Product = require('../models/product');
router.get('/',(req,res,next)=>{
    Order.find()
    .select('product quantity _id')
    .exec().then(docs=>{
        res.status(200).json({
            count: docs.length,
            data: docs.map(doc=>{
                return{
                    _id:doc._id,
                    quantity: doc.quantity,
                    product: doc.product,
                    request:{
                        type:"GET",
                        url:"localhost:3000/orders/"+doc._id
                    }
                }
            })
        });
    }).catch(err=>{
        res.status(404).json({
            error:err
        })
    });
})

router.post('/', (req,res,next)=>{
    Product.findById(req.body.product).then(
        product=>{
            if(!product){
               return res.status(404).json({
                    message: "Product not found"
                })
            }
            const order = new Order({
                _id : mongoose.Types.ObjectId(),
                quantity : req.body.quantity,
                product: req.body.productId 
          });
          return order.save();
        })
          .then(result=>{
              console.log(result);
              res.status(201).json({
                  message: 'order stored',
                  data:{
                      _id: result._id,
                      quantity:result.quantity,
                      product:result.product
                  },
                  request:{
                      type:"GET",
                      url:"localhost:3000/orders/"+result._id
                  }
              });
          }).catch(err=>{
       res.status(500).json({
           error:err
       });
    });
});

router.get('/:productId',(req,res,next)=>{
 const id = req.params.productId;
 Order.findById(id)
 .select('product quantity _id')
 .exec().then(result=>{
     
     if(!result){
         return res.status(500).json({
             message: "product not found"
         });
     } 
     res.status(200).json({
         data:result
     }); 
 }).catch(err=>{
     res.status(404).json({
         error:err
     });
 });
});

module.exports = router;