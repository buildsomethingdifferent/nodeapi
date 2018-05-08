const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");

//get all the data
router.get('/',(req,res, next)=>{
Product.find().exec().then(doc=>{
 console.log(doc);
 res.status(200).json(doc);
}).catch(err=>{
    console.log(err);
    res.status(500).json({
     error:err
    });
});   
});
//create record
router.post('/',(req,res,next)=>{
    const product = new Product({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.name,
        price : req.body.price
    })
    product.save().then(result =>{
        console.log(result);
        res.status(201).json({
           message : "Handling post request to /product",
           createdProduct: result
        });
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    })
});

///get record by id
router.get('/:id',(req,res,next)=>{
 const id = req.params.id;
 Product.findById(id).exec().then(docs=>{
   if(docs){
           res.status(201).json(docs);
        }
        else{
            res.json(404).json({
                message : "NO valid entry found"
            })
        }
 }).catch(err=>{
     res.status(500).json({
         error:err
     });
 });
});
//updateing the record


router.patch('/:id', (req,res,next)=>{
  const id = req.params.id;
  const updateOps = {};
  for(const ops of req.body){
      updateOps[ops.propName] = ops.value;
  }
  console.log(updateOps);
   
  Product.update({_id:id},{$set : updateOps}).exec().then(result=>{
      console.log(result);
      res.status(200).json(result);
  }).catch(err=>{
      res.status(404).json({
          error:err
      });
  });
}); 
//deleting the record
router.delete("/:productId", (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
      .exec()
      .then(result => {
        res.status(200).json(result);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });
module.exports = router;

//working update

// router.patch('/:id', (req,res,next)=>{
//     const id = req.params.id;
//     const updateOps = {};
//     var data = {
//         'name':req.name,
//          'price':req.price   
//       };
//       Product.findByIdAndUpdate(id, req.body, (err, user) => {
//           if(err) {
//               res.status(500).json({
//                 error:err
//                })
//           }else
//           {
//               res.status(201).json({
//                   message:{
//                       text : "record created successfully",
//                       data:user
//                   } 
//               })
//           }
          
//       });
//   });

//
// new patch way
// router.patch('/:id', (req,res,next)=>{
//     const id = req.params.id;
//   Product.findByIdAndUpdate(id, req.body, {new: true}, function(err, model) {
//     if(!err){
//         res.status(201).json({
//             data : model
//         });
//     }else{
//         res.status(500).json({
//             message: "not found any relative data"
//         })
//     }
//   }); 
//   }); 